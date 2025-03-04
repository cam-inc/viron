package config

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/cam-inc/viron/example/golang/pkg/constant"
	pkgConfig "github.com/cam-inc/viron/packages/golang/config"
	pkgConstant "github.com/cam-inc/viron/packages/golang/constant"
	pkgDomainsAuth "github.com/cam-inc/viron/packages/golang/domains/auth"
	pkgHelpers "github.com/cam-inc/viron/packages/golang/helpers"
	pkgRoutesAuth "github.com/cam-inc/viron/packages/golang/routes/auth"
	"github.com/go-sql-driver/mysql"
)

type (
	Mode   string
	Config struct {
		StoreMode  Mode
		StoreMySQL *MySQL
		StoreMongo *Mongo
		Cors       *Cors
		Auth       pkgConfig.Auth
		Oas        *Oas
	}

	Store struct {
		Mode string
		*MySQL
		*Mongo
		options.ClientOptions
	}

	Mongo struct {
		URI                   string
		User                  string
		Password              string
		VironDB               string
		CasbinCollectionName  string
		CasbinLoadIntervalSec *int64
	}

	MySQL struct {
		Dialect               string
		User                  string `yaml:"user"`
		Password              string `yaml:"password"`
		Net                   string `yaml:"net"`
		Host                  string `yaml:"host"`
		Port                  int    `yaml:"port"`
		DBName                string `yaml:"dbname"`
		TLSConfig             string `yaml:"tls"`
		AllowNativePasswords  bool   `yaml:"native_password"`
		ParseTime             bool   `yaml:"parse_time"`
		CasbinLoadIntervalSec *int64 `yaml:"casbin_load_interval_sec"`
	}

	Cors struct {
		AllowOrigins []string `yaml:"allowOrigins"`
	}

	Oas struct {
		InfoExtensions map[string]interface{} `json:"infoExtensions"`
	}
)

const (
	StoreModeMongo Mode = "mongo"
	StoreModeMySQL Mode = "mysql"
)

func (m *MySQL) ToDriverConfig() *mysql.Config {
	return &mysql.Config{
		Addr:                 fmt.Sprintf("%s:%d", m.Host, m.Port),
		DBName:               m.DBName,
		User:                 m.User,
		Passwd:               m.Password,
		Net:                  m.Net,
		ParseTime:            m.ParseTime,
		TLSConfig:            m.TLSConfig,
		AllowNativePasswords: m.AllowNativePasswords,
	}
}

func New() *Config {
	mysqlPort, _ := strconv.Atoi(os.Getenv(constant.MYSQL_PORT))
	mode := StoreModeMongo
	if os.Getenv(pkgConstant.ENV_STORE_MODE) == string(StoreModeMySQL) {
		mode = StoreModeMySQL
	}

	// google oauth2の設定
	googleOAuth2Config := pkgConfig.GoogleOAuth2{
		ClientID:          os.Getenv(constant.GOOGLE_OAUTH2_CLIENT_ID),
		ClientSecret:      os.Getenv(constant.GOOGLE_OAUTH2_CLIENT_SECRET),
		AdditionalScope:   []string{},
		UserHostedDomains: []string{"cam-inc.co.jp", "cyberagent.co.jp"},
		IssuerURL:         os.Getenv(constant.GOOGLE_OAUTH2_ISSUER_URL),
	}
	// oidcの設定
	oidcConfig := pkgConfig.OIDC{
		ClientID:          os.Getenv(constant.OIDC_CLIENT_ID),
		ClientSecret:      os.Getenv(constant.OIDC_CLIENT_SECRET),
		AdditionalScope:   []string{},
		UserHostedDomains: []string{"cam-inc.co.jp", "cyberagent.co.jp"},
		IssuerURL:         os.Getenv(constant.OIDC_ISSUER_URL),
	}

	// emailの設定
	emailJwtIssuer := os.Getenv(constant.EMAIL_JWT_ISSUER)
	emailJwtAudience := []string{os.Getenv(constant.EMAIL_JWT_AUDIENCE)}

	// jwtのprovider
	provider := func(r *http.Request) (string, []string, error) {
		switch r.RequestURI {
		// oidc authorizationの場合はclientIDを取得してissuerURLを返す
		case pkgConstant.OIDC_AUTHORIZATION_PATH, pkgConstant.OIDC_CALLBACK_PATH:
			oidcCollbackPayload := &pkgRoutesAuth.OidcCallbackPayload{}
			if err := pkgHelpers.BodyDecode(r, oidcCollbackPayload); err != nil {
				return "", nil, err
			}

			if oidcConfig.ClientID == oidcCollbackPayload.ClientId {
				return oidcConfig.IssuerURL, []string{oidcConfig.ClientID}, nil
			}
			return "", nil, fmt.Errorf("clientId not found %s", oidcCollbackPayload.ClientId)
		// google oauth2 authorizationの場合はclientIDを取得してissuerURLを返す
		case pkgConstant.GOOGLE_OAUTH2_AUTHORIZATION_PATH, pkgConstant.GOOGLE_OAUTH2_CALLBACK_PATH:
			googleOAuth2CollbackPayload := &pkgRoutesAuth.OAuth2GoogleCallbackPayload{}
			if err := pkgHelpers.BodyDecode(r, googleOAuth2CollbackPayload); err != nil {
				return "", nil, err
			}

			if googleOAuth2Config.ClientID == googleOAuth2CollbackPayload.ClientId {
				return googleOAuth2Config.IssuerURL, []string{googleOAuth2Config.ClientID}, nil
			}
			return "", nil, fmt.Errorf("clientId not found %s", googleOAuth2CollbackPayload.ClientId)
		// email signinの場合はissuerURLを返す
		case pkgConstant.EMAIL_SIGNIN_PATH:
			return emailJwtIssuer, emailJwtAudience, nil

		// その他の場合はtokenを取得してissuerURLを返す
		default:
			token, err := pkgHelpers.GetCookieToken(r)
			if err != nil {
				return "", nil, err
			}
			claims, err := pkgDomainsAuth.VerifyToken(token)
			if err != nil {
				return "", nil, err
			}

			switch claims.Audience()[0] {
			case emailJwtAudience[0]:
				return emailJwtIssuer, emailJwtAudience, nil
			case oidcConfig.ClientID:
				return oidcConfig.IssuerURL, []string{oidcConfig.ClientID}, nil
			case googleOAuth2Config.ClientID:
				return googleOAuth2Config.IssuerURL, []string{googleOAuth2Config.ClientID}, nil
			default:
				return "", nil, fmt.Errorf("missing provider")
			}
		}
	}

	// configの生成
	multipleAuthUser := os.Getenv(constant.MULTIPLE_AUTH_USER) == "true"
	return &Config{
		Auth: pkgConfig.Auth{
			JWT: pkgConfig.JWT{
				Secret:        "xxxxxxxxxxxxxxxxxxxx",
				Provider:      provider,
				ExpirationSec: 24 * 60 * 60,
				Issuer:        emailJwtIssuer,
				Audience:      emailJwtAudience,
			},
			MultipleAuthUser: &multipleAuthUser,
			GoogleOAuth2:     &googleOAuth2Config,
			OIDC:             &oidcConfig,
		},
		Cors: &Cors{
			AllowOrigins: []string{"https://localhost:8000", "https://viron.plus", "https://viron.work", "https://viron.work:8000"},
		},
		StoreMode: mode,
		StoreMySQL: &MySQL{
			Dialect:              "mysql",
			Host:                 os.Getenv(constant.MYSQL_HOST),
			Port:                 mysqlPort,
			Net:                  "tcp",
			User:                 os.Getenv(constant.MYSQL_USER),
			Password:             os.Getenv(constant.MYSQL_PASSWORD),
			DBName:               os.Getenv(constant.MYSQL_DATABASE),
			AllowNativePasswords: true,
			ParseTime:            true,
		},
		StoreMongo: &Mongo{
			URI:                  os.Getenv(constant.MONGO_URI),
			User:                 os.Getenv(constant.MONGO_USER),
			Password:             os.Getenv(constant.MONGO_PASSWORD),
			VironDB:              os.Getenv(constant.MONGO_DATABASE),
			CasbinCollectionName: os.Getenv(constant.MONGO_CASBIN_COL_NAME),
		},
		Oas: &Oas{
			InfoExtensions: map[string]interface{}{
				pkgConstant.OAS_X_THEME:     pkgConstant.MAGENDA,
				pkgConstant.OAS_X_THUMBNAIL: "https://example.com/logo.png",
				pkgConstant.OAS_X_TAGS:      []string{"example", "golang"},
			},
		},
	}
}

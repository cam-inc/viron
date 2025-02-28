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
		Auth       *pkgConfig.Auth
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
	oidcConfigs := []pkgConfig.OIDC{
		{
			Provider:          pkgConstant.AUTH_SSO_IDP_GOOGLE,
			ClientID:          os.Getenv(constant.GOOGLE_OAUTH2_CLIENT_ID),
			ClientSecret:      os.Getenv(constant.GOOGLE_OAUTH2_CLIENT_SECRET),
			AdditionalScope:   []string{},
			UserHostedDomains: []string{"cam-inc.co.jp", "cyberagent.co.jp"},
			IssuerURL:         os.Getenv(constant.GOOGLE_OAUTH2_ISSUER_URL),
		},
		{
			Provider:          pkgConstant.AUTH_SSO_IDP_CUSTOM,
			ClientID:          os.Getenv(constant.OIDC_1_CLIENT_ID),
			ClientSecret:      os.Getenv(constant.OIDC_1_CLIENT_SECRET),
			AdditionalScope:   []string{},
			UserHostedDomains: []string{"cam-inc.co.jp", "cyberagent.co.jp"},
			IssuerURL:         os.Getenv(constant.OIDC_1_ISSUER_URL),
		},
		{
			Provider:          pkgConstant.AUTH_SSO_IDP_CUSTOM,
			ClientID:          os.Getenv(constant.OIDC_2_CLIENT_ID),
			ClientSecret:      os.Getenv(constant.OIDC_2_CLIENT_SECRET),
			AdditionalScope:   []string{},
			UserHostedDomains: []string{"cam-inc.co.jp", "cyberagent.co.jp"},
			IssuerURL:         os.Getenv(constant.OIDC_2_ISSUER_URL),
		},
	}

	defualtIss := "viron_example"
	defualtAud := "viron_example"
	provider := func(r *http.Request) (string, []string, error) {
		// リクエストのuriが/sso/oidc/authorizationと/sso/oidc/callbackの場合bodyからclientId取得してoidcConfigsからIssuerURLとClientID取得
		if r.RequestURI == pkgConstant.OIDC_AUTHORIZATION_PATH || r.RequestURI == pkgConstant.OIDC_CALLBACK_PATH {
			// r.bodyのjsonからclientId取得
			oidcCollbackPayload := &pkgRoutesAuth.SsoOidcCallbackPayload{}
			if err := pkgHelpers.BodyDecode(r, oidcCollbackPayload); err != nil {
				return "", nil, err
			}

			for _, c := range oidcConfigs {
				if c.ClientID == oidcCollbackPayload.ClientId {
					return c.IssuerURL, []string{c.ClientID}, nil
				}
			}
			return "", nil, fmt.Errorf("clientId not found %s", oidcCollbackPayload.ClientId)
		}
		// リクエストのuriが/email/signinの場合は"viron_example", []string{"viron_example"}, nilを返す
		if r.RequestURI == pkgConstant.EMAIL_SIGNIN_PATH {
			return defualtIss, []string{defualtAud}, nil
		}
		// 上記以外の場合はすべてのリクエストのverifyなのでrのcookieからtoken取得してtokenのaud(clientId)を取得してoidcConfigsからIssuerURLとClientID取得
		token, err := pkgHelpers.GetCookieToken(r)
		if err != nil {
			return "", nil, err
		}
		claims, err := pkgDomainsAuth.VerifyToken(token)
		if err != nil {
			return "", nil, err
		}
		// defualtAudの場合はdefualtを返す
		if claims.Audience()[0] == defualtAud {
			return defualtIss, []string{defualtAud}, nil
		}
		// それ以外の場合はoidcConfigsからIssuerURLとClientID取得
		for _, c := range oidcConfigs {
			if c.ClientID == claims.Audience()[0] {
				return c.IssuerURL, []string{c.ClientID}, nil
			}
		}
		return "", nil, fmt.Errorf("missing provider")
	}
	// TODO: yaml -> statik で環境別設定
	return &Config{
		Auth: &pkgConfig.Auth{
			JWT: &pkgConfig.JWT{
				Secret:        "xxxxxxxxxxxxxxxxxxxx",
				Provider:      provider,
				ExpirationSec: 24 * 60 * 60,
			},
			MultipleAuthUser: true,
			SSO: &pkgConfig.SSO{
				OIDC: oidcConfigs,
			},
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

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
	"github.com/go-sql-driver/mysql"
)

type (
	Mode   string
	Config struct {
		StoreMode  Mode
		StoreMySQL *MySQL
		StoreMongo *Mongo
		Cors       *Cors
		Auth       *Auth
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
	JWT struct {
		Secret        string                                          `yaml:"secret"`
		Provider      func(r *http.Request) (string, []string, error) `yaml:"provider"`
		ExpirationSec int                                             `yaml:"expirationSec"`
	}
	Auth struct {
		JWT          *JWT
		GoogleOAuth2 *pkgConfig.GoogleOAuth2
		Oidc         *pkgConfig.Oidc
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
	provider := func(r *http.Request) (string, []string, error) {
		return "viron_example", []string{"viron_example"}, nil
	}
	// TODO: yaml -> statik で環境別設定
	return &Config{
		Auth: &Auth{
			JWT: &JWT{
				Secret:        "xxxxxxxxxxxxxxxxxxxx",
				Provider:      provider,
				ExpirationSec: 24 * 60 * 60,
			},
			GoogleOAuth2: &pkgConfig.GoogleOAuth2{
				ClientID:          os.Getenv(constant.GOOGLE_OAUTH2_CLIENT_ID),
				ClientSecret:      os.Getenv(constant.GOOGLE_OAUTH2_CLIENT_SECRET),
				AdditionalScope:   []string{},
				UserHostedDomains: []string{"cam-inc.co.jp", "cyberagent.co.jp"},
				IssuerURL:         os.Getenv(constant.GOOGLE_OAUTH2_ISSUER_URL),
			},
			Oidc: &pkgConfig.Oidc{
				ClientID:          os.Getenv(constant.OIDC_CLIENT_ID),
				ClientSecret:      os.Getenv(constant.OIDC_CLIENT_SECRET),
				AdditionalScope:   []string{},
				UserHostedDomains: []string{"cam-inc.co.jp", "cyberagent.co.jp"},
				IssuerURL:         os.Getenv(constant.OIDC_ISSUER_URL),
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

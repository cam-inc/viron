package common

import (
	"fmt"
	"os"
)

// Config of
type Config struct {
	Scheme      string
	Host        string
	Port        int16
	DefaultRole string
	SuperRole   string
	GoogleOAuth
	MySQL
	Ssl
}

// GoogleOAuth of
type GoogleOAuth struct {
	ClientID          string
	ClientSecret      string
	RedirectURL       string
	Scopes            []string
	AllowEmailDomains []string
}

// MySQL of
type MySQL struct {
	UserName     string
	Password     string
	Host         string
	Port         int16
	DatabaseName string
}

// SSL of
type Ssl struct {
	PrivateKeyFilePath  string
	CertificateFilePath string
}

var config *Config

func init() {
	gopath := os.Getenv("GOPATH")
	config = &Config{
		Scheme:      "https",
		Host:        "localhost",
		Port:        3000,
		DefaultRole: "viewer", // AdminUser作成時の初期ロール
		SuperRole:   "super",  // SuperUserのロール

		GoogleOAuth: GoogleOAuth{
			ClientID:     os.Getenv("GOOGLE_OAUTH_CLIENT_ID"),
			ClientSecret: os.Getenv("GOOGLE_OAUTH_CLIENT_SECRET"),
			RedirectURL:  "https://localhost:3000/googleoauth2callback",
			Scopes: []string{
				"https://www.googleapis.com/auth/userinfo.email",
			},
			AllowEmailDomains: []string{
				// ここに書いたドメインがGoogle認証で利用可能
				"camobile.com",
			},
		},

		MySQL: MySQL{
			UserName:     "user",
			Password:     "password",
			Host:         "localhost",
			Port:         3306,
			DatabaseName: "dmc_local",
		},

		Ssl: Ssl{
			PrivateKeyFilePath:  gopath + "/src/github.com/cam-inc/dmc/example-go/gen/server.key",
			CertificateFilePath: gopath + "/src/github.com/cam-inc/dmc/example-go/gen/server.crt",
		},
	}
}

// GetHostName of
func GetHostName() string {
	return fmt.Sprintf("%s://%s:%d", config.Scheme, config.Host, config.Port)
}

// GetScheme of
func GetScheme() string {
	return config.Scheme
}

// GetPort of
func GetPort() int16 {
	return config.Port
}

// GetGoogleOAuth of
func GetGoogleOAuth() GoogleOAuth {
	return config.GoogleOAuth
}

// GetDefaultRole of
func GetDefaultRole() string {
	return config.DefaultRole
}

// GetSuperRole of
func GetSuperRole() string {
	return config.SuperRole
}

// GetMySQLConfig of
func GetMySQLConfig() MySQL {
	return config.MySQL
}

// GetSSLConfig of
func GetSSLConfig() Ssl {
	return config.Ssl
}

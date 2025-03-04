package config

import (
	"github.com/go-chi/jwtauth"
	"net/http"
)

type (
	Auth struct {
		JWT              JWT           `json:"jwt" yaml:"jwt" bson:"jwt"`
		MultipleAuthUser *bool         `json:"multipleAuthUser" yaml:"multipleAuthUser" bson:"multipleAuthUser"`
		GoogleOAuth2     *GoogleOAuth2 `json:"googleOAuth2" yaml:"googleOAuth2" bson:"googleOAuth2"`
		OIDC             *OIDC         `json:"oidc" yaml:"oidc" bson:"oidc"`
	}
	JWT struct {
		Secret        string                                          `json:"secret" yaml:"secret" bson:"secret"`
		Provider      func(r *http.Request) (string, []string, error) `json:"provider" yaml:"provider" bson:"provider"`
		ExpirationSec int                                             `json:"expirationSec" yaml:"expirationSec" bson:"expirationSec"`
		JwtAuth       *jwtauth.JWTAuth                                `json:"jwtAuth" yaml:"jwtAuth" bson:"jwtAuth"`
		Issuer        string                                          `json:"issuer" yaml:"issuer" bson:"issuer"`
		Audience      []string                                        `json:"audience" yaml:"audience" bson:"audience"`
	}
	OIDC struct {
		ClientID          string   `json:"clientId" yaml:"clientId" bson:"clientId"`
		ClientSecret      string   `json:"clientSecret" yaml:"clientSecret" bson:"clientSecret"`
		AdditionalScope   []string `json:"additionalScopes" yaml:"additionalScopes" bson:"additionalScopes"`
		UserHostedDomains []string `json:"userHostedDomains" yaml:"userHostedDomains" bson:"userHostedDomains"`
		IssuerURL         string   `json:"issuerUrl" yaml:"issuerUrl" bson:"issuerUrl"`
	}
	GoogleOAuth2 struct {
		ClientID          string   `json:"clientId" yaml:"clientId" bson:"clientId"`
		ClientSecret      string   `json:"clientSecret" yaml:"clientSecret" bson:"clientSecret"`
		AdditionalScope   []string `json:"additionalScopes" yaml:"additionalScopes" bson:"additionalScopes"`
		UserHostedDomains []string `json:"userHostedDomains" yaml:"userHostedDomains" bson:"userHostedDomains"`
		IssuerURL         string   `json:"issuerUrl" yaml:"issuerUrl" bson:"issuerUrl"`
	}
)

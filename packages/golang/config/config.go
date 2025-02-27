package config

import (
	"github.com/go-chi/jwtauth"
	"net/http"
)

type (
	Auth struct {
		JWT              *JWT
		SSO              *SSO
		MultipleAuthUser bool
	}
	JWT struct {
		Secret        string
		Provider      func(r *http.Request) (string, []string, error)
		ExpirationSec int
		JwtAuth       *jwtauth.JWTAuth
	}
	SSO struct {
		OIDC []OIDC `json:"oidc" yaml:"oidc" bson:"oidc"`
	}
	OIDC struct {
		Provider          string   `json:"provider" yaml:"provider" bson:"provider"`
		ClientID          string   `json:"clientId" yaml:"clientId" bson:"clientId"`
		ClientSecret      string   `json:"clientSecret" yaml:"clientSecret" bson:"clientSecret"`
		AdditionalScope   []string `json:"additionalScopes" yaml:"additionalScopes" bson:"additionalScopes"`
		UserHostedDomains []string `json:"userHostedDomains" yaml:"userHostedDomains" bson:"userHostedDomains"`
		IssuerURL         string   `json:"issuerUrl" yaml:"issuerUrl" bson:"issuerUrl"`
	}
)

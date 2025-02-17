package config

type (
	GoogleOAuth2 struct {
		ClientID          string
		ClientSecret      string
		AdditionalScope   []string `yaml:"additionalScopes"`
		UserHostedDomains []string `yaml:"userHostedDomains"`
	}
	Oidc struct {
		ClientID          string
		ClientSecret      string
		AdditionalScope   []string `yaml:"additionalScopes"`
		UserHostedDomains []string `yaml:"userHostedDomains"`
		IssuerURL         string   `yaml:"issuerUrl"`
	}
)

package constant

import (
	"net/http"
	"time"
)

type CtxKey string

const (
	ENV_STORE_MODE = "mode"

	CTX_KEY_API_DEFINITION               CtxKey = "apiDefinition"
	CTX_KEY_JWT_EXPIRATION_SEC           CtxKey = "jwtExpirationSec"
	CTX_KEY_STATE_EXPIRATION_SEC         CtxKey = "stateExpirationSec"
	CTX_KEY_CODE_VERIFIER_EXPIRATION_SEC CtxKey = "codeVerifierExpirationSec"
	CTX_KEY_ADMINUSER                    CtxKey = "adminUser"
	CTX_KEY_ADMINUSER_ID                 CtxKey = "userId"
	CTX_KEY_AUTH                         CtxKey = "auth"

	DEFAULT_PAGER_SIZE = 10
	DEFAULT_PAGER_PAGE = 1

	HTTP_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN      = "access-control-allow-origin"
	HTTP_HEADER_ACCESS_CONTROL_ALLOW_CREDENTIALS = "access-control-allow-credentials"
	HTTP_HEADER_ACCESS_CONTROL_ALLOW_METHODS     = "access-control-allow-methods"
	HTTP_HEADER_ACCESS_CONTROL_ALLOW_HEADERS     = "access-control-allow-headers"
	HTTP_HEADER_ACCESS_CONTROL_EXPOSE_HEADERS    = "access-control-expose-headers"
	HTTP_HEADER_CONTENT_DISPOSITION              = "content-disposition"
	HTTP_HEADER_CONTENT_TYPE                     = "content-type"
	HTTP_HEADER_LOCATION                         = "location"
	HTTP_HEADER_ORIGIN                           = "origin"
	HTTP_HEADER_SET_COOKIE                       = "set-cookie"
	HTTP_HEADER_X_REQUESTED_WITH                 = "x-requested-with"
	HTTP_HEADER_X_VIRON_AUTHTYPES_PATH           = "x-viron-authtypes-path"

	ACCESS_CONTROL_ALLOW_CREDENTIALS = true

	API_METHOD_GET    = "get"
	API_METHOD_POST   = "post"
	API_METHOD_PUT    = "put"
	API_METHOD_PATCH  = "patch"
	API_METHOD_DELETE = "delete"

	PERMISSION_READ  = "read"
	PERMISSION_WRITE = "write"
	PERMISSION_DENY  = "deny"
	PERMISSION_ALL   = "all"

	AUTH_CONFIG_PROVIDER_VIRON      = "viron"
	AUTH_CONFIG_PROVIDER_GOOGLE     = "google"
	AUTH_CONFIG_PROVIDER_OIDC       = "oidc"
	AUTH_CONFIG_PROVIDER_SIGNOUT    = "signout"
	AUTH_CONFIG_TYPE_EMAIL          = "email"
	AUTH_CONFIG_TYPE_OAUTH          = "oauth"
	AUTH_CONFIG_TYPE_OAUTH_CALLBACK = "oauthcallback"
	AUTH_CONFIG_TYPE_OIDC           = "oidc"
	AUTH_CONFIG_TYPE_OIDC_CALLBACK  = "oidccallback"
	AUTH_CONFIG_TYPE_SIGNOUT        = "signout"

	VIRON_AUTHCONFIGS_PATH           = "/viron/authconfigs"
	EMAIL_SIGNIN_PATH                = "/email/signin"
	OAUTH2_GOOGLE_AUTHORIZATION_PATH = "/oauth2/google/authorization"
	OAUTH2_GOOGLE_CALLBACK_PATH      = "/oauth2/google/callback"
	OIDC_AUTHORIZATION_PATH          = "/oidc/authorization"
	OIDC_CALLBACK_PATH               = "/oidc/callback"
	SIGNOUT_PATH                     = "/signout"

	OAS_X_THUMBNAIL                      = "x-thumbnail"
	OAS_X_THEME                          = "x-theme"
	OAS_X_TAGS                           = "x-tags"
	OAS_X_TABLE                          = "x-table"
	OAS_X_PAGES                          = "x-pages"
	OAS_X_PAGE_CONTENTS                  = "contents"
	OAS_X_PAGE_CONTENT_RESOURCE_ID       = "resourceId"
	OAS_X_AUTOCOMPLETE                   = "x-autocomplete"
	OAS_X_AUTHCONFIG_DEFAULT_PARAMETERS  = "x-authconfig-default-parameters"
	OAS_X_AUTHCONFIG_DEFAULT_REQUESTBODY = "x-authconfig-default-requestBody"

	AUTH_SCHEME = "Bearer"

	AUTH_TYPE_EMAIL  = "email"
	AUTH_TYPE_GOOGLE = "google"
	AUTH_TYPE_OIDC   = "oidc"

	ADMIN_ROLE_SUPER  = "super"
	ADMIN_ROLE_VIEWER = "viewer"

	DEFAULT_JWT_EXPIRATION_SEC = 24 * 60 * 60

	OAUTH2_STATE_EXPIRATION_SEC = 10 * 60

	OIDC_STATE_EXPIRATION_SEC = 10 * 60

	OIDC_CODE_VERIFIER_EXPIRATION_SEC = 10 * 60

	OIDC_REFRESH_THRESHOLD = 30 * time.Second

	GOOGLE_OAUTH2_REFRESH_THRESHOLD = 30 * time.Second

	CASBIN_LOAD_INTERVAL_SEC = 1 * 60

	COOKIE_KEY_VIRON_AUTHORIZATION = "viron_authorization"
	COOKIE_KEY_OAUTH2_STATE        = "oauth2_state"
	COOKIE_KEY_OIDC_STATE          = "oidc_state"
	COOKIE_KEY_OIDC_CODE_VERIFIER  = "oidc_code_verifier"

	RED                  = Theme("red")
	ULTIMATE_ORANGE      = Theme("ultimate orange")
	ORANGE_JUICE         = Theme("orange juice")
	AMBER                = Theme("amber")
	YELLOW               = Theme("yellow")
	LIMONCELLO           = Theme("limoncello")
	RADIUM               = Theme("radium")
	HARLEQUIN            = Theme("harlequin")
	GREEN                = Theme("green")
	LUCENT_LIME          = Theme("lucent lime")
	GUPPIE_GREEN         = Theme("guppie green")
	MINTY_PARADISE       = Theme("minty paradise")
	AQUA                 = Theme("aqua")
	CAPRI                = Theme("capri")
	BRESCIAN_BLUE        = Theme("brescian blue")
	RARE_BLUE            = Theme("rare blue")
	BLUE                 = Theme("blue")
	ELECTRIC_ULTRAMARINE = Theme("electric ultramarine")
	VIOLENT_VIOLET       = Theme("violent violet")
	ELECTRIC_PURPLE      = Theme("electric purple")
	MAGENDA              = Theme("magenta")
	BRUTAL_PINK          = Theme("brutal pink")
	NEON_ROSE            = Theme("neon rose")
	ELECTRIC_CRIMSON     = Theme("electric crimson")
)

type (
	Theme string
)

var (
	ACCESS_CONTROL_ALLOW_HEADERS = []string{
		HTTP_HEADER_CONTENT_TYPE,
		HTTP_HEADER_ORIGIN,
	}

	ACCESS_CONTROL_EXPOSE_HEADERS = []string{
		HTTP_HEADER_CONTENT_DISPOSITION,
		HTTP_HEADER_ORIGIN,
		HTTP_HEADER_X_REQUESTED_WITH,
		HTTP_HEADER_X_VIRON_AUTHTYPES_PATH,
	}

	ACCESS_CONTROL_ALLOW_METHODS = []string{
		http.MethodGet,
		http.MethodPut,
		http.MethodPost,
		http.MethodDelete,
		http.MethodHead,
		http.MethodOptions,
	}

	API_METHODS = []string{
		API_METHOD_GET,
		API_METHOD_POST,
		API_METHOD_PUT,
		API_METHOD_DELETE,
	}

	VIRON_MONGO_COLLECTION_MAP = map[string][]string{}

	GOOGLE_OAUTH2_DEFAULT_SCOPES = []string{
		"https://www.googleapis.com/auth/userinfo.email",
	}

	OIDC_DEFAULT_SCOPES = []string{
		"openid",
		"email",
	}
)

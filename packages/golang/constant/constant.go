package constant

const (
	CTX_KEY_API_DEFINITION     = "apiDefinition"
	CTX_KEY_JWT_EXPIRATION_SEC = "jwtExpirationSec"

	AUTH_SCHEME = "Bearer"
	/*
		export const AUTH_TYPE = {
		  EMAIL: 'email',
		  GOOGLE: 'google',
		} as const;
	*/
	AUTH_TYPE_EMAIL  = "email"
	AUTH_TYPE_GOOGLE = "google"

	/*
		export const ADMIN_ROLE = {
		  SUPER: 'super',
		  VIEWER: 'viewer',
		} as const;
	*/

	ADMIN_ROLE_SUPER  = "super"
	ADMIN_ROLE_VIEWER = "viewer"

	/*
		export const DEFAULT_JWT_EXPIRATION_SEC = 24 * 60 * 60;

	*/

	DEFAULT_JWT_EXPIRATION_SEC = 24 * 60 * 60

	/*
		export const COOKIE_KEY = {
		  VIRON_AUTHORIZATION: 'viron_authorization',
		  OAUTH2_STATE: 'oauth2_state',
		} as const;
	*/
	COOKIE_KEY_VIRON_AUTHORIZATION = "viron_authorization"
	COOKIE_KEY_OAUTH2_STATE        = "oauth2_state"
)

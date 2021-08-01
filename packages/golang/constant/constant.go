package constant

import "net/http"

const (
	CTX_KEY_API_DEFINITION     = "apiDefinition"
	CTX_KEY_JWT_EXPIRATION_SEC = "jwtExpirationSec"
	CTX_KEY_ADMINUSER          = "adminUser"

	/*
		export const DEFAULT_PAGER_SIZE = 10;
		export const DEFAULT_PAGER_PAGE = 1;
	*/
	DEFAULT_PAGER_SIZE = 10
	DEFAULT_PAGER_PAGE = 1

	/*
		export const HTTP_HEADER = {
		  ACCESS_CONTROL_ALLOW_ORIGIN: 'access-control-allow-origin',
		  ACCESS_CONTROL_ALLOW_CREDENTIALS: 'access-control-allow-credentials',
		  ACCESS_CONTROL_ALLOW_METHODS: 'access-control-allow-methods',
		  ACCESS_CONTROL_ALLOW_HEADERS: 'access-control-allow-headers',
		  ACCESS_CONTROL_EXPOSE_HEADERS: 'access-control-expose-headers',
		  CONTENT_DISPOSITION: 'content-disposition',
		  CONTENT_TYPE: 'content-type',
		  LOCATION: 'location',
		  ORIGIN: 'origin',
		  SET_COOKIE: 'set-cookie',
		  X_REQUESTED_WITH: 'x-requested-with',
		  X_VIRON_AUTHTYPES_PATH: 'x-viron-authtypes-path',
		} as const;
		export type HttpHeader = typeof HTTP_HEADER[keyof typeof HTTP_HEADER];

		export const ACCESS_CONTROL_ALLOW_HEADERS = [
		  HTTP_HEADER.CONTENT_TYPE,
		  HTTP_HEADER.ORIGIN,
		] as const;
	*/
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

	/*
		export const API_METHOD = {
		  GET: 'get',
		  POST: 'post',
		  PUT: 'put',
		  DELETE: 'delete',
		} as const;
		export type ApiMethod = typeof API_METHOD[keyof typeof API_METHOD];
	*/

	API_METHOD_GET    = "get"
	API_METHOD_POST   = "post"
	API_METHOD_PUT    = "put"
	API_METHOD_DELETE = "delete"

	/*
		export const AUTH_CONFIG_PROVIDER = {
		  VIRON: 'viron',
		  GOOGLE: 'google',
		  SIGNOUT: 'signout',
		} as const;
	*/

	AUTH_CONFIG_PROVIDER_VIRON   = "viron"
	AUTH_CONFIG_PROVIDER_GOOGLE  = "google"
	AUTH_CONFIG_PROVIDER_SIGNOUT = "signout"
	/*
	   export declare const AUTH_CONFIG_TYPE: {
	       readonly EMAIL: "email";
	       readonly OAUTH: "oauth";
	       readonly OAUTH_CALLBACK: "oauthcallback";
	       readonly SIGNOUT: "signout";
	   };
	*/
	AUTH_CONFIG_TYPE_EMAIL          = "email"
	AUTH_CONFIG_TYPE_OAUTH          = "oauth"
	AUTH_CONFIG_TYPE_OAUTH_CALLBACK = "oauthcallback"
	AUTH_CONFIG_TYPE_SIGNOUT        = "signout"

	/*
		export const VIRON_AUTHCONFIGS_PATH = '/viron/authconfigs';
		export const EMAIL_SIGNIN_PATH = '/email/signin';
		export const OAUTH2_GOOGLE_AUTHORIZATION_PATH = '/oauth2/google/authorization';
		export const OAUTH2_GOOGLE_CALLBACK_PATH = '/oauth2/google/callback';
		export const SIGNOUT_PATH = '/signout';
	*/

	VIRON_AUTHCONFIGS_PATH           = "/viron/authconfigs"
	EMAIL_SIGNIN_PATH                = "/email/signin"
	OAUTH2_GOOGLE_AUTHORIZATION_PATH = "/oauth2/google/authorization"
	OAUTH2_GOOGLE_CALLBACK_PATH      = "/oauth2/google/callback"
	SIGNOUT_PATH                     = "/signout"

	/*
		export const OAS_X_AUTHCONFIG_DEFAULT_PARAMETERS =
		  'x-authconfig-default-parameters';
		export const OAS_X_AUTHCONFIG_DEFAULT_REQUESTBODY =
		  'x-authconfig-default-requestBody';

	*/

	OAS_X_AUTHCONFIG_DEFAULT_PARAMETERS  = "x-authconfig-default-parameters"
	OAS_X_AUTHCONFIG_DEFAULT_REQUESTBODY = "x-authconfig-default-requestBody"

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

var (
	/*
		export const ACCESS_CONTROL_ALLOW_HEADERS = [
		  HTTP_HEADER.CONTENT_TYPE,
		  HTTP_HEADER.ORIGIN,
		] as const;

			export const ACCESS_CONTROL_EXPOSE_HEADERS = [
			  HTTP_HEADER.CONTENT_DISPOSITION,
			  HTTP_HEADER.ORIGIN,
			  HTTP_HEADER.X_REQUESTED_WITH,
			  HTTP_HEADER.X_VIRON_AUTHTYPES_PATH,
			] as const;

			export const ACCESS_CONTROL_ALLOW_METHODS = [
			  'GET',
			  'PUT',
			  'POST',
			  'DELETE',
			  'HEAD',
			  'OPTIONS',
			] as const;

			export const ACCESS_CONTROL_ALLOW_CREDENTIALS = true;
	*/

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
)

package routes

import (
	"context"
	"net/http"

	"github.com/cam-inc/viron/example/golang/pkg/config"
	"github.com/go-chi/cors"

	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/getkin/kin-openapi/openapi3"
)

func InjectAPIDefinition(apiDef *openapi3.T) func(http.HandlerFunc) http.HandlerFunc {
	return func(handlerFunc http.HandlerFunc) http.HandlerFunc {
		fn := func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			ctx = context.WithValue(ctx, constant.CTX_KEY_API_DEFINITION, apiDef)
			handlerFunc.ServeHTTP(w, r.WithContext(ctx))
		}
		return fn

	}
}

func Cors(cfg *config.Cors) func(http.Handler) http.Handler {
	return cors.Handler(cors.Options{
		AllowedOrigins:   cfg.AllowOrigins,
		AllowedMethods:   constant.ACCESS_CONTROL_ALLOW_METHODS,
		AllowedHeaders:   constant.ACCESS_CONTROL_ALLOW_HEADERS,
		ExposedHeaders:   constant.ACCESS_CONTROL_EXPOSE_HEADERS,
		AllowCredentials: constant.ACCESS_CONTROL_ALLOW_CREDENTIALS,
	})
}

func JWTSecurityHandler(oas *openapi3.T, cfg *config.Auth) func(handler http.HandlerFunc) http.HandlerFunc {
	/*
		type result struct {
			typeName string             `json:"type,omitempty"`
			status   string             `json:"status,omitempty"`
			message  string             `json:"message,omitempty"`
			user     *domains.AdminUser `json:"user,omitempty"`
		}

		send := func(w http.ResponseWriter, status int, res *result) {
			if status == http.StatusOK || status == http.StatusNoContent {

			} else {
				http.Error(w, message, status)
			}
		}

		fail := func(err *errors.VironError) {

		}
	*/
	return func(handlerFunc http.HandlerFunc) http.HandlerFunc {

		// TODO: oas security 'jwt' check and through

		fn := func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			// http.Error(w, errContextCanceled, http.StatusServiceUnavailable)

			cookie, _ := r.Cookie(constant.COOKIE_KEY_VIRON_AUTHORIZATION)
			if cookie == nil {

			}

			//claim, err := auth.Verify(cookie.Value)

			handlerFunc.ServeHTTP(w, r.WithContext(ctx))
		}
		return fn
	}
}

/*

const authFailure = (err: VironError): AuthenticationFailure => {
  return {
    type: AUTHENTICATION_RESULT_TYPE.INVALID,
    status: err.statusCode,
    message: err.message,
  };
};

const authSuccess = (
  user: domainsAdminUser.AdminUserView
): AuthenticationSuccess => {
  return { type: AUTHENTICATION_RESULT_TYPE.SUCCESS, user };
};

export const jwt = async (
  context: ExegesisPluginContext
): Promise<AuthenticationResult> => {
  const pContext = context as PluginContext;
  const token = pContext.req.cookies[COOKIE_KEY.VIRON_AUTHORIZATION];
  const claims = await domainsAuth.verifyJwt(token);

  if (claims) {
    const userId = claims.sub;

    if (
      !(await domainsAdminRole.hasPermission(
        userId,
        pContext.req.path,
        (pContext.req.method as string).toLowerCase() as ApiMethod,
        pContext.req._context.apiDefinition
      ))
    ) {
      return authFailure(forbidden());
    }

    const user = await domainsAdminUser.findOneById(userId);
    if (user) {
      switch (user.authType) {
        case AUTH_TYPE.GOOGLE: {
          // Google認証の場合はアクセストークンの検証
          if (
            await domainsAuth.verifyGoogleOAuth2AccessToken(
              userId,
              user,
              ctx.config.auth.googleOAuth2
            )
          ) {
            return authSuccess(user);
          }
          break;
        }
        default:
          return authSuccess(user);
      }
    }
  }

  pContext.origRes.clearCookie(COOKIE_KEY.VIRON_AUTHORIZATION);
  pContext.res.header(
    HTTP_HEADER.X_VIRON_AUTHTYPES_PATH,
    VIRON_AUTHCONFIGS_PATH
  );
  return authFailure(unauthorized());
};

*/

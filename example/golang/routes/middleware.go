package routes

import (
	"context"
	"fmt"
	"net/http"
	"reflect"
	"runtime"
	"time"

	"github.com/cam-inc/viron/packages/golang/domains/auth"

	"github.com/cam-inc/viron/example/golang/pkg/config"
	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/helpers"
	"github.com/getkin/kin-openapi/openapi3"
	"github.com/go-chi/cors"
)

const (
	JwtScopes = "jwt.Scopes"
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

/*
func (c *Cors) Handler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions && r.Header.Get("Access-Control-Request-Method") != "" {
			c.logf("Handler: Preflight request")
			c.handlePreflight(w, r)
			// Preflight requests are standalone and should stop the chain as some other
			// middleware may not handle OPTIONS requests correctly. One typical example
			// is authentication middleware ; OPTIONS requests won't carry authentication
			// headers (see #1)
			if c.optionPassthrough {
				next.ServeHTTP(w, r)
			} else {
				w.WriteHeader(http.StatusOK)
			}
		} else {
			c.logf("Handler: Actual request")
			c.handleActualRequest(w, r)
			next.ServeHTTP(w, r)
		}
	})
}
*/

func InjectConfig(cfg *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// 前処理
			ctx := r.Context()
			expire := cfg.Auth.JWT.ExpirationSec
			ctx = context.WithValue(ctx, constant.CTX_KEY_JWT_EXPIRATION_SEC, expire)
			next.ServeHTTP(w, r.WithContext(ctx))
			// 後処理
		})
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

func JWTSecurityHandler(cfg *config.Auth) func(http.HandlerFunc) http.HandlerFunc {
	return func(handlerFunc http.HandlerFunc) http.HandlerFunc {

		// TODO: oas security 'jwt' check and through

		fn := func(w http.ResponseWriter, r *http.Request) {

			// DEBUG
			fv := reflect.ValueOf(handlerFunc)
			fmt.Printf("[%+v]\n", runtime.FuncForPC(fv.Pointer()).Name())
			// DEBUG

			ctx := r.Context()
			if ctx.Value(JwtScopes) == nil {
				fmt.Println("jwtScope is nil.")
				handlerFunc.ServeHTTP(w, r.WithContext(ctx))
				return
			} else {
				fmt.Println("jwtScope is not nil.")
			}

			cookie, _ := r.Cookie(constant.COOKIE_KEY_VIRON_AUTHORIZATION)
			fmt.Printf("authrization cookie %+v\n", cookie)
			if cookie == nil {
				w.Header().Add(constant.HTTP_HEADER_X_VIRON_AUTHTYPES_PATH, constant.VIRON_AUTHCONFIGS_PATH)
				cookie = helpers.GenCookie(constant.COOKIE_KEY_VIRON_AUTHORIZATION, "", &http.Cookie{
					Expires: time.Unix(0, 0),
				})
				http.SetCookie(w, cookie)
				http.Error(w, `{"message":"Unauthorized"}`, http.StatusUnauthorized)
				return
			}

			//claim, err := auth.Verify(cookie.Value)
			auth.Verify(cookie.Value)
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

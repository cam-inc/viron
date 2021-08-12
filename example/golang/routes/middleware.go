package routes

import (
	"context"
	"fmt"
	"net/http"

	"github.com/cam-inc/viron/packages/golang/logging"

	"github.com/getkin/kin-openapi/openapi3filter"
	legacyrouter "github.com/getkin/kin-openapi/routers/legacy"

	"github.com/cam-inc/viron/packages/golang/domains"

	"github.com/cam-inc/viron/packages/golang/domains/auth"

	"github.com/cam-inc/viron/example/golang/pkg/config"
	exContext "github.com/cam-inc/viron/example/golang/pkg/context"
	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/helpers"
	"github.com/getkin/kin-openapi/openapi3"
	"github.com/go-chi/cors"
)

const (
	JwtScopes = "jwt.Scopes"
)

// OpenAPI3Validator kin-openapiを利用したvalidator
func OpenAPI3Validator(apiDef *openapi3.T, op *openapi3filter.Options) func(http.Handler) http.Handler {
	router, err := legacyrouter.NewRouter(apiDef)
	if err != nil {
		panic(err)
	}
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			url := r.URL

			// リクエストのバリデーション
			route, pathParams, err := router.FindRoute(r)
			if err != nil {
				fmt.Printf("router.FindRoute err=%v, url=%v", err, url)
				next.ServeHTTP(w, r.WithContext(ctx))
				return
			}
			requestValidationInput := &openapi3filter.RequestValidationInput{Request: r,
				PathParams: pathParams,
				Route:      route,
				Options:    op,
			}
			if err := openapi3filter.ValidateRequest(ctx, requestValidationInput); err != nil {
				fmt.Printf("openapi3filter.ValidateRequest err:%v", err)
				http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
				return
			}

			// next
			req := r.WithContext(ctx)
			next.ServeHTTP(w, req)

		})
	}
}

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

func InjectLogger() func(handler http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			logger := exContext.Log(r.Context())
			if logger == nil {
				rr := exContext.SetLogger(r, logging.DebugLevel)
				next.ServeHTTP(w, rr)
			} else {
				next.ServeHTTP(w, r)
			}
		})
	}
}

func JWTSecurityHandler(cfg *config.Auth) func(http.HandlerFunc) http.HandlerFunc {
	return func(handlerFunc http.HandlerFunc) http.HandlerFunc {

		fn := func(w http.ResponseWriter, r *http.Request) {

			ctx := r.Context()
			if ctx.Value(JwtScopes) == nil {
				fmt.Println("jwtScope is nil.")
				handlerFunc.ServeHTTP(w, r.WithContext(ctx))
				return
			} else {
				fmt.Println("jwtScope is not nil.")
			}

			token, err := helpers.GetCookieToken(r)
			if err != nil {
				fmt.Println(err)
				w.Header().Add(constant.HTTP_HEADER_X_VIRON_AUTHTYPES_PATH, constant.VIRON_AUTHCONFIGS_PATH)
				cookie := helpers.GenCookie(constant.COOKIE_KEY_VIRON_AUTHORIZATION, "", &http.Cookie{
					MaxAge: -1,
				})
				http.SetCookie(w, cookie)
				http.Error(w, `{"message":"Unauthorized"}`, http.StatusUnauthorized)
				return
			}

			claim, err := auth.Verify(token)
			if err != nil {
				fmt.Println(err)
				w.Header().Add(constant.HTTP_HEADER_X_VIRON_AUTHTYPES_PATH, constant.VIRON_AUTHCONFIGS_PATH)
				cookie := helpers.GenCookie(constant.COOKIE_KEY_VIRON_AUTHORIZATION, "", &http.Cookie{
					MaxAge: -1,
				})
				http.SetCookie(w, cookie)
				http.Error(w, `{"message":"Unauthorized"}`, http.StatusUnauthorized)
				return
			}

			userID := claim.Sub
			user := domains.FindByID(ctx, userID)
			if user == nil {
				fmt.Println("user notfound")
				w.Header().Add(constant.HTTP_HEADER_X_VIRON_AUTHTYPES_PATH, constant.VIRON_AUTHCONFIGS_PATH)
				cookie := helpers.GenCookie(constant.COOKIE_KEY_VIRON_AUTHORIZATION, "", &http.Cookie{
					MaxAge: -1,
				})
				http.SetCookie(w, cookie)
				http.Error(w, `{"message":"Unauthorized"}`, http.StatusUnauthorized)
				return
			}

			ctx = context.WithValue(ctx, constant.CTX_KEY_AUTH, claim)
			ctx = context.WithValue(ctx, constant.CTX_KEY_ADMINUSER, user)
			handlerFunc.ServeHTTP(w, r.WithContext(ctx))
		}
		return fn
	}
}

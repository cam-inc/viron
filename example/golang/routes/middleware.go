package routes

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/cam-inc/viron/packages/golang/errors"

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
	"github.com/go-chi/chi/middleware"
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
				fmt.Printf("router.FindRoute err=%v, url=%v\n", err, url)
				next.ServeHTTP(w, r.WithContext(ctx))
				return
			}
			requestValidationInput := &openapi3filter.RequestValidationInput{Request: r,
				PathParams: pathParams,
				Route:      route,
				Options:    op,
			}
			if err := openapi3filter.ValidateRequest(ctx, requestValidationInput); err != nil {
				fmt.Printf("openapi3filter.ValidateRequest err:%v\n", err)
				http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
				return
			}

			// next
			req := r.WithContext(ctx)
			next.ServeHTTP(w, req)

		})
	}
}

// OpenAPI3Validator kin-openapiを利用したvalidator
func OpenAPI3ValidatorHandlerFunc(apiDef *openapi3.T, op *openapi3filter.Options) func(http.HandlerFunc) http.HandlerFunc {
	router, err := legacyrouter.NewRouter(apiDef)
	if err != nil {
		panic(err)
	}
	return func(handlerFunc http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			url := r.URL

			// リクエストのバリデーション
			route, pathParams, err := router.FindRoute(r)
			if err != nil {
				fmt.Printf("router.FindRoute err=%v, url=%v\n", err, url)
				handlerFunc.ServeHTTP(w, r.WithContext(ctx))
				return
			}
			requestValidationInput := &openapi3filter.RequestValidationInput{Request: r,
				PathParams: pathParams,
				Route:      route,
				Options:    op,
			}
			if err := openapi3filter.ValidateRequest(ctx, requestValidationInput); err != nil {
				fmt.Printf("openapi3filter.ValidateRequest err:%v\n", err)
				http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
				return
			}
			req := r.WithContext(ctx)
			handlerFunc.ServeHTTP(w, req)
		}
	}
}

func InjectAPIDefinition(apiDef *openapi3.T) func(http.HandlerFunc) http.HandlerFunc {
	return func(handlerFunc http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			ctx = context.WithValue(ctx, constant.CTX_KEY_API_DEFINITION, apiDef)
			handlerFunc.ServeHTTP(w, r.WithContext(ctx))
		}
	}
}

func InjectAPIACL(apiDef *openapi3.T) func(http.HandlerFunc) http.HandlerFunc {
	return func(handlerFunc http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			ctxUser := ctx.Value(constant.CTX_KEY_ADMINUSER)
			user, exists := ctxUser.(*domains.AdminUser)
			if !exists {
				helpers.SendError(w, http.StatusInternalServerError, fmt.Errorf("adminuser notfound"))
				return
			}
			if !domains.ACLAllow(r.Method, r.RequestURI, user.RoleIDs, apiDef) {
				helpers.SendError(w, http.StatusForbidden, fmt.Errorf("adminuser not permission"))
				return
			}
			handlerFunc.ServeHTTP(w, r.WithContext(ctx))
		}
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

func AuthenticationFunc(ctx context.Context, input *openapi3filter.AuthenticationInput) error {
	if ctx.Value(JwtScopes) == nil {
		return nil
	}
	if ctx.Value(constant.CTX_KEY_AUTH) == nil {
		return errors.UnAuthorized
	}
	return nil
}

// func(context.Context, *AuthenticationInput) error
func JWTAuthHandlerFunc() func(http.HandlerFunc) http.HandlerFunc {
	return func(handlerFunc http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			if ctx.Value(JwtScopes) == nil {
				handlerFunc.ServeHTTP(w, r.WithContext(ctx))
				return
			}
			token, err := helpers.GetCookieToken(r)
			if err != nil {
				fmt.Println(err)
				handlerFunc.ServeHTTP(w, r.WithContext(ctx))
				return
			}
			claim, err := auth.Verify(r, token)
			if err != nil {
				fmt.Println(err)
				handlerFunc.ServeHTTP(w, r.WithContext(ctx))
				return
			}
			ctx = context.WithValue(ctx, constant.CTX_KEY_AUTH, claim)
			rr := r.WithContext(ctx)
			cctx := rr.Context()
			fmt.Println(cctx.Value(constant.CTX_KEY_AUTH))
			handlerFunc.ServeHTTP(w, rr)
		}
	}
}
func JWTSecurityHandlerFunc(domainAuth *auth.Auth) func(http.HandlerFunc) http.HandlerFunc {
	return func(handlerFunc http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			if ctx.Value(JwtScopes) == nil {
				handlerFunc.ServeHTTP(w, r.WithContext(ctx))
				return
			}
			token, err := helpers.GetCookieToken(r)
			if err != nil {
				fmt.Println(err)
				w.Header().Add(constant.HTTP_HEADER_X_VIRON_AUTHTYPES_PATH, constant.VIRON_AUTHCONFIGS_PATH)
				cookie := helpers.GenCookie(constant.COOKIE_KEY_VIRON_AUTHORIZATION, "", &http.Cookie{
					MaxAge: -1,
				})
				http.SetCookie(w, cookie)
				http.Error(w, errors.UnAuthorized.Error(), errors.UnAuthorized.StatusCode())
				return
			}
			claim, err := auth.Verify(r, token)
			if err != nil {
				fmt.Println(err)
				w.Header().Add(constant.HTTP_HEADER_X_VIRON_AUTHTYPES_PATH, constant.VIRON_AUTHCONFIGS_PATH)
				cookie := helpers.GenCookie(constant.COOKIE_KEY_VIRON_AUTHORIZATION, "", &http.Cookie{
					MaxAge: -1,
				})
				http.SetCookie(w, cookie)
				http.Error(w, errors.UnAuthorized.Error(), errors.UnAuthorized.StatusCode())
				return
			}

			audiance := claim.Aud
			userID := claim.Sub
			user := domains.FindByID(ctx, userID)

			// ユーザーが存在しない場合とaudがない場合はエラー
			if user == nil || len(claim.Aud) == 0 {
				w.Header().Add(constant.HTTP_HEADER_X_VIRON_AUTHTYPES_PATH, constant.VIRON_AUTHCONFIGS_PATH)
				cookie := helpers.GenCookie(constant.COOKIE_KEY_VIRON_AUTHORIZATION, "", &http.Cookie{
					MaxAge: -1,
				})
				http.SetCookie(w, cookie)
				http.Error(w, errors.UnAuthorized.Error(), errors.UnAuthorized.StatusCode())
				return
			}

			// メール認証に場合はパススルー
			if user.Password != nil {
				// アクセストークンの検証する
				// audの最初の要素にclientIDを設定している
				domainAuth.VerifyAccessToken(r, audiance[0], userID, *user)
			}

			ctx2 := context.WithValue(ctx, constant.CTX_KEY_AUTH, claim)
			ctx3 := context.WithValue(ctx2, constant.CTX_KEY_ADMINUSER, user)
			ctx4 := context.WithValue(ctx3, constant.CTX_KEY_ADMINUSER_ID, user.ID)
			rr := r.WithContext(ctx4)
			handlerFunc.ServeHTTP(w, rr)
		}
	}
}

func InjectAuditLog(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)
		var rBody []byte
		if r.Body != nil {
			rBody, _ = io.ReadAll(r.Body)
			r.Body = io.NopCloser(bytes.NewBuffer(rBody))
		}
		defer func(w http.ResponseWriter, r *http.Request, body string) {
			var userID string

			if body != "" {
				j := map[string]interface{}{}
				if err := json.Unmarshal([]byte(body), &j); err == nil {
					for k, v := range j {
						fmt.Printf("k %+v v %+v\n", k, v)
						if strings.Contains(k, "pass") {
							j[k] = "***************************"
						}
					}
					if b, err := json.Marshal(j); err != nil {
						fmt.Printf("json marshal error %+v\n", err)
					} else {
						body = string(b)
					}
				} else {
					fmt.Printf("json unmarshal error %+vn", err)
				}
			}

			if token, err := helpers.GetCookieToken(r); err == nil {
				if claim, err := auth.Verify(r, token); err == nil && claim != nil {
					userID = claim.Sub
				}
			}
			sourceIP := r.Header.Get("x-forwarded-for")
			status := int(ww.Status())
			audit := &domains.AuditLog{
				UserId:        &userID,
				RequestMethod: &r.Method,
				RequestUri:    &r.RequestURI,
				SourceIp:      &sourceIP,
				RequestBody:   &body,
				StatusCode:    &status,
			}
			if err := domains.CreateAuditLog(r.Context(), audit); err != nil {
				fmt.Printf("audit log error %+v\n", err)
			}
		}(ww, r, string(rBody))

		next.ServeHTTP(ww, r)
	})
}

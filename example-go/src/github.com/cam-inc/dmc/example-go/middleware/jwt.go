package middleware

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"golang.org/x/oauth2"

	"github.com/cam-inc/dmc/example-go/bridge"
	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/cam-inc/dmc/example-go/service"
	jwtgo "github.com/dgrijalva/jwt-go"
	"github.com/goadesign/goa"
	"github.com/goadesign/goa/middleware/security/jwt"
	"go.uber.org/zap"
)

func validation() goa.Middleware {
	logger := common.GetLogger("default")
	errValidationFailed := goa.NewErrorClass("validation_failed", 401)
	errForbidden := goa.NewErrorClass("forbidden", 403)

	validate := func(nextHandler goa.Handler) goa.Handler {
		after := func(ctx context.Context, rw http.ResponseWriter, req *http.Request) error {
			// jwt認証よりも後で実行したいmiddleware
			return AuditLogHandler(nextHandler)(ctx, rw, req)
		}

		return func(ctx context.Context, rw http.ResponseWriter, req *http.Request) error {
			token := jwt.ContextJWT(ctx)
			if token == nil {
				// 認可を必要としないAPIの場合はこっちに入る
				return after(ctx, rw, req)
			}
			claims := token.Claims.(jwtgo.MapClaims)

			if claims["iss"] != "DMC" {
				logger.Error("invalid JWT.iss requested", zap.String("iss", claims["iss"].(string)))
				return errValidationFailed("JWT invalid")
			}
			if claims["aud"] != "dmc.1" {
				logger.Error("invalid JWT.aud requested", zap.String("aud", claims["aud"].(string)))
				return errValidationFailed("JWT invalid")
			}
			if claims["googleOAuthToken"] != nil {
				// Google認証の場合はOauthTokenが有効かをチェックする
				var oauthToken oauth2.Token
				json.Unmarshal([]byte(claims["googleOAuthToken"].(string)), &oauthToken)
				if _, err := service.GetGoogleOAuthUser(ctx, &oauthToken); err != nil {
					logger.Error("invalid google oauth token")
					return errValidationFailed("oauth token invalid")
				}
			}

			// 権限チェック
			var roles map[string][]string
			json.Unmarshal([]byte(claims["roles"].(string)), &roles)

			reqMethod := strings.ToLower(req.Method)
			resource := strings.Split(req.RequestURI, "/")[1]
			if common.InStringArray(resource, service.GetApiWhiteList()) < 0 && common.InStringArray("*", roles[reqMethod]) < 0 && common.InStringArray(resource, roles[reqMethod]) < 0 {
				// 権限がないリクエスト
				return errForbidden("permission denied")
			}

			newCtx := context.WithValue(ctx, bridge.JwtClaims, claims)
			return after(newCtx, rw, req)
		}
	}

	fm, _ := goa.NewMiddleware(validate)
	return fm
}

// JWT of middleware
func JWT() goa.Middleware {
	pem := common.GetPublicKey()
	key, err := jwtgo.ParseRSAPublicKeyFromPEM([]byte(pem))
	if err != nil {
		panic(err)
	}
	keys := []jwt.Key{key}
	return jwt.New(jwt.NewSimpleResolver(keys), validation(), app.NewJWTSecurity())
}

package middleware

import (
	"net/http"

	"context"

	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	jwtgo "github.com/dgrijalva/jwt-go"
	"github.com/goadesign/goa"
	"github.com/goadesign/goa/middleware/security/jwt"
	"go.uber.org/zap"
)

func validation() goa.Middleware {
	logger := common.GetLogger("default")
	errValidationFailed := goa.NewErrorClass("validation_failed", 401)

	validate := func(nextHandler goa.Handler) goa.Handler {
		return func(ctx context.Context, rw http.ResponseWriter, req *http.Request) error {
			token := jwt.ContextJWT(ctx)
			if token == nil {
				// 認可を必要としないAPIの場合はこっちに入る
				return nextHandler(ctx, rw, req)
			}
			claims := token.Claims.(jwtgo.MapClaims)

			if claims["iss"] != "DMC" {
				logger.Error("invalid JWT.iss requested", zap.String("iss", claims["iss"].(string)))
				return errValidationFailed("JWT invalid")
			}
			if claims["aud"] != "dmc.local" {
				logger.Error("invalid JWT.aud requested", zap.String("aud", claims["aud"].(string)))
				return errValidationFailed("JWT invalid")
			}

			// TODO: claimからrole取り出して権限のチェック

			newCtx := context.WithValue(ctx, "claims", claims)
			return nextHandler(newCtx, rw, req)
		}
	}

	fm, _ := goa.NewMiddleware(validate)
	return fm
}

func JWT() goa.Middleware {
	pem := common.GetPublicKey()
	key, err := jwtgo.ParseRSAPublicKeyFromPEM([]byte(pem))
	if err != nil {
		panic(err)
	}
	keys := []jwt.Key{key}
	return jwt.New(jwt.NewSimpleResolver(keys), validation(), app.NewJWTSecurity())
}

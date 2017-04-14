package middleware

import (
	"net/http"

	"context"

	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	jwtgo "github.com/dgrijalva/jwt-go"
	"github.com/goadesign/goa"
	"github.com/goadesign/goa/middleware/security/jwt"
)

func validation() goa.Middleware {
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
				return errValidationFailed("JWT invalid")
			}
			if claims["aud"] != "dmc.local" {
				return errValidationFailed("JWT invalid")
			}

			// TODO: claimからrole取り出して権限のチェック

			return nextHandler(ctx, rw, req)
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

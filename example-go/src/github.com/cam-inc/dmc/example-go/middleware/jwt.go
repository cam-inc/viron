package middleware

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"path/filepath"

	"golang.org/x/net/context"

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
	keys, err := LoadJWTPublicKeys()
	if err != nil {
		panic(err)
	}
	return jwt.New(jwt.NewSimpleResolver(keys), validation(), app.NewJWTSecurity())
}

// LoadJWTPublicKeys loads PEM encoded RSA public keys used to validata and decrypt the JWT.
func LoadJWTPublicKeys() ([]jwt.Key, error) {
	keyFiles, err := filepath.Glob("./jwtkey/*.pub")
	if err != nil {
		return nil, err
	}
	keys := make([]jwt.Key, len(keyFiles))
	for i, keyFile := range keyFiles {
		pem, err := ioutil.ReadFile(keyFile)
		if err != nil {
			return nil, err
		}
		key, err := jwtgo.ParseRSAPublicKeyFromPEM([]byte(pem))
		if err != nil {
			return nil, fmt.Errorf("failed to load key %s: %s", keyFile, err)
		}
		keys[i] = key
	}
	if len(keys) == 0 {
		return nil, fmt.Errorf("couldn't load public keys for JWT security")
	}

	return keys, nil
}

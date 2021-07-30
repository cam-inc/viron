package auth

import (
	"fmt"
	"time"

	"github.com/cam-inc/viron/packages/golang/constant"

	"github.com/lestrrat-go/jwx/jwa"

	"github.com/go-chi/jwtauth"
)

type (
	JWT struct {
		Secret        string
		Provider      string
		ExpirationSec int
		jwtAuth       *jwtauth.JWTAuth
	}
	Config struct {
		Secret        string
		Provider      string
		ExpirationSec int
	}
	Claim struct {
		Exp int
		Iat int
		Nbf int
		Sub string
		Iss string
		Aud []string
	}
)

var (
	jwt *JWT
)

func SetUp(secret string, provider string, expiration int) error {
	jwt = &JWT{
		Secret:        secret,
		Provider:      provider,
		ExpirationSec: expiration,
		jwtAuth:       jwtauth.New(string(jwa.HS512), []byte(secret), nil),
	}
	return nil
}

func Sign(subject string) string {
	claim := map[string]interface{}{
		"nbf": 0,
		"sub": subject,
		"iss": jwt.Provider,
		"aud": []string{jwt.Provider},
	}
	jwtauth.SetExpiryIn(claim, time.Duration(jwt.ExpirationSec)*time.Second)
	jwtauth.SetIssuedNow(claim)
	_, tokenStr, _ := jwt.jwtAuth.Encode(claim)
	return fmt.Sprintf("%s %s", constant.AUTH_SCHEME, tokenStr)
}

func Verify(token string) *Claim {
	jwtToken, err := jwtauth.VerifyToken(jwt.jwtAuth, token)
	if err != nil {
		return nil
	}

	claim := &Claim{
		Exp: int(jwtToken.Expiration().Unix()),
		Iat: int(jwtToken.IssuedAt().Unix()),
		Nbf: int(jwtToken.NotBefore().Unix()),
		Sub: jwtToken.Subject(),
		Iss: jwtToken.Issuer(),
		Aud: jwtToken.Audience(),
	}

	return claim
}

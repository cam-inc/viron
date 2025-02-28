package auth

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/cam-inc/viron/packages/golang/logging"

	"github.com/cam-inc/viron/packages/golang/errors"

	"github.com/cam-inc/viron/packages/golang/constant"

	"github.com/cam-inc/viron/packages/golang/config"

	"github.com/lestrrat-go/jwx/jwa"
	jwxJwt "github.com/lestrrat-go/jwx/jwt"

	"github.com/go-chi/jwtauth"
)

type (
	// Config struct {
	// 	Secret        string
	// 	Provider      string
	// 	ExpirationSec int
	// }
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
	jwt *config.JWT
	log logging.Logger
)

func SetUp(secret string, provider func(r *http.Request) (string, []string, error), expiration int) error {
	jwt = &config.JWT{
		Secret:        secret,
		Provider:      provider,
		ExpirationSec: expiration,
		JwtAuth:       jwtauth.New(string(jwa.HS512), []byte(secret), nil),
	}
	log = logging.GetDefaultLogger()
	return nil
}

func Sign(r *http.Request, subject string) (string, error) {
	iss, aud, err := jwt.Provider(r)
	if err != nil {
		return "", err
	}
	claim := map[string]interface{}{
		"nbf": 0,
		"sub": subject,
		"iss": iss,
		"aud": aud,
	}
	jwtauth.SetExpiryIn(claim, time.Duration(jwt.ExpirationSec)*time.Second)
	jwtauth.SetIssuedNow(claim)
	_, tokenStr, err := jwt.JwtAuth.Encode(claim)

	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s %s", constant.AUTH_SCHEME, tokenStr), nil
}

func Verify(r *http.Request, token string) (*Claim, error) {

	if jwt == nil {
		return nil, errors.JwtUninitialized
	}

	if IsSignedOut(context.Background(), token) {
		return nil, fmt.Errorf("this token is revoked %s", token)
	}

	jwtToken, err := VerifyToken(token)
	if err != nil {
		return nil, err
	}

	iss, aud, err := jwt.Provider(r)
	if err != nil {
		return nil, err
	}
	if iss != jwtToken.Issuer() {
		return nil, fmt.Errorf("iss miss match verify iss[%s] jwt iss[%s]", iss, jwtToken.Issuer())
	}
	if !checkAudience(aud, jwtToken.Audience()) {
		return nil, fmt.Errorf("aud miss match verify aud[%s] jwt aud[%s]", aud, jwtToken.Audience())
	}

	claim := &Claim{
		Exp: int(jwtToken.Expiration().Unix()),
		Iat: int(jwtToken.IssuedAt().Unix()),
		Nbf: int(jwtToken.NotBefore().Unix()),
		Sub: jwtToken.Subject(),
		Iss: jwtToken.Issuer(),
		Aud: jwtToken.Audience(),
	}

	return claim, nil
}

func VerifyToken(token string) (jwxJwt.Token, error) {
	return jwtauth.VerifyToken(jwt.JwtAuth, token)
}

func checkAudience(providerAudience []string, jwtAudience []string) bool {
	// 発行者と依頼者が未設定はtrue
	if len(providerAudience) == 0 && len(jwtAudience) == 0 {
		return true
	}
	// jwt audience が provider audienceに含まれていればtrue
	for _, ja := range jwtAudience {
		for _, pa := range providerAudience {
			if ja == pa {
				return true
			}
		}
	}
	return false
}

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
	//now := time.Now().Second()
	claim := map[string]interface{}{
		//"exp": now + jwt.ExpirationSec,
		//"iat": now,
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
	// const claims = await domainsAuth.verifyJwt(token);
	//jwtToken, err := jwt.jwtAuth.Decode(token)
	jwtToken, err := jwtauth.VerifyToken(jwt.jwtAuth, token)
	if err != nil {
		//
		fmt.Println(err)
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

	fmt.Println(jwtToken.Expiration())
	fmt.Println(jwtToken.IssuedAt())

	return claim

}

/*

constructor(config: JwtConfig) {
    this.secret = config.secret;
    this.provider = config.provider;
    this.expirationSec = config.expirationSec ?? DEFAULT_JWT_EXPIRATION_SEC;
  }

  // 署名
  sign(subject: string): string {
    const now = Math.floor(Date.now() / 1000);
    const token = sign(
      {
        exp: now + this.expirationSec, // 有効期限
        iat: now, // 発行した日時
        nbf: 0, // 有効になる日時
        sub: subject, // ユーザー識別子
        iss: this.provider, // 発行者
        aud: this.provider, // 利用者
      },
      this.secret,
      {
        algorithm: JWT_HASH_ALGORITHM,
      }
    );
    return `${AUTH_SCHEME} ${token}`;

  // 検証
  async verify(token: string): Promise<JwtClaims | null> {
    const [scheme, credentials, ...unexpects] = token.split(' ');
    if (unexpects?.length || !regExpAuthScheme.test(scheme)) {
      return null;
    }
    return await new Promise((resolve): void => {
      verify(
        credentials,
        this.secret,
        {
          algorithms: [JWT_HASH_ALGORITHM],
          audience: this.provider,
          issuer: this.provider,
        },
        // eslint-disable-next-line @typescript-eslint/ban-types
        (err: Error | null, decoded: object | undefined): void => {
          if (err) {
            debug(err);
            return resolve(null);
          }
          debug('decoded claims:', decoded);
          resolve(decoded ? (decoded as JwtClaims) : null);
        }
      );
    });


// 初期化
export const initJwt = (config: JwtConfig): Jwt => {
  if (!jwt) {
    jwt = new Jwt(config);
  }
  return jwt;
};

// JWT生成
export const signJwt = (subject: string): string => {
  if (!jwt) {
    throw jwtUninitialized();
  }
  return jwt.sign(subject);
};

// JWT検証
export const verifyJwt = async (
  token?: string | null
): Promise<JwtClaims | null> => {
  if (!jwt) {
    throw jwtUninitialized();
  }
  if (!token) {
    return null;
  }
  if (await isSignedout(token)) {
    debug('Already signed out. token: %s', token);
    return null;
  }
  return await jwt.verify(token);
};

*/

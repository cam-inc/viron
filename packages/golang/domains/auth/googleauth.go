package auth

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/cam-inc/viron/packages/golang/config"
	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/domains"
	"github.com/cam-inc/viron/packages/golang/errors"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	oauthv2 "google.golang.org/api/oauth2/v2"
)

var (
	googleOAuth2Config *config.GoogleOAuth2
)

func NewGoogleOAuth2(googleOAuth2 *config.GoogleOAuth2) {
	googleOAuth2Config = googleOAuth2
}

func getGoogleOAuth2Config(redirectUrl string, googleOAuth2 *config.GoogleOAuth2) *oauth2.Config {
	scope := constant.GOOGLE_OAUTH2_DEFAULT_SCOPES
	if len(googleOAuth2.AdditionalScope) > 0 {
		scope = append(constant.GOOGLE_OAUTH2_DEFAULT_SCOPES, googleOAuth2.AdditionalScope...)
	}
	cfn := &oauth2.Config{
		ClientID:     googleOAuth2.ClientID,
		ClientSecret: googleOAuth2.ClientSecret,
		Endpoint:     google.Endpoint,
		Scopes:       scope,
		RedirectURL:  redirectUrl,
	}
	return cfn
}

func GetGoogleOAuth2AuthorizationUrl(redirectUrl string, state string) (string, *errors.VironError) {
	cfn := getGoogleOAuth2Config(redirectUrl, googleOAuth2Config)
	url := cfn.AuthCodeURL(state)
	return url, nil
}

func SigninGoogleOAuth2(code string, redirectUrl string, r *http.Request) (string, *errors.VironError) {
	cfn := getGoogleOAuth2Config(redirectUrl, googleOAuth2Config)
	oauth2Token, err := cfn.Exchange(context.Background(), code)
	if err != nil {
		log.Errorf("Exchange failed -> %v", err)
		return "", errors.SigninFailed
	}

	ctx := r.Context()
	//nolint:staticcheck
	oauth2Service, err := oauthv2.New(cfn.Client(ctx, oauth2Token))
	if err != nil {
		log.Errorf("oauthv2.New failed -> %v", err)
		return "", errors.SigninFailed
	}

	tokenInfo, err := oauth2Service.Tokeninfo().AccessToken(oauth2Token.AccessToken).Context(ctx).Do()
	if err != nil || tokenInfo == nil || tokenInfo.Email == "" {
		log.Errorf("oauth2Service failed err:%v, tokenInfo:%v ", err, tokenInfo)
		return "", errors.SigninFailed
	}

	userHostedDomains := googleOAuth2Config.UserHostedDomains
	emailDomain := tokenInfo.Email[strings.Index(tokenInfo.Email, "@")+1:]
	domainCheck := false
	for _, v := range userHostedDomains {
		if v == emailDomain {
			domainCheck = true
			break
		}
	}
	if !domainCheck {
		log.Error("domainCheck is false.")
		return "", errors.SigninFailed
	}

	user := domains.FindByEmail(ctx, tokenInfo.Email)
	if user == nil {
		expiry := uint64(oauth2Token.Expiry.UnixNano() / int64(time.Millisecond))
		payload := &domains.AdminUser{
			Email:                    tokenInfo.Email,
			GoogleOAuth2TokenType:    &oauth2Token.TokenType,
			GoogleOAuth2IdToken:      nil,
			GoogleOAuth2AccessToken:  &oauth2Token.AccessToken,
			GoogleOAuth2RefreshToken: &oauth2Token.RefreshToken,
			GoogleOAuth2ExpiryDate:   &expiry,
			AuthType:                 constant.AUTH_TYPE_GOOGLE,
		}
		var err error
		user, err = createFirstAdminUser(ctx, payload, payload.AuthType)
		if err != nil {
			log.Errorf("create first admin user failed err:%v, user:%v", err, user)
			return "", errors.SigninFailed
		}

		if user == nil {
			if user, err = createViewer(ctx, payload, payload.AuthType); err != nil {
				log.Errorf("create admin user(viewer) failed err:%v, user:%v", err, user)
			}
		}
	}

	if user.AuthType != constant.AUTH_TYPE_GOOGLE {
		log.Error("user authType is not google.")
		return "", errors.SigninFailed
	}

	token, err := Sign(r, user.ID)
	if err != nil {
		log.Error("SigninGoogleOAuth2 sign failed %#v \n", err)
		return "", errors.SigninFailed
	}
	return token, nil
}

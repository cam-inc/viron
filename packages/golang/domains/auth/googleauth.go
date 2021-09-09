package auth

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/cam-inc/viron/packages/golang/errors"
	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/domains"
	"github.com/cam-inc/viron/packages/golang/config"
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

func GetGoogleOAuth2Config(redirectUrl string, googleOAuth2 *config.GoogleOAuth2) *oauth2.Config {
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
	cfn := GetGoogleOAuth2Config(redirectUrl, googleOAuth2Config)
	url := cfn.AuthCodeURL(state)
	return url, nil
}

func SigninGoogleOAuth2(code string, redirectUrl string, ctx context.Context) (string, *errors.VironError) {
	cfn := GetGoogleOAuth2Config(redirectUrl, googleOAuth2Config)

	oauth2Token, err := cfn.Exchange(oauth2.NoContext, code)
	if err != nil {
		return "", errors.SigninFailed
	}

	oauth2Service, err := oauthv2.New(cfn.Client(ctx, oauth2Token))
	if err != nil {
		return "", errors.SigninFailed
	}

	tokenInfo, err := oauth2Service.Tokeninfo().AccessToken(oauth2Token.AccessToken).Context(ctx).Do()
	if err != nil || tokenInfo == nil || tokenInfo.Email == "" {
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
		if err != nil || user == nil {
			return "", errors.SigninFailed
		}
	}

	if user.AuthType != constant.AUTH_TYPE_GOOGLE {
		return "", errors.SigninFailed
	}

	return Sign(fmt.Sprintf("%d", user.ID)), nil
}

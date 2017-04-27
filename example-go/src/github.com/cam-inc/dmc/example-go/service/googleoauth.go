package service

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"strings"

	"github.com/cam-inc/dmc/example-go/common"
	"go.uber.org/zap"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

// GoogleOAuth2UserInfo type of google oauth userinfo
type GoogleOauth2UserInfo struct {
	ID            string `json:id`
	EMail         string `json:email`
	VerifiedEMail bool   `json:verified_email`
	Name          string `json:name`
	GivenName     string `json:given_name`
	FamilyName    string `json:family_name`
	Picture       string `json:picture`
	HostedDomain  string `json:hd`
}

// GetOAuth2Config returns oauth2.config
func GetOAuth2Config() oauth2.Config {
	oauthConfig := common.GetGoogleOAuth()
	return oauth2.Config{
		ClientID:     oauthConfig.ClientID,
		ClientSecret: oauthConfig.ClientSecret,
		Endpoint:     google.Endpoint,
		RedirectURL:  oauthConfig.RedirectURL,
		Scopes:       oauthConfig.Scopes,
	}
}

// IsAllowEMailAddress returns whether the mail address is valid
func IsAllowEMailAddress(mail string) bool {
	oauthConfig := common.GetGoogleOAuth()
	domain := strings.Split(mail, "@")[1]
	return common.InStringArray(domain, oauthConfig.AllowEmailDomains) >= 0
}

// GetGoogleOAuthUser returns google oauth userinfo
func GetGoogleOAuthUser(ctx context.Context, token *oauth2.Token) (GoogleOauth2UserInfo, error) {
	logger := common.GetLogger("default")
	var userInfo GoogleOauth2UserInfo

	config := GetOAuth2Config()
	client := config.Client(ctx, token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		logger.Error("get userinfo failure.", zap.Error(err))
		return userInfo, err
	}

	defer resp.Body.Close()
	byteArr, _ := ioutil.ReadAll(resp.Body)
	json.Unmarshal(byteArr, &userInfo)
	return userInfo, nil
}

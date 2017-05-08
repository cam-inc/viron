package controller

import (
	"bytes"
	"context"
	"crypto/rsa"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"net/url"

	"sort"

	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/cam-inc/dmc/example-go/models"
	"github.com/cam-inc/dmc/example-go/service"
	jwtgo "github.com/dgrijalva/jwt-go"
	"github.com/goadesign/goa"
	"github.com/jinzhu/gorm"
	uuid "github.com/satori/go.uuid"
	"go.uber.org/zap"
	"golang.org/x/crypto/scrypt"
)

// AuthController implements the auth resource.
type AuthController struct {
	*goa.Controller
	privateKey *rsa.PrivateKey
}

func getRoles(ctx context.Context, roleID string) ([]byte, error) {
	roles := map[string][]string{}
	if roleID == common.GetSuperRole() {
		// super権限の場合は全許可
		roles["get"] = []string{"*"}
		roles["post"] = []string{"*"}
		roles["put"] = []string{"*"}
		roles["delete"] = []string{"*"}
		roles["patch"] = []string{"*"}
	} else {
		adminRoleTable := models.NewAdminRoleDB(common.DB)
		adminRoleModels, err := adminRoleTable.ListByRoleID(ctx, roleID)
		if err != nil {
			return nil, err
		}

		for _, m := range adminRoleModels {
			/*
				Roleをチェックしやすい構造に整形する
				roles:
					get: ["*"]
					post: ["item"]
					put: ["item", "user"]
					delete: ["item"]
					patch: ["item"]
			*/
			method := strings.ToLower(m.Method)
			if m.Resource == "*" {
				if len(roles[method]) <= 0 {
					roles[method] = append(roles[method], m.Resource)
				}
			} else {
				if len(roles[method]) > 0 && roles[method][0] == "*" {
					// ワイルドカード以外のリソースが設定されている場合はワイルドカード権限を無効にする
					roles[method] = roles[method][1:]
				}
				roles[method] = append(roles[method], m.Resource)
			}
		}
	}
	return json.Marshal(roles)
}

func generateJwt(customClaims map[string]interface{}, privateKey *rsa.PrivateKey) (string, error) {
	token := jwtgo.New(jwtgo.SigningMethodRS512)
	in1day := time.Now().Add(time.Duration(24) * time.Hour).Unix()
	claims := jwtgo.MapClaims{
		"iss":    "DMC",                 // Token発行者
		"aud":    "dmc.1",               // このTokenを利用する対象の識別子
		"exp":    in1day,                // Tokenの有効期限
		"jti":    uuid.NewV4().String(), // Tokenを一意に識別するためのID
		"iat":    time.Now().Unix(),     // Tokenを発行した日時(now)
		"nbf":    0,                     // Tokenが有効になるのが何分後か
		"scopes": "api:access",          // このTokenが有効なSCOPE - not a standard claim
	}
	for k, v := range customClaims {
		claims[k] = v
	}
	token.Claims = claims
	return token.SignedString(privateKey)
}

func encode(v url.Values) string {
	var buf bytes.Buffer
	keys := make([]string, 0, len(v))
	for k := range v {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	for _, k := range keys {
		vs := v[k]
		prefix := url.PathEscape(k) + "="
		for _, v := range vs {
			if buf.Len() > 0 {
				buf.WriteByte('&')
			}
			buf.WriteString(prefix)
			buf.WriteString(url.PathEscape(v))
		}
	}
	return buf.String()
}

// NewAuthController creates a auth controller.
func NewAuthController(service *goa.Service) *AuthController {
	b := common.GetPrivateKey()
	privateKey, err := jwtgo.ParseRSAPrivateKeyFromPEM([]byte(b))
	if err != nil {
		panic(err)
	}
	return &AuthController{
		Controller: service.NewController("AuthController"),
		privateKey: privateKey,
	}
}

// Signin runs the signin action.
func (c *AuthController) Signin(ctx *app.SigninAuthContext) error {
	// AuthController_Signin: start_implement
	logger := common.GetLogger("default")
	// Authorize
	adminUserTable := models.NewAdminUserDB(common.DB)
	adminUserModel, err := adminUserTable.GetByEmail(ctx.Context, *ctx.Payload.Email)
	if err == gorm.ErrRecordNotFound {
		if adminUsers := adminUserTable.ListAdminUserSmall(ctx.Context); len(adminUsers) > 0 {
			return ctx.NotFound()
		}
		// DBに1人も管理者がいないときは、このユーザーをスーパーユーザーとして登録する
		adminUserModel, err = service.CreateAdminUserByIdPassword(ctx.Context, *ctx.Payload.Email, *ctx.Payload.Password, common.GetSuperRole())
		if err != nil {
			return ctx.InternalServerError()
		}
	} else if err != nil {
		logger.Error("Signin GetByEmail failure.", zap.String("email", *ctx.Payload.Email))
		ctx.ResponseWriter.Header().Set("location", "/")
		return ctx.TemporaryRedirect()
	}

	hash, err := scrypt.Key([]byte(*ctx.Payload.Password), []byte(adminUserModel.Salt), 16384, 8, 1, 64)
	if adminUserModel.Password != base64.StdEncoding.EncodeToString(hash) {
		return ctx.Unauthorized()
	}

	if roles, err := getRoles(ctx.Context, adminUserModel.RoleID); err != nil {
		logger.Error("Signin getRoles failure.",
			zap.String("email", *ctx.Payload.Email),
			zap.String("roleID", adminUserModel.RoleID))
		ctx.ResponseWriter.Header().Set("location", "/")
		return ctx.TemporaryRedirect()
	} else {
		// Generate JWT
		claims := map[string]interface{}{
			"sub":   *ctx.Payload.Email, // ユーザー識別子
			"roles": string(roles),      // ユーザー権限 - not a standard claim
		}
		if jwt, err := generateJwt(claims, c.privateKey); err != nil {
			logger.Error("Signin failed to sign token", zap.Error(err))
			ctx.ResponseWriter.Header().Set("location", "/")
			return ctx.TemporaryRedirect()
		} else {
			// Set auth header for client retrieval
			ctx.ResponseData.Header().Set("Authorization", fmt.Sprintf("Bearer %s", jwt))
			// AuthController_Signin: end_implement
			return ctx.NoContent()
		}
	}
}

// Signout runs the signout action.
func (c *AuthController) Signout(ctx *app.SignoutAuthContext) error {
	// AuthController_Signout: start_implement

	// Put your logic here
	ctx.ResponseData.Header().Del("Authorization")

	// AuthController_Signout: end_implement
	return ctx.NoContent()
}

// Googlesignin runs the googlesignin action.
func (c *AuthController) Googlesignin(ctx *app.GooglesigninAuthContext) error {
	config := service.GetOAuth2Config()
	redirectUrl := config.AuthCodeURL(*ctx.RedirectURL)

	ctx.ResponseWriter.Header().Set("Content-Type", "text/html")
	ctx.ResponseWriter.Header().Set("location", redirectUrl)
	return ctx.MovedPermanently()
}

// Googleoauth2callback runs the googleoauth2callback action.
func (c *AuthController) Googleoauth2callback(ctx *app.Googleoauth2callbackAuthContext) error {
	logger := common.GetLogger("default")

	// エラー時のリダイレクトURLを組み立て
	r := *ctx.State
	u, _ := url.Parse(r)
	q := u.Query()
	q.Set("token", "")
	u.RawQuery = q.Encode()
	redirectUrl := u.String()

	// OAuthTokenを取得
	config := service.GetOAuth2Config()
	token, err := config.Exchange(ctx.Context, *ctx.Code)
	if err != nil {
		logger.Error("GoogleSignin get token failure.", zap.Error(err))
		ctx.ResponseWriter.Header().Set("location", redirectUrl)
		return ctx.TemporaryRedirect()
	}

	// GoogleのUser情報を取得
	if userInfo, err := service.GetGoogleOAuthUser(ctx.Context, token); err != nil {
		ctx.ResponseWriter.Header().Set("location", redirectUrl)
		return ctx.TemporaryRedirect()
	} else if isAllow := service.IsAllowEMailAddress(userInfo.EMail); isAllow == false {
		ctx.ResponseWriter.Header().Set("location", redirectUrl)
		return ctx.TemporaryRedirect()
	} else {
		email := userInfo.EMail

		adminUserTable := models.NewAdminUserDB(common.DB)
		adminUserModel, err := adminUserTable.GetByEmail(ctx.Context, email)
		if err == gorm.ErrRecordNotFound {
			// 新規ユーザーの場合はユーザー作成
			roleId := common.GetDefaultRole()
			if adminUsers := adminUserTable.ListAdminUserSmall(ctx.Context); len(adminUsers) <= 0 {
				// 1人目はスーパーユーザーにする
				roleId = common.GetSuperRole()
			}
			m := models.NewAdminUser()
			m.Email = email
			m.RoleID = roleId
			if err = adminUserTable.Add(ctx.Context, &m); err != nil {
				logger.Error("GoogleSignin add admin_user failure.", zap.String("email", email))
				ctx.ResponseWriter.Header().Set("location", redirectUrl)
				return ctx.TemporaryRedirect()
			}
			adminUserModel = &m
		} else if err != nil {
			logger.Error("GoogleSignin GetByEmail failure.", zap.String("email", email))
			ctx.ResponseWriter.Header().Set("location", redirectUrl)
			return ctx.TemporaryRedirect()
		}

		if roles, err := getRoles(ctx.Context, adminUserModel.RoleID); err != nil {
			logger.Error("GoogleSignin getRoles failure.",
				zap.String("email", adminUserModel.Email),
				zap.String("roleID", adminUserModel.RoleID))
			ctx.ResponseWriter.Header().Set("location", redirectUrl)
			return ctx.TemporaryRedirect()
		} else {
			// Generate JWT
			tokenBytes, _ := json.Marshal(token)
			claims := map[string]interface{}{
				"sub":              adminUserModel.Email, // ユーザー識別子
				"roles":            string(roles),        // ユーザー権限 - not a standard claim
				"googleOAuthToken": string(tokenBytes),   // googleOAuthToken - not a standard claim
			}
			if jwt, err := generateJwt(claims, c.privateKey); err != nil {
				logger.Error("GoogleSignin failed to sign token", zap.Error(err))
				ctx.ResponseWriter.Header().Set("location", redirectUrl)
				return ctx.TemporaryRedirect()
			} else {
				// Set auth header for client retrieval
				authToken := fmt.Sprintf("Bearer %s", jwt)

				q.Set("token", authToken)
				u.RawQuery = encode(q)

				ctx.ResponseData.Header().Set("Authorization", authToken)
				ctx.ResponseWriter.Header().Set("location", u.String())
				return ctx.MovedPermanently()
			}
		}
	}
}

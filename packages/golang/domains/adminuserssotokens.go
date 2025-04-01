package domains

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/cam-inc/viron/packages/golang/errors"

	"github.com/cam-inc/viron/packages/golang/repositories/container"

	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/repositories"
)

type (
	AdminUserSSOToken struct {
		ID           string    `json:"id"`
		UserID       string    `json:"userId"`
		Provider     string    `json:"provider"`
		ClientID     string    `json:"clientId"`
		AuthType     string    `json:"authType"`
		IdToken      string    `json:"idToken"`
		AccessToken  string    `json:"accessToken"`
		RefreshToken *string   `json:"refreshToken,omitempty"`
		ExpiryDate   int64     `json:"expiryDate"`
		TokenType    string    `json:"tokenType"`
		CreatedAt    time.Time `json:"createdAt"`
		UpdatedAt    time.Time `json:"updatedAt"`
	}

	AdminUserSSOTokensWithPager struct {
		Pager
		List []*AdminUserSSOToken `json:"list"`
	}

	AdminUserSSOTokenConditions struct {
		ID       string
		UserID   string
		Provider string
		ClientID string
		AuthType string
		Size     int
		Page     int
		Sort     []string
	}
)

// CreateAdminUserSSOToken adminUserSsoToken insert
func CreateAdminUserSSOToken(ctx context.Context, payload *AdminUserSSOToken, authType string) (*AdminUserSSOToken, *errors.VironError) {

	ssoToken := &repositories.AdminUserSSOTokenEntity{}

	if authType == constant.AUTH_TYPE_OIDC {
		ssoToken.AuthType = authType
		ssoToken.UserID = payload.UserID
		ssoToken.Provider = payload.Provider
		ssoToken.ClientID = payload.ClientID
		ssoToken.TokenType = payload.TokenType
		ssoToken.IdToken = payload.IdToken
		ssoToken.AccessToken = payload.AccessToken
		ssoToken.RefreshToken = payload.RefreshToken
		ssoToken.ExpiryDate = payload.ExpiryDate
	}

	entity, err := container.GetAdminUserSSOTokenRepository().CreateOne(ctx, ssoToken)
	if err != nil {
		return nil, errors.Initialize(http.StatusInternalServerError, fmt.Sprintf("adminUser createOne %+v", err))
	}

	if err := entity.Bind(ssoToken); err != nil {
		return nil, errors.Initialize(http.StatusInternalServerError, fmt.Sprintf("%v", err))
	}

	payload.ID = ssoToken.ID

	return payload, nil
}

// CountAdminUserSSOToken adminUserSsoTokensレコード数をカウント
func CountAdminUserSSOToken(ctx context.Context) int {
	repo := container.GetAdminUserSSOTokenRepository()
	return repo.Count(ctx, nil)
}

// FindSSOTokenByUserID UserIDで1件取得
func FindSSOTokenByUserID(ctx context.Context, clientID string, userID string) *AdminUserSSOToken {

	conditions := &repositories.AdminUserSSOTokenConditions{
		UserID:   userID,
		ClientID: clientID,
		Paginate: &repositories.Paginate{
			Size: 1,
			Page: 1,
		},
	}

	return findOneSSOToken(ctx, conditions)
}

func findOneSSOToken(ctx context.Context, conditions *repositories.AdminUserSSOTokenConditions) *AdminUserSSOToken {
	repo := container.GetAdminUserSSOTokenRepository()
	conditions.Paginate = &repositories.Paginate{
		Size: 1,
		Page: 1,
	}
	result, err := repo.Find(ctx, conditions)
	if err != nil || len(result) == 0 {
		log.Errorf("adminuserssotokens.go findOne conditions:%+v err %+v result %+v", conditions, err, result)
		return nil
	}

	user := &repositories.AdminUserSSOTokenEntity{}

	if err := result[0].Bind(user); err != nil {
		log.Errorf("adminusers.go findOne bind failed err:%v", err)
		return nil
	}

	return &AdminUserSSOToken{
		ID:           user.ID,
		UserID:       user.UserID,
		ClientID:     user.ClientID,
		Provider:     user.Provider,
		AuthType:     user.AuthType,
		IdToken:      user.IdToken,
		AccessToken:  user.AccessToken,
		RefreshToken: user.RefreshToken,
		ExpiryDate:   user.ExpiryDate,
		TokenType:    user.TokenType,
		CreatedAt:    user.CreatedAt,
		UpdatedAt:    user.UpdatedAt,
	}
}

// UpdateAdminUserSSOTokenByUserID IDで1件更新
func UpdateAdminUserSSOTokenByUserID(ctx context.Context, clientID string, userID string, payload AdminUserSSOToken) *errors.VironError {
	ssoToken := findOneSSOToken(ctx, &repositories.AdminUserSSOTokenConditions{UserID: userID, ClientID: clientID})
	if ssoToken == nil {
		return errors.AdminUserSSOTokenNotfound
	}
	repo := container.GetAdminUserSSOTokenRepository()

	entity := &repositories.AdminUserSSOTokenEntity{
		ID:           ssoToken.ID,
		UserID:       ssoToken.UserID,
		Provider:     ssoToken.Provider,
		ClientID:     ssoToken.ClientID,
		AuthType:     ssoToken.AuthType,
		IdToken:      payload.IdToken,
		AccessToken:  payload.AccessToken,
		RefreshToken: payload.RefreshToken,
		ExpiryDate:   payload.ExpiryDate,
		TokenType:    payload.TokenType,
	}

	if err := repo.UpdateByID(ctx, ssoToken.ID, entity); err != nil {
		return errors.Initialize(http.StatusInternalServerError, fmt.Sprintf("adminUserSSOToken update failed. %+v", err))
	}

	return nil
}

// ListAdminUserSSOToken 一覧取得
func ListAdminUserSSOToken(ctx context.Context, opts *AdminUserSSOTokenConditions) (*AdminUserSSOTokensWithPager, error) {

	repo := container.GetAdminUserSSOTokenRepository()

	conditions := &repositories.AdminUserSSOTokenConditions{}
	if opts != nil {
		conditions.UserID = opts.UserID
		conditions.Paginate = &repositories.Paginate{
			Sort: opts.Sort,
			Page: opts.Page,
			Size: opts.Size,
		}
	}
	if conditions.Page <= 0 {
		conditions.Page = constant.DEFAULT_PAGER_PAGE
	}
	if conditions.Size <= 0 {
		conditions.Size = constant.DEFAULT_PAGER_SIZE
	}

	results, err := repo.Find(ctx, conditions)
	if err != nil {
		return nil, err
	}

	withPager := &AdminUserSSOTokensWithPager{
		List: []*AdminUserSSOToken{},
	}

	for _, result := range results {
		entity := &repositories.AdminUserSSOTokenEntity{}
		if err := result.Bind(entity); err != nil {
			return nil, err
		}
		adminuser := &AdminUserSSOToken{
			ID:           entity.ID,
			UserID:       entity.UserID,
			ClientID:     entity.ClientID,
			Provider:     entity.Provider,
			AuthType:     entity.AuthType,
			IdToken:      entity.IdToken,
			AccessToken:  entity.AccessToken,
			RefreshToken: entity.RefreshToken,
			ExpiryDate:   entity.ExpiryDate,
			TokenType:    entity.TokenType,
			CreatedAt:    entity.CreatedAt,
			UpdatedAt:    entity.UpdatedAt,
		}

		withPager.List = append(withPager.List, adminuser)
	}
	count := CountAdminUser(ctx)
	pager := Paging(count, conditions.Size, conditions.Page)
	withPager.Pager = pager
	return withPager, nil
}

func UpsertAdminUserSSOToken(ctx context.Context, ssoToken *AdminUserSSOToken) *errors.VironError {
	repo := container.GetAdminUserSSOTokenRepository()
	conditions := &repositories.AdminUserSSOTokenConditions{
		UserID:   ssoToken.UserID,
		ClientID: ssoToken.ClientID,
		Paginate: &repositories.Paginate{
			Size: 1,
			Page: 1,
		},
	}

	// SSOトークンの存在確認
	list, err := repo.Find(ctx, conditions)
	if err != nil {
		return errors.Initialize(http.StatusInternalServerError, fmt.Sprintf("adminUserSSOToken find failed. %+v", err))
	}
	if len(list) > 0 {
		// 既存のSSOトークンがある場合は更新
		token := &repositories.AdminUserSSOTokenEntity{}
		if err := list[0].Bind(token); err != nil {
			log.Errorf("adminuserssotokens.go findOne bind failed err:%v", err)
			return nil
		}
		token.UserID = ssoToken.UserID
		token.Provider = ssoToken.Provider
		token.ClientID = ssoToken.ClientID
		token.AuthType = ssoToken.AuthType
		token.IdToken = ssoToken.IdToken
		token.AccessToken = ssoToken.AccessToken
		token.RefreshToken = ssoToken.RefreshToken
		token.ExpiryDate = ssoToken.ExpiryDate
		token.TokenType = ssoToken.TokenType

		if err := repo.UpdateByID(ctx, token.ID, token); err != nil {
			return errors.Initialize(http.StatusInternalServerError, fmt.Sprintf("adminUserSSOToken update failed. %+v", err))
		}
		return nil
	} else {
		// SSOトークンがない場合は新規作成
		entity := &repositories.AdminUserSSOTokenEntity{
			UserID:       ssoToken.UserID,
			Provider:     ssoToken.Provider,
			ClientID:     ssoToken.ClientID,
			AuthType:     ssoToken.AuthType,
			IdToken:      ssoToken.IdToken,
			AccessToken:  ssoToken.AccessToken,
			RefreshToken: ssoToken.RefreshToken,
			ExpiryDate:   ssoToken.ExpiryDate,
			TokenType:    ssoToken.TokenType,
		}
		_, err := repo.CreateOne(ctx, entity)
		if err != nil {
			return errors.Initialize(http.StatusInternalServerError, fmt.Sprintf("adminUserSSOToken create failed. %+v", err))
		}
	}

	return nil
}

package domains

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/cam-inc/viron/packages/golang/logging"

	"github.com/cam-inc/viron/packages/golang/errors"

	"github.com/cam-inc/viron/packages/golang/repositories/container"

	"github.com/cam-inc/viron/packages/golang/helpers"

	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/repositories"
)

type (
	AdminUser struct {
		ID                       string    `json:"id"`
		Email                    string    `json:"email"`
		AuthType                 string    `json:"authType"`
		Password                 *string   `json:"password,omitempty"`
		Salt                     *string   `json:"salt,omitempty"`
		GoogleOAuth2AccessToken  *string   `json:"googleOAuth2AccessToken,omitempty"`
		GoogleOAuth2ExpiryDate   *uint64   `json:"googleOAuth2ExpiryDate,omitempty"`
		GoogleOAuth2IdToken      *string   `json:"googleOAuth2IdToken,omitempty"`
		GoogleOAuth2RefreshToken *string   `json:"googleOAuth2RefreshToken,omitempty"`
		GoogleOAuth2TokenType    *string   `json:"googleOAuth2TokenType,omitempty"`
		RoleIDs                  []string  `json:"roleIds"`
		CreatedAt                time.Time `json:"createdAt"`
		UpdatedAt                time.Time `json:"updatedAt"`
	}

	AdminUsersWithPager struct {
		Pager
		List []*AdminUser `json:"list"`
	}

	AdminUserConditions struct {
		ID       string
		Email    string
		AuthType string
		RoleID   string
		Size     int
		Page     int
		Sort     []string
	}
)

// CreateAdminUser adminUser insert
func CreateAdminUser(ctx context.Context, payload *AdminUser, authType string) (*AdminUser, *errors.VironError) {

	adminUser := &repositories.AdminUserEntity{}

	if authType == constant.AUTH_TYPE_EMAIL {
		adminUser.AuthType = authType
		adminUser.Email = string(payload.Email)
		if payload.Password == nil {
			return nil, errors.Initialize(http.StatusBadRequest, "password is nil.")
		}
		password := helpers.GenPassword(*payload.Password, "")
		adminUser.Password = &password.Password
		adminUser.Salt = &password.Salt
	} else if authType == constant.AUTH_TYPE_GOOGLE {
		adminUser.Email = string(payload.Email)
		adminUser.AuthType = authType
		adminUser.GoogleOAuth2TokenType = payload.GoogleOAuth2TokenType
		adminUser.GoogleOAuth2IdToken = payload.GoogleOAuth2IdToken
		adminUser.GoogleOAuth2AccessToken = payload.GoogleOAuth2AccessToken
		adminUser.GoogleOAuth2RefreshToken = payload.GoogleOAuth2RefreshToken
		adminUser.GoogleOAuth2ExpiryDate = payload.GoogleOAuth2ExpiryDate
	}

	entity, err := container.GetAdminUserRepository().CreateOne(ctx, adminUser)
	if err != nil {
		return nil, errors.Initialize(http.StatusInternalServerError, fmt.Sprintf("adminUser createOne %+v", err))
	}

	if err := entity.Bind(adminUser); err != nil {
		return nil, errors.Initialize(http.StatusInternalServerError, fmt.Sprintf("%v", err))
	}

	payload.ID = adminUser.ID
	payload.Salt = adminUser.Salt
	payload.Password = adminUser.Password

	// Role update
	if len(payload.RoleIDs) > 0 {
		updateRolesForUser(payload.ID, payload.RoleIDs)
	}

	return payload, nil
}

// CountAdminUser adminUserレコード数をカウント
func CountAdminUser(ctx context.Context) int {
	repo := container.GetAdminUserRepository()
	return repo.Count(ctx, nil)
}

func findOne(ctx context.Context, conditions *repositories.AdminUserConditions) *AdminUser {
	repo := container.GetAdminUserRepository()
	result, err := repo.Find(ctx, conditions)
	if err != nil || len(result) == 0 {
		log.Errorf("adminusers.go findOne conditions:%+v err %+v result %+v", conditions, err, result)
		return nil
	}

	user := &repositories.AdminUserEntity{}

	result[0].Bind(user)

	user.RoleIDs = listRoles(user.ID)

	auser := &AdminUser{
		ID:                       user.ID,
		Email:                    user.Email,
		Password:                 user.Password,
		AuthType:                 user.AuthType,
		Salt:                     user.Salt,
		GoogleOAuth2AccessToken:  user.GoogleOAuth2AccessToken,
		GoogleOAuth2ExpiryDate:   user.GoogleOAuth2ExpiryDate,
		GoogleOAuth2IdToken:      user.GoogleOAuth2IdToken,
		GoogleOAuth2RefreshToken: user.GoogleOAuth2RefreshToken,
		GoogleOAuth2TokenType:    user.GoogleOAuth2TokenType,
		CreatedAt:                user.CreatedAt,
		UpdatedAt:                user.UpdatedAt,
		RoleIDs:                  user.RoleIDs,
	}
	return auser
}

// FindByEmail emailで1件取得
func FindByEmail(ctx context.Context, email string) *AdminUser {

	conditions := &repositories.AdminUserConditions{
		Email: email,
		Paginate: &repositories.Paginate{
			Size: 1,
			Page: 1,
		},
	}

	return findOne(ctx, conditions)
}

// FindByID IDで1件取得
func FindByID(ctx context.Context, userID string) *AdminUser {

	conditions := &repositories.AdminUserConditions{
		ID: userID,
		Paginate: &repositories.Paginate{
			Size: 1,
			Page: 1,
		},
	}

	return findOne(ctx, conditions)
}

// ListAdminUser 一覧取得
func ListAdminUser(ctx context.Context, opts *AdminUserConditions) (*AdminUsersWithPager, error) {

	repo := container.GetAdminUserRepository()

	conditions := &repositories.AdminUserConditions{}
	if opts != nil {
		conditions.ID = opts.ID
		conditions.Email = opts.Email
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

	withPager := &AdminUsersWithPager{
		List: []*AdminUser{},
	}

	for _, result := range results {
		entity := &repositories.AdminUserEntity{}
		result.Bind(entity)
		entity.RoleIDs = listRoles(fmt.Sprintf("%s", entity.ID))
		adminuser := &AdminUser{
			ID:        entity.ID,
			Email:     entity.Email,
			Password:  entity.Password,
			Salt:      entity.Salt,
			AuthType:  entity.AuthType,
			RoleIDs:   entity.RoleIDs,
			CreatedAt: entity.CreatedAt,
			UpdatedAt: entity.UpdatedAt,
		}

		adminuser.RoleIDs = listRoles(adminuser.ID)

		withPager.List = append(withPager.List, adminuser)
	}
	count := CountAdminUser(ctx)
	pager := Paging(count, conditions.Size, conditions.Page)
	withPager.Pager = pager
	return withPager, nil
}

// UpdateAdminUserByID IDで1件更新
func UpdateAdminUserByID(ctx context.Context, id string, payload *AdminUser) *errors.VironError {
	user := FindByID(ctx, id)
	if user == nil {
		return errors.AdminUserNotfound
	}
	repo := container.GetAdminUserRepository()

	if user.AuthType == constant.AUTH_TYPE_EMAIL {
		if payload.Password != nil {
			pass := helpers.GenPassword(*payload.Password, *user.Salt)
			if pass == nil {
				return errors.Initialize(http.StatusInternalServerError, "password gen failed.")
			}

			entity := &repositories.AdminUserEntity{
				ID:       user.ID,
				Email:    user.Email,
				AuthType: user.AuthType,
				Password: &pass.Password,
			}
			if err := repo.UpdateByID(ctx, id, entity); err != nil {
				return errors.Initialize(http.StatusInternalServerError, fmt.Sprintf("adminUser update failed. %+v", err))
			}
		}
	} else {
		// TODO: google auth type update
	}

	log := logging.GetDefaultLogger()
	log.Debugf("roleIds %+v", payload.RoleIDs)

	if len(payload.RoleIDs) > 0 {
		updateRolesForUser(id, payload.RoleIDs)
	}
	return nil
}

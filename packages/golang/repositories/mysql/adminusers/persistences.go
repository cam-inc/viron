package adminusers

import (
	"context"
	"database/sql"
	"fmt"
	"strconv"
	"time"

	"github.com/volatiletech/sqlboiler/v4/queries/qm"

	"github.com/volatiletech/null/v8"

	"github.com/volatiletech/sqlboiler/v4/boil"

	models "github.com/cam-inc/viron/packages/golang/repositories/mysql/gen"

	"github.com/cam-inc/viron/packages/golang/repositories"
)

type adminUsersPersistence struct {
	conn *sql.DB
}

func (a *adminUsersPersistence) FindOne(ctx context.Context, id string) (repositories.Entity, error) {
	conditions := &repositories.AdminUserConditions{
		ID: id,
	}
	slice, err := a.Find(ctx, conditions)
	if err != nil {
		return nil, err
	}
	if len(slice) == 0 {
		return nil, nil
	}
	return slice[0], nil
}

func (a *adminUsersPersistence) Find(ctx context.Context, conditions repositories.Conditions) (repositories.EntitySlice, error) {

	mods := conditions.ConvertConditionMySQL()
	mods = append(mods, conditions.ConvertPager().PaginateMySQL()...)

	list := repositories.EntitySlice{}

	result, err := models.Adminusers(mods...).All(ctx, a.conn)
	if err != nil {
		return nil, err
	}

	for _, r := range result {
		id := fmt.Sprintf("%d", r.ID)
		adminuser := &repositories.AdminUser{
			ID:                       id,
			Email:                    r.Email,
			AuthType:                 r.AuthType,
			Password:                 r.Password.Ptr(),
			Salt:                     r.Salt.Ptr(),
			GoogleOAuth2TokenType:    r.GoogleOAuth2TokenType.Ptr(),
			GoogleOAuth2RefreshToken: r.GoogleOAuth2RefreshToken.Ptr(),
			GoogleOAuth2ExpiryDate:   r.GoogleOAuth2ExpiryDate.Ptr(),
			GoogleOAuth2AccessToken:  r.GoogleOAuth2AccessToken.Ptr(),
			GoogleOAuth2IdToken:      r.GoogleOAuth2IdToken.Ptr(),
			CreatedAt:                r.CreatedAt,
			UpdatedAt:                r.UpdatedAt,
		}
		list = append(list, adminuser)
	}

	return list, nil
}

func (a *adminUsersPersistence) Count(ctx context.Context, conditions repositories.Conditions) int {
	var mods []qm.QueryMod
	if conditions != nil {
		mods = conditions.ConvertConditionMySQL()
	}
	count, err := models.Adminusers(mods...).Count(ctx, a.conn)
	if err != nil {
		return 0
	}
	return int(count)

}

func (a *adminUsersPersistence) CreateOne(ctx context.Context, entity repositories.Entity) (repositories.Entity, error) {
	adminuser := &repositories.AdminUser{}
	if err := entity.Bind(adminuser); err != nil {
		return nil, err
	}
	model := &models.Adminuser{
		AuthType:                 adminuser.AuthType,
		Email:                    adminuser.Email,
		Password:                 null.StringFromPtr(adminuser.Password),
		Salt:                     null.StringFromPtr(adminuser.Salt),
		GoogleOAuth2AccessToken:  null.StringFromPtr(adminuser.GoogleOAuth2AccessToken),
		GoogleOAuth2IdToken:      null.StringFromPtr(adminuser.GoogleOAuth2IdToken),
		GoogleOAuth2RefreshToken: null.StringFromPtr(adminuser.GoogleOAuth2RefreshToken),
		GoogleOAuth2ExpiryDate:   null.IntFromPtr(adminuser.GoogleOAuth2ExpiryDate),
		GoogleOAuth2TokenType:    null.StringFromPtr(adminuser.GoogleOAuth2TokenType),
		CreatedAt:                time.Now(),
		UpdatedAt:                time.Now(),
	}
	if err := model.Insert(ctx, a.conn, boil.Infer()); err != nil {
		return nil, err
	}
	adminuser.ID = fmt.Sprintf("%d", model.ID)
	return adminuser, nil
}

func (a *adminUsersPersistence) UpdateByID(ctx context.Context, id string, entity repositories.Entity) error {
	up := &repositories.AdminUser{}
	if err := entity.Bind(up); err != nil {
		return err
	}

	iID, _ := strconv.ParseUint(id, 10, 0)

	adminUser := models.Adminuser{
		ID:        uint(iID),
		Email:     up.Email,
		AuthType:  up.AuthType,
		UpdatedAt: time.Now(),
	}

	columns := []string{models.AdminuserColumns.UpdatedAt}
	//boil.Whitelist()

	if up.Password != nil {
		adminUser.Password = null.NewString(*up.Password, true)
		columns = append(columns, models.AdminuserColumns.Password)
	}

	if up.Salt != nil {
		adminUser.Salt = null.NewString(*up.Salt, true)
		columns = append(columns, models.AdminuserColumns.Salt)
	}

	if up.GoogleOAuth2AccessToken != nil {
		adminUser.GoogleOAuth2AccessToken = null.NewString(*up.GoogleOAuth2AccessToken, true)
		columns = append(columns, models.AdminuserColumns.GoogleOAuth2AccessToken)
	}
	if up.GoogleOAuth2ExpiryDate != nil {
		adminUser.GoogleOAuth2ExpiryDate = null.NewInt(*up.GoogleOAuth2ExpiryDate, true)
		columns = append(columns, models.AdminuserColumns.GoogleOAuth2ExpiryDate)
	}
	if up.GoogleOAuth2RefreshToken != nil {
		adminUser.GoogleOAuth2RefreshToken = null.NewString(*up.GoogleOAuth2RefreshToken, true)
		columns = append(columns, models.AdminuserColumns.GoogleOAuth2RefreshToken)
	}
	if up.GoogleOAuth2TokenType != nil {
		adminUser.GoogleOAuth2TokenType = null.NewString(*up.GoogleOAuth2TokenType, true)
		columns = append(columns, models.AdminuserColumns.GoogleOAuth2TokenType)
	}

	_, err := adminUser.Update(ctx, a.conn, boil.Whitelist(columns...))
	return err
}

func (a *adminUsersPersistence) RemoveByID(ctx context.Context, id string) error {
	panic("implement me")
}

func New(db *sql.DB) repositories.Repository {
	return &adminUsersPersistence{
		conn: db,
	}
}

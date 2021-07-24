package adminusers

import (
	"context"
	"database/sql"
	"fmt"
	"strconv"

	"github.com/volatiletech/null/v8"

	"github.com/volatiletech/sqlboiler/v4/boil"

	models "github.com/viron/packages/golang/repositories/mysql/gen"

	"github.com/viron/packages/golang/repositories"
)

type adminUsersPersistence struct {
	conn *sql.DB
}

func (a *adminUsersPersistence) FindOne(ctx context.Context, id string) (repositories.Entity, error) {
	return &repositories.AdminUser{}, nil
}

func (a *adminUsersPersistence) Find(ctx context.Context, conditions repositories.Conditions) (repositories.EntitySlice, error) {
	//panic("implement me")

	where := conditions.ConvertConditionMySQL()

	list := repositories.EntitySlice{
		&repositories.AdminUser{},
	}
	fmt.Println(where)
	return list, nil
}

func (a *adminUsersPersistence) Count(ctx context.Context, conditions repositories.Conditions) int {
	panic("implement me")
}

func (a *adminUsersPersistence) CreateOne(ctx context.Context, entity repositories.Entity) error {
	panic("implement me")
}

func (a *adminUsersPersistence) UpdateByID(ctx context.Context, id string, entity repositories.Entity) error {
	up := &repositories.AdminUser{}
	if err := entity.Bind(up); err != nil {
		return err
	}

	iID, _ := strconv.ParseUint(id, 10, 0)

	adminUser := models.Adminuser{
		ID:       uint(iID),
		Email:    up.Email,
		AuthType: up.AuthType,
	}

	if up.Password != nil {
		adminUser.Password = null.NewString(*up.Password, true)
	}

	if up.Salt != nil {
		adminUser.Salt = null.NewString(*up.Salt, true)
	}

	if up.GoogleOAuth2AccessToken != nil {
		adminUser.GoogleOAuth2AccessToken = null.NewString(*up.GoogleOAuth2AccessToken, true)
	}
	if up.GoogleOAuth2ExpiryDate != nil {
		adminUser.GoogleOAuth2ExpiryDate = null.NewInt(*up.GoogleOAuth2ExpiryDate, true)
	}
	if up.GoogleOAuth2RefreshToken != nil {
		adminUser.GoogleOAuth2RefreshToken = null.NewString(*up.GoogleOAuth2RefreshToken, true)
	}
	if up.GoogleOAuth2TokenType != nil {
		adminUser.GoogleOAuth2TokenType = null.NewString(*up.GoogleOAuth2TokenType, true)
	}

	_, err := adminUser.Update(ctx, a.conn, boil.Infer())
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

package adminuserssotokens

import (
	"context"
	"database/sql"
	"strconv"
	"time"

	"github.com/volatiletech/sqlboiler/v4/queries/qm"

	"github.com/volatiletech/null/v8"

	"github.com/volatiletech/sqlboiler/v4/boil"

	models "github.com/cam-inc/viron/packages/golang/repositories/mysql/gen"

	"github.com/cam-inc/viron/packages/golang/repositories"
)

type adminUserSSOTokensPersistence struct {
	conn *sql.DB
}

func (a *adminUserSSOTokensPersistence) FindOne(ctx context.Context, id string) (repositories.Entity, error) {
	conditions := &repositories.AdminUserSSOTokenConditions{
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

func (a *adminUserSSOTokensPersistence) Find(ctx context.Context, conditions repositories.Conditions) (repositories.EntitySlice, error) {

	mods := conditions.ConvertConditionMySQL()
	mods = append(mods, conditions.ConvertPager().PaginateMySQL()...)

	list := repositories.EntitySlice{}

	result, err := models.Adminuserssotokens(mods...).All(ctx, a.conn)
	if err != nil {
		return nil, err
	}

	for _, r := range result {
		adminuser := &repositories.AdminUserSSOTokenEntity{
			ID:           strconv.FormatUint(uint64(r.ID), 10),
			AuthType:     r.AuthType,
			TokenType:    r.TokenType,
			RefreshToken: r.RefreshToken.Ptr(),
			ExpiryDate:   r.ExpiryDate,
			AccessToken:  r.AccessToken,
			IdToken:      r.IdToken,
			CreatedAt:    r.CreatedAt,
			UpdatedAt:    r.UpdatedAt,
		}
		list = append(list, adminuser)
	}

	return list, nil
}

func (a *adminUserSSOTokensPersistence) Count(ctx context.Context, conditions repositories.Conditions) int {
	var mods []qm.QueryMod
	if conditions != nil {
		mods = conditions.ConvertConditionMySQL()
	}
	count, err := models.Adminuserssotokens(mods...).Count(ctx, a.conn)
	if err != nil {
		return 0
	}
	return int(count)

}

func (a *adminUserSSOTokensPersistence) CreateOne(ctx context.Context, entity repositories.Entity) (repositories.Entity, error) {
	adminuserssotoken := &repositories.AdminUserSSOTokenEntity{}
	if err := entity.Bind(adminuserssotoken); err != nil {
		return nil, err
	}
	model := &models.Adminuserssotoken{
		AuthType:     adminuserssotoken.AuthType,
		AccessToken:  adminuserssotoken.AccessToken,
		IdToken:      adminuserssotoken.IdToken,
		ExpiryDate:   adminuserssotoken.ExpiryDate,
		TokenType:    adminuserssotoken.TokenType,
		RefreshToken: null.StringFromPtr(adminuserssotoken.RefreshToken),
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
	if err := model.Insert(ctx, a.conn, boil.Infer()); err != nil {
		return nil, err
	}
	adminuserssotoken.ID = strconv.FormatUint(uint64(model.ID), 10)
	return adminuserssotoken, nil
}

func (a *adminUserSSOTokensPersistence) UpdateByID(ctx context.Context, id string, entity repositories.Entity) error {
	up := &repositories.AdminUserSSOTokenEntity{}
	if err := entity.Bind(up); err != nil {
		return err
	}

	iID, _ := strconv.ParseUint(id, 10, 0)

	model := models.Adminuserssotoken{
		ID:           uint(iID),
		UserId:       up.UserID,
		ClientId:     up.ClientID,
		Provider:     up.Provider,
		AuthType:     up.AuthType,
		AccessToken:  up.AccessToken,
		IdToken:      up.IdToken,
		ExpiryDate:   up.ExpiryDate,
		TokenType:    up.TokenType,
		RefreshToken: null.StringFromPtr(up.RefreshToken),
		UpdatedAt:    time.Now(),
	}

	columns := []string{models.AdminuserColumns.UpdatedAt}

	_, err := model.Update(ctx, a.conn, boil.Whitelist(columns...))
	return err
}

func (a *adminUserSSOTokensPersistence) RemoveByID(ctx context.Context, id string) error {
	unit64Id, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return err
	}

	m, err := models.FindAdminuserssotoken(ctx, a.conn, uint(unit64Id))
	if err != nil {
		return err
	}

	// 削除
	_, err = m.Delete(ctx, a.conn)
	if err != nil {
		return err
	}
	return nil
}

func New(db *sql.DB) repositories.Repository {
	return &adminUserSSOTokensPersistence{
		conn: db,
	}
}

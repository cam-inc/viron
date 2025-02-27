package adminusers

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
		adminuser := &repositories.AdminUserEntity{
			ID:        strconv.FormatUint(uint64(r.ID), 10),
			Email:     r.Email,
			Password:  r.Password.Ptr(),
			Salt:      r.Salt.Ptr(),
			CreatedAt: r.CreatedAt,
			UpdatedAt: r.UpdatedAt,
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
	adminuser := &repositories.AdminUserEntity{}
	if err := entity.Bind(adminuser); err != nil {
		return nil, err
	}
	model := &models.Adminuser{
		Email:     adminuser.Email,
		Password:  null.StringFromPtr(adminuser.Password),
		Salt:      null.StringFromPtr(adminuser.Salt),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	if err := model.Insert(ctx, a.conn, boil.Infer()); err != nil {
		return nil, err
	}
	adminuser.ID = strconv.FormatUint(uint64(model.ID), 10)
	return adminuser, nil
}

func (a *adminUsersPersistence) UpdateByID(ctx context.Context, id string, entity repositories.Entity) error {
	up := &repositories.AdminUserEntity{}
	if err := entity.Bind(up); err != nil {
		return err
	}

	iID, _ := strconv.ParseUint(id, 10, 0)

	adminUser := models.Adminuser{
		ID:        uint(iID),
		Email:     up.Email,
		UpdatedAt: time.Now(),
	}

	columns := []string{models.AdminuserColumns.UpdatedAt}

	if up.Password != nil {
		adminUser.Password = null.NewString(*up.Password, true)
		columns = append(columns, models.AdminuserColumns.Password)
	}

	if up.Salt != nil {
		adminUser.Salt = null.NewString(*up.Salt, true)
		columns = append(columns, models.AdminuserColumns.Salt)
	}

	_, err := adminUser.Update(ctx, a.conn, boil.Whitelist(columns...))
	return err
}

func (a *adminUsersPersistence) RemoveByID(ctx context.Context, id string) error {
	unit64Id, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return err
	}

	m, err := models.FindAdminuser(ctx, a.conn, uint(unit64Id))
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
	return &adminUsersPersistence{
		conn: db,
	}
}

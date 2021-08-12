package adminusers

import (
	"context"
	"database/sql"
	"strconv"
	"time"

	"github.com/cam-inc/viron/packages/golang/repositories/mysql"

	"github.com/volatiletech/sqlboiler/v4/queries/qm"

	"github.com/volatiletech/null/v8"

	"github.com/volatiletech/sqlboiler/v4/boil"

	models "github.com/cam-inc/viron/packages/golang/repositories/mysql/gen"

	"github.com/cam-inc/viron/packages/golang/repositories"
)

type adminUsersPersistence struct {
	conn *sql.DB
}

type AdminUserConditions struct {
	ID        uint
	Email     string
	Size      int
	Page      int
	Sort      []string
	LikeEmail string
	IDs       []uint
	Emails    []string
}

func (c *AdminUserConditions) ConvertConditionMySQL() []qm.QueryMod {

	conditions := []qm.QueryMod{}
	if c.ID != 0 {
		conditions = append(conditions, qm.Where("id = ?", c.ID))
	}
	if c.Email != "" {
		conditions = append(conditions, qm.Where("email = ?", c.Email))
	}
	if c.LikeEmail != "" {
		conditions = append(conditions, qm.Where("email like ?", c.LikeEmail))
	}
	if len(c.IDs) != 0 {
		ids := []interface{}{}
		for i := range c.IDs {
			ids = append(ids, i)
		}
		conditions = append(conditions, qm.WhereIn("id in ?", ids...))
	}
	if len(c.Emails) != 0 {
		emails := []interface{}{}
		for e := range c.Emails {
			emails = append(emails, e)
		}
		conditions = append(conditions, qm.WhereIn("email in ?", emails...))
	}

	if len(c.Sort) > 0 {
		conditions = append(conditions, mysql.GetOrderBy(c.Sort))
	}

	pager := mysql.GetPager(c.Size, c.Page)

	conditions = append(conditions, qm.Limit(pager.Limit))
	conditions = append(conditions, qm.Offset(pager.Offset))

	return conditions
}

func (a *adminUsersPersistence) FindOne(ctx context.Context, id string) (repositories.Entity, error) {
	return &repositories.AdminUser{}, nil
}

func (a *adminUsersPersistence) Find(ctx context.Context, conditions repositories.Conditions) (repositories.EntitySlice, error) {

	mods := conditions.ConvertConditionMySQL()

	list := repositories.EntitySlice{}

	result, err := models.Adminusers(mods...).All(ctx, a.conn)
	if err != nil {
		return nil, err
	}

	for _, r := range result {
		adminuser := &repositories.AdminUser{
			ID:                       r.ID,
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
	adminuser.ID = model.ID
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

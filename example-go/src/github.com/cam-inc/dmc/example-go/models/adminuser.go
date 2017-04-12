package models

import (
	"time"

	genModels "github.com/cam-inc/dmc/example-go/gen/models"
	"github.com/goadesign/goa"
	"github.com/jinzhu/gorm"
	"golang.org/x/net/context"
)

func NewAdminUser() genModels.AdminUser {
	return genModels.AdminUser{}
}

func NewAdminUserDB(db *gorm.DB) *AdminUserDB {
	m := &AdminUserDB{}
	m.Db = db
	return m
}

type AdminUserDB struct {
	genModels.AdminUserDB
}

func (m *AdminUserDB) GetByLoginID(ctx context.Context, login_id string) (*genModels.AdminUser, error) {
	defer goa.MeasureSince([]string{"goa", "db", "adminUser", "get"}, time.Now())

	var native genModels.AdminUser
	err := m.Db.Table(m.TableName()).Where("login_id = ?", login_id).Find(&native).Error
	if err == gorm.ErrRecordNotFound {
		return nil, err
	}

	return &native, err
}

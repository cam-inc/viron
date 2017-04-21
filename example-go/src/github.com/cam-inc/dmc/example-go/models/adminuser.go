package models

import (
	"time"

	genModels "github.com/cam-inc/dmc/example-go/gen/models"
	"github.com/goadesign/goa"
	"github.com/jinzhu/gorm"
	"golang.org/x/net/context"
)

// NewAdminUser creates a new admin_user storage
func NewAdminUser() genModels.AdminUser {
	return genModels.AdminUser{}
}

// NewAdminUserDB creates a new admin_user model
func NewAdminUserDB(db *gorm.DB) *AdminUserDB {
	m := &AdminUserDB{}
	m.Db = db
	return m
}

// AdminUserDB is the implementation of the storage interface for AdminUser.
type AdminUserDB struct {
	genModels.AdminUserDB
}

// GetByLoginID returns a single AdminUser as a Database Model
func (m *AdminUserDB) GetByLoginID(ctx context.Context, loginID string) (*genModels.AdminUser, error) {
	defer goa.MeasureSince([]string{"goa", "db", "adminUser", "get"}, time.Now())

	var native genModels.AdminUser
	err := m.Db.Table(m.TableName()).Where("login_id = ?", loginID).Find(&native).Error
	if err == gorm.ErrRecordNotFound {
		return nil, err
	}

	return &native, err
}

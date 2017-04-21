package models

import (
	"time"

	genModels "github.com/cam-inc/dmc/example-go/gen/models"
	"github.com/goadesign/goa"
	"github.com/jinzhu/gorm"
	"golang.org/x/net/context"
)

// NewAdminRole creates a new admin_role storage
func NewAdminRole() genModels.AdminRole {
	return genModels.AdminRole{}
}

// NewAdminRoleDB creates a new admin_role model
func NewAdminRoleDB(db *gorm.DB) *AdminRoleDB {
	m := &AdminRoleDB{}
	m.Db = db
	return m
}

// AdminRoleDB is the implementation of the storage interface for AdminRole.
type AdminRoleDB struct {
	genModels.AdminRoleDB
}

// ListByRoleID returns an array of AdminRole
func (m *AdminRoleDB) ListByRoleID(ctx context.Context, roleID string) ([]*genModels.AdminRole, error) {
	defer goa.MeasureSince([]string{"goa", "db", "adminRole", "list"}, time.Now())

	var objs []*genModels.AdminRole
	err := m.Db.Table(m.TableName()).Where("role_id = ?", roleID).Find(&objs).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	return objs, nil
}

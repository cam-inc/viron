package models

import (
	"time"

	genModels "github.com/cam-inc/dmc/example-go/gen/models"
	"github.com/goadesign/goa"
	"github.com/jinzhu/gorm"
	"golang.org/x/net/context"
)

func NewAdminRole() genModels.AdminRole {
	return genModels.AdminRole{}
}

func NewAdminRoleDB(db *gorm.DB) *AdminRoleDB {
	m := &AdminRoleDB{}
	m.Db = db
	return m
}

type AdminRoleDB struct {
	genModels.AdminRoleDB
}

func (m *AdminRoleDB) ListByRoleID(ctx context.Context, role_id string) ([]*genModels.AdminRole, error) {
	defer goa.MeasureSince([]string{"goa", "db", "adminRole", "list"}, time.Now())

	var objs []*genModels.AdminRole
	err := m.Db.Table(m.TableName()).Where("role_id = ?", role_id).Find(&objs).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	return objs, nil
}

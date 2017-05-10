package models

import (
	"time"

	"context"

	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	genModels "github.com/cam-inc/dmc/example-go/gen/models"
	"github.com/goadesign/goa"
	"github.com/jinzhu/gorm"
	"go.uber.org/zap"
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
	logger := common.GetLogger("default")
	defer goa.MeasureSince([]string{"goa", "db", "adminRole", "listByRoleID"}, time.Now())

	var objs []*genModels.AdminRole
	err := m.Db.Table(m.TableName()).Where("role_id = ?", roleID).Find(&objs).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		logger.Error("error delete AdminRole", zap.Error(err))
		return nil, err
	}

	return objs, nil
}

// DeleteByRoleID removes record.
func (m *AdminRoleDB) DeleteByRoleID(ctx context.Context, roleID string) error {
	logger := common.GetLogger("default")
	defer goa.MeasureSince([]string{"goa", "db", "adminRole", "deleteByRoleID"}, time.Now())

	if err := m.Db.Table(m.TableName()).Where("role_id = ?", roleID).Delete(app.AdminRole{}).Error; err != nil {
		logger.Error("error adminRole.DeleteByRoleID", zap.Error(err))
		return err
	}
	return nil
}

// ListPage returns an array of AdminRole
func (m *AdminRoleDB) ListPage(ctx context.Context, limit int, offset int) []*genModels.AdminRole {
	logger := common.GetLogger("default")
	defer goa.MeasureSince([]string{"goa", "db", "adminRole", "listPage"}, time.Now())

	var native []*genModels.AdminRole
	if err := m.Db.Table(m.TableName()).Order("id ASC").Limit(limit).Offset(offset).Find(&native).Error; err != nil {
		logger.Error("error adminRole.ListPage", zap.Error(err))
	}

	return native
}

// CountRoleID return a number of RoldID
func (m *AdminRoleDB) CountRoleID(ctx context.Context) int {
	logger := common.GetLogger("default")
	defer goa.MeasureSince([]string{"goa", "db", "adminRole", "countByRoleID"}, time.Now())

	var native []interface{}
	if err := m.Db.Table(m.TableName()).Select("role_id").Group("role_id").Find(&native).Error; err != nil {
		logger.Error("error adminRole.Count", zap.Error(err))
		return 0
	}
	return len(native)
}

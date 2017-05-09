package models

import (
	"context"
	"time"

	"github.com/cam-inc/dmc/example-go/gen/app"
	genModels "github.com/cam-inc/dmc/example-go/gen/models"
	"github.com/goadesign/goa"
	"github.com/jinzhu/gorm"
	"github.com/cam-inc/dmc/example-go/common"
	"go.uber.org/zap"
)

// NewAuditLog creates a new admin_user storage
func NewAuditLog() genModels.AuditLog {
	return genModels.AuditLog{}
}

// NewAuditLogDB creates a new admin_user model
func NewAuditLogDB(db *gorm.DB) *AuditLogDB {
	m := &AuditLogDB{}
	m.Db = db
	return m
}

// AuditLogDB is the implementation of the storage interface for AuditLog.
type AuditLogDB struct {
	genModels.AuditLogDB
}

// Count return a number of AuditLog
func (m *AuditLogDB) Count(ctx context.Context) uint64 {
	logger := common.GetLogger("default")
	defer goa.MeasureSince([]string{"goa", "db", "auditLog", "count"}, time.Now())

	var count *uint64
	err := m.Db.Table(m.TableName()).Count(&count).Error

	if err != nil {
		logger.Error("err auditLog.Count", zap.Error(err))
		return 0
	}
	return *count
}

// ListPage returns an array of AuditLog
func (m *AuditLogDB) ListPage(ctx context.Context, limit int, offset int) []*app.AuditLog {
	logger := common.GetLogger("default")
	defer goa.MeasureSince([]string{"goa", "db", "auditLog", "listpage"}, time.Now())

	var native []*genModels.AuditLog
	var objs []*app.AuditLog
	err := m.Db.Table(m.TableName()).Order("created_at DESC").Limit(limit).Offset(offset).Find(&native).Error

	if err != nil {
		logger.Error("error auditlog.ListPage", zap.Error(err))
		return objs
	}

	for _, t := range native {
		objs = append(objs, t.AuditLogToAuditLog())
	}

	return objs
}

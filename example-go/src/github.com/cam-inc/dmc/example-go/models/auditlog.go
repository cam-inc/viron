package models

import (
	genModels "github.com/cam-inc/dmc/example-go/gen/models"
	"github.com/jinzhu/gorm"
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

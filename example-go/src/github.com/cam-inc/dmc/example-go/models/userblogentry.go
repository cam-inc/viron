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

// NewUserBlogEntry creates a new admin_user storage
func NewUserBlogEntry() genModels.UserBlogEntry {
	return genModels.UserBlogEntry{}
}

// NewUserBlogEntryDB creates a new admin_user model
func NewUserBlogEntryDB(db *gorm.DB) *UserBlogEntryDB {
	m := &UserBlogEntryDB{}
	m.Db = db
	return m
}

// UserBlogEntryDB is the implementation of the storage interface for UserBlogEntry.
type UserBlogEntryDB struct {
	genModels.UserBlogEntryDB
}

// Count return a number of UserBlogEntry
func (m *UserBlogEntryDB) Count(ctx context.Context) uint64 {
	logger := common.GetLogger("default")
	defer goa.MeasureSince([]string{"goa", "db", "userBlogEntry", "count"}, time.Now())

	var count *uint64
	err := m.Db.Table(m.TableName()).Count(&count).Error

	if err != nil {
		logger.Error("error Count", zap.Error(err))
		return 0
	}
	return *count
}

// ListPage returns an array of view: default.
func (m *UserBlogEntryDB) ListPage(ctx context.Context, limit int, offset int) []*app.UserBlogEntry {
	logger := common.GetLogger("default")
	defer goa.MeasureSince([]string{"goa", "db", "userBlogEntry", "listPage"}, time.Now())

	var native []*genModels.UserBlogEntry
	var objs []*app.UserBlogEntry
	err := m.Db.Table(m.TableName()).Order("id ASC").Limit(limit).Offset(offset).Find(&native).Error

	if err != nil {
		logger.Error("error ListPage", zap.Error(err))
		return objs
	}

	for _, t := range native {
		objs = append(objs, t.UserBlogEntryToUserBlogEntry())
	}

	return objs
}

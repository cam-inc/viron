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

// NewUserBlog creates a new admin_user storage
func NewUserBlog() genModels.UserBlog {
	return genModels.UserBlog{}
}

// NewUserBlogDB creates a new admin_user model
func NewUserBlogDB(db *gorm.DB) *UserBlogDB {
	m := &UserBlogDB{}
	m.Db = db
	return m
}

// UserBlogDB is the implementation of the storage interface for UserBlog.
type UserBlogDB struct {
	genModels.UserBlogDB
}

// Count return a number of UserBlog
func (m *UserBlogDB) Count(ctx context.Context) uint64 {
	logger := common.GetLogger("default")
	defer goa.MeasureSince([]string{"goa", "db", "userBlog", "count"}, time.Now())

	var count *uint64
	err := m.Db.Table(m.TableName()).Count(&count).Error

	if err != nil {
		logger.Error("error Count", zap.Error(err))
		return 0
	}
	return *count
}

// ListPage returns an array of view: default.
func (m *UserBlogDB) ListPage(ctx context.Context, limit int, offset int) []*app.UserBlog {
	logger := common.GetLogger("default")
	defer goa.MeasureSince([]string{"goa", "db", "userBlog", "listPage"}, time.Now())

	var native []*genModels.UserBlog
	var objs []*app.UserBlog
	err := m.Db.Table(m.TableName()).Order("id ASC").Limit(limit).Offset(offset).Find(&native).Error

	if err != nil {
		logger.Error("error ListPage", zap.Error(err))
		return objs
	}

	for _, t := range native {
		objs = append(objs, t.UserBlogToUserBlog())
	}

	return objs
}

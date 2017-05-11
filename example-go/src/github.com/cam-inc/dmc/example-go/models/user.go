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

// NewUser creates a new admin_user storage
func NewUser() genModels.User {
	return genModels.User{}
}

// NewUserDB creates a new admin_user model
func NewUserDB(db *gorm.DB) *UserDB {
	m := &UserDB{}
	m.Db = db
	return m
}

// UserDB is the implementation of the storage interface for User.
type UserDB struct {
	genModels.UserDB
}

// ListUser returns an array of view: default.
func (m *UserDB) ListUser(ctx context.Context, params map[string][]string) []*app.User {
	logger := common.GetLogger("default")
	defer goa.MeasureSince([]string{"goa", "db", "user", "listuser"}, time.Now())

	var native []*genModels.User
	var objs []*app.User

	db := m.Db.Scopes().Table(m.TableName())
	if len(params["name"]) > 0 && params["name"][0] != "" {
		db = db.Where("name LIKE ?", params["name"][0]+"%")
	}
	err := db.Find(&native).Error

	if err != nil {
		logger.Error("error ListUser", zap.Error(err))
		return objs
	}

	for _, t := range native {
		objs = append(objs, t.UserToUser())
	}

	return objs
}

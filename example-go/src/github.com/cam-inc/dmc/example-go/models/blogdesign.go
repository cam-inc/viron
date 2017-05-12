package models

import (
	"context"
	"time"

	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/goadesign/goa"
	"github.com/jinzhu/gorm"
	"go.uber.org/zap"
)

// This is the bglo_design model
type BlogDesign struct {
	ID              string `gorm:"primary_key"`
	Name            string
	BaseColor       string
	BackgroundImage string
	CreatedAt       time.Time // timestamp
	UpdatedAt       time.Time
	DeletedAt       *time.Time
}

// TableName is the table name in the database
func (m *BlogDesign) TableName() string {
	return "blog_design"
}

// BlogDesignToBlogDesign loads a BlogDesign and builds the default view of media type Blog_design.
func (m *BlogDesign) BlogDesignToBlogDesign() *app.BlogDesign {
	blogdesign := &app.BlogDesign{}
	blogdesign.CreatedAt = &m.CreatedAt
	blogdesign.UpdatedAt = &m.UpdatedAt
	blogdesign.ID = &m.ID
	blogdesign.Name = &m.Name
	blogdesign.BaseColor = &m.BaseColor
	blogdesign.BackgroundImage = &m.BackgroundImage

	return blogdesign
}

// BlogDesignDB is the implementation of the storage interface for BlogDesign.
type BlogDesignDB struct {
	Db *gorm.DB
}

// NewBlogDesignDB creates a new storage type.
func NewBlogDesignDB(db *gorm.DB) *BlogDesignDB {
	return &BlogDesignDB{Db: db}
}

// DB returns the underlying database.
func (m *BlogDesignDB) DB() interface{} {
	return m.Db
}

// BlogDesignStorage represents the storage interface.
type BlogDesignStorage interface {
	DB() interface{}
	List(ctx context.Context) ([]*BlogDesign, error)
	Get(ctx context.Context) (*BlogDesign, error)
	Add(ctx context.Context, design *BlogDesign) error
	Update(ctx context.Context, design *BlogDesign) error
	Delete(ctx context.Context) error
}

// TableName is the table name in the database
func (m *BlogDesignDB) TableName() string {
	return "blog_design"
}

// CRUD Functions

// Get returns a single BlogDesign as a Database Model
// This is more for use internally, and probably not what you want in  your controllers
func (m *BlogDesignDB) Get(ctx context.Context, id string) (*BlogDesign, error) {
	defer goa.MeasureSince([]string{"goa", "db", "blogdesign", "get"}, time.Now())

	var native BlogDesign
	err := m.Db.Table(m.TableName()).Where("id = ?", id).Find(&native).Error
	if err == gorm.ErrRecordNotFound {
		return nil, err
	}

	return &native, err
}

// List returns an array of BlogDesign
func (m *BlogDesignDB) List(ctx context.Context) ([]*BlogDesign, error) {
	defer goa.MeasureSince([]string{"goa", "db", "blogdesign", "list"}, time.Now())

	var objs []*BlogDesign
	err := m.Db.Table(m.TableName()).Find(&objs).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	return objs, nil
}

// Add creates a new record.
func (m *BlogDesignDB) Add(ctx context.Context, model *BlogDesign) error {
	logger := common.GetLogger("default")
	defer goa.MeasureSince([]string{"goa", "db", "blogdesign", "add"}, time.Now())

	err := m.Db.Create(model).Error
	if err != nil {
		logger.Error("error adding BlogDesign", zap.Error(err))
		return err
	}

	return nil
}

// Update modifies a single record.
func (m *BlogDesignDB) Update(ctx context.Context, model *BlogDesign) error {
	logger := common.GetLogger("default")
	defer goa.MeasureSince([]string{"goa", "db", "blogdesign", "update"}, time.Now())

	obj, err := m.Get(ctx, model.ID)
	if err != nil {
		logger.Error("error updating BlogDesign", zap.Error(err))
		return err
	}
	err = m.Db.Model(obj).Updates(model).Error

	return err
}

// Delete removes a single record.
func (m *BlogDesignDB) Delete(ctx context.Context, id string) error {
	logger := common.GetLogger("default")
	defer goa.MeasureSince([]string{"goa", "db", "blogdesign", "delete"}, time.Now())

	var obj BlogDesign
	err := m.Db.Delete(&obj, id).Error

	if err != nil {
		logger.Error("error deleting BlogDesign", zap.Error(err))
		return err
	}

	return nil
}

// Count return a number of BlogDesign
func (m *BlogDesignDB) Count(ctx context.Context) uint64 {
	logger := common.GetLogger("default")
	defer goa.MeasureSince([]string{"goa", "db", "blogdesign", "count"}, time.Now())

	var count *uint64
	err := m.Db.Table(m.TableName()).Count(&count).Error

	if err != nil {
		logger.Error("error counting BlogDesign", zap.Error(err))
		return 0
	}
	return *count
}

// ListPage returns an array of BlogDesign
func (m *BlogDesignDB) ListPage(ctx context.Context, limit int, offset int) []*app.BlogDesign {
	logger := common.GetLogger("default")
	defer goa.MeasureSince([]string{"goa", "db", "blogdesign", "listpage"}, time.Now())

	var native []*BlogDesign
	var objs []*app.BlogDesign
	err := m.Db.Table(m.TableName()).Order("created_at DESC").Limit(limit).Offset(offset).Find(&native).Error

	if err != nil {
		logger.Error("error listPage BlogDesign", zap.Error(err))
		return objs
	}

	for _, t := range native {
		objs = append(objs, t.BlogDesignToBlogDesign())
	}

	return objs
}

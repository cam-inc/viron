package models

import (
	"fmt"
	"os"

	"github.com/cam-inc/dmc/example-go/common"
	genModels "github.com/cam-inc/dmc/example-go/gen/models"
	"github.com/jinzhu/gorm"
	// mysql driver
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

// DB is mysql connection
var DB *gorm.DB

func getConnectionString() string {
	service := os.Getenv("SERVICE_ENV")
	c := common.GetMySQLConfig()
	if service == "docker-local" {
		// on docker
		return fmt.Sprintf("%s:%s@%s([%s]:%d)/%s?parseTime=true",
			c.UserName, c.Password, "tcp", "mysql", c.Port, c.DatabaseName)
	}

	return fmt.Sprintf("%s:%s@%s(%s:%d)/%s?parseTime=true",
		c.UserName, c.Password, "tcp", c.Host, c.Port, c.DatabaseName)
}

// InitDB initialize db connection
func InitDB() {
	var err error
	connectionString := getConnectionString()
	DB, err = gorm.Open("mysql", connectionString)
	if err != nil {
		panic(err)
	}
	DB.LogMode(true)
	DB.AutoMigrate(&genModels.User{})
	DB.AutoMigrate(&genModels.UserBlog{}).AddForeignKey("user_id", "users(id)", "RESTRICT", "RESTRICT")
	DB.AutoMigrate(&genModels.UserBlogEntry{}).AddForeignKey("user_blog_id", "user_blogs(id)", "RESTRICT", "RESTRICT")
	DB.AutoMigrate(&genModels.AdminUser{})
	DB.AutoMigrate(&genModels.AdminRole{})
	DB.AutoMigrate(&genModels.AuditLog{})
	DB.AutoMigrate(&BlogDesign{})
}

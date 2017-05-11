package common

import (
	"fmt"
	"github.com/cam-inc/dmc/example-go/gen/models"
	"github.com/jinzhu/gorm"
	// mysql driver
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"os"
)

// DB is mysql connection
var DB *gorm.DB

func getConnectionString() string {
	service := os.Getenv("SERVICE_ENV")
	c := GetMySQLConfig()
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
	DB.AutoMigrate(&models.User{})
	DB.AutoMigrate(&models.UserBlog{}).AddForeignKey("user_id", "users(id)", "RESTRICT", "RESTRICT")
	DB.AutoMigrate(&models.UserBlogEntry{}).AddForeignKey("user_blog_id", "user_blogs(id)", "RESTRICT", "RESTRICT")
	DB.AutoMigrate(&models.AdminUser{})
	DB.AutoMigrate(&models.AdminRole{})
	DB.AutoMigrate(&models.AuditLog{})
}

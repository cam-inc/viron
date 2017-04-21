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
	if service == "docker-local" {
		// on docker
		return fmt.Sprintf("%s:%s@%s([%s]:%s)/%s?parseTime=true",
			"user", "password", "tcp", "mysql", "3306", "dmc_local")
	}

	return fmt.Sprintf("%s:%s@%s(%s:%s)/%s?parseTime=true",
		"user", "password", "tcp", "localhost", "3306", "dmc_local")
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
	DB.AutoMigrate(&models.AdminUser{})
	DB.AutoMigrate(&models.AdminRole{})
}

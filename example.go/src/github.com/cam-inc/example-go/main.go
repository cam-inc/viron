//go:generate goagen bootstrap -d github.com/cam-inc/example-go/design

package main

import (
	"fmt"

	"github.com/cam-inc/example-go/app"
	"github.com/cam-inc/example-go/models"
	"github.com/goadesign/goa"
	"github.com/goadesign/goa/middleware"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

var db *gorm.DB

func getConnectionString() string {
	return fmt.Sprintf("%s:%s@%s([%s]:%s)/%s?parseTime=true",
		"user", "pass", "tcp", "localhost", "3306", "dmc_local")
}

//func GetTable(name string) {
//	var funcName = fmt.Sprintf("New%sDB", strings.Title(name))
//	log.Printf("%s", funcName)
//
//	return models[funcName](db)
//}

func initDb() {
	var err error
	connectionString := getConnectionString()
	db, err = gorm.Open("mysql", connectionString)
	if err != nil {
		panic(err)
	}
	db.LogMode(true)
	db.AutoMigrate(&models.User{})
}

func main() {
	// db connection
	initDb()

	// Create service
	service := goa.New("example-go")

	// Mount middleware
	service.Use(middleware.RequestID())
	service.Use(middleware.LogRequest(true))
	service.Use(middleware.ErrorHandler(service, true))
	service.Use(middleware.Recover())
	service.Use(middleware.LogResponse())

	// Moung "dmc" controller
	c := NewDmcController(service)
	app.MountDmcController(service, c)
	// Mount "swagger" controller
	c1 := NewSwaggerController(service)
	app.MountSwaggerController(service, c1)
	// Mount "overview" controller
	c2 := NewOverviewController(service)
	app.MountOverviewController(service, c2)
	// Mount "user" controller
	c3 := NewUserController(service)
	app.MountUserController(service, c3)

	// Start service
	if err := service.ListenAndServe(":3000"); err != nil {
		service.LogError("startup", "err", err)
	}
}

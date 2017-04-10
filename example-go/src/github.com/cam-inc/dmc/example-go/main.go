//go:generate goagen bootstrap -d github.com/cam-inc/dmc/example-go/design

package main

import (
	"github.com/cam-inc/dmc/example-go/controller"
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/goadesign/goa"
	"github.com/goadesign/goa/middleware"
)

func main() {
	// Create service
	service := goa.New("example-go")

	// Mount middleware
	service.Use(middleware.RequestID())
	service.Use(middleware.LogRequest(true))
	service.Use(middleware.ErrorHandler(service, true))
	service.Use(middleware.Recover())

	// Mount "dmc" controller
	c := controller.NewDmcController(service)
	app.MountDmcController(service, c)
	// Mount "overview" controller
	c2 := controller.NewOverviewController(service)
	app.MountOverviewController(service, c2)
	// Mount "swagger" controller
	c3 := controller.NewSwaggerController(service)
	app.MountSwaggerController(service, c3)
	// Mount "user" controller
	c4 := controller.NewUserController(service)
	app.MountUserController(service, c4)

	// Start service
	if err := service.ListenAndServe(":3000"); err != nil {
		service.LogError("startup", "err", err)
	}
}

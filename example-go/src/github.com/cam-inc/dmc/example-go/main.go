package main

import (
	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/controller"
	"github.com/cam-inc/dmc/example-go/gen/app"
	dmcMiddleware "github.com/cam-inc/dmc/example-go/middleware"
	"github.com/goadesign/goa"
	"github.com/goadesign/goa/middleware"
)

func main() {
	// db connection
	common.InitDB()

	// Create service
	service := goa.New("example-go")

	// Mount middleware
	service.Use(middleware.RequestID())
	service.Use(middleware.LogRequest(true))
	service.Use(middleware.ErrorHandler(service, true))
	service.Use(middleware.Recover())
	app.UseJWTMiddleware(service, dmcMiddleware.JWT())
	service.Use(dmcMiddleware.SetHeader())
	service.Use(dmcMiddleware.AuditLog())

	// Mount "dmc" controller
	c := controller.NewDmcController(service)
	app.MountDmcController(service, c)
	// Mount "swagger" controller
	c3 := controller.NewSwaggerController(service)
	app.MountSwaggerController(service, c3)
	// Mount "user" controller
	c4 := controller.NewUserController(service)
	app.MountUserController(service, c4)
	// Mount "admin_user" controller
	c5 := controller.NewAdminUserController(service)
	app.MountAdminUserController(service, c5)
	// Mount "admin_role" controller
	c6 := controller.NewAdminRoleController(service)
	app.MountAdminRoleController(service, c6)
	// Mount "auth" controller
	c7 := controller.NewAuthController(service)
	app.MountAuthController(service, c7)
	// Mount "auditLog" controller
	c8 := controller.NewAuditLogController(service)
	app.MountAuditLogController(service, c8)
	// Mount "stats/dau" controller
	c9 := controller.NewStatsDauController(service)
	app.MountStatsDauController(service, c9)
	// Mount "stats/mau" controller
	c10 := controller.NewStatsMauController(service)
	app.MountStatsMauController(service, c10)
	// Mount "root" controller
	c11 := controller.NewRootController(service)
	app.MountRootController(service, c11)
	// Mount "authType" controller
	c12 := controller.NewAuthTypeController(service)
	app.MountAuthTypeController(service, c12)

	// Start service
	if err := service.ListenAndServe(":3000"); err != nil {
		service.LogError("startup", "err", err)
	}
}

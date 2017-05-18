package main

import (
	"strconv"

	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/controller"
	"github.com/cam-inc/dmc/example-go/gen/app"
	dmcMiddleware "github.com/cam-inc/dmc/example-go/middleware"
	"github.com/cam-inc/dmc/example-go/models"
	"github.com/goadesign/goa"
	"github.com/goadesign/goa/middleware"
)

func main() {
	// db connection
	models.InitDB()

	// Create service
	service := goa.New("example-go")

	// Mount middleware
	service.Use(middleware.RequestID())
	service.Use(middleware.LogRequest(true))
	service.Use(middleware.ErrorHandler(service, true))
	service.Use(middleware.Recover())
	app.UseJWTMiddleware(service, dmcMiddleware.JWT())
	service.Use(dmcMiddleware.SetHeader())

	//- DMC standard controllers (do not remove!)
	// Mount "dmc" controller
	dc1 := controller.NewDmcController(service)
	app.MountDmcController(service, dc1)
	// Mount "swagger" controller
	dc2 := controller.NewSwaggerController(service)
	app.MountSwaggerController(service, dc2)
	// Mount "root" controller
	dc3 := controller.NewRootController(service)
	app.MountRootController(service, dc3)
	// Mount "authType" controller
	dc4 := controller.NewAuthTypeController(service)
	app.MountAuthTypeController(service, dc4)
	// Mount "auth" controller
	dc5 := controller.NewAuthController(service)
	app.MountAuthController(service, dc5)
	// Mount "admin_user" controller
	dc6 := controller.NewAdminUserController(service)
	app.MountAdminUserController(service, dc6)
	// Mount "admin_role" controller
	dc7 := controller.NewAdminRoleController(service)
	app.MountAdminRoleController(service, dc7)
	// Mount "auditLog" controller
	dc8 := controller.NewAuditLogController(service)
	app.MountAuditLogController(service, dc8)

	//- Service specific controllers
	// Mount "user" controller
	sc1 := controller.NewUserController(service)
	app.MountUserController(service, sc1)
	// Mount "stats/dau" controller
	sc2 := controller.NewStatsDauController(service)
	app.MountStatsDauController(service, sc2)
	// Mount "stats/mau" controller
	sc3 := controller.NewStatsMauController(service)
	app.MountStatsMauController(service, sc3)
	// Mount "file" controller
	sc4 := controller.NewFileController(service)
	app.MountFileController(service, sc4)
	// Mount "stats/planet" controller
	sc5 := controller.NewStatsPlanetController(service)
	app.MountStatsPlanetController(service, sc5)
	// Mount userBlog" controller
	sc6 := controller.NewUserBlogController(service)
	app.MountUserBlogController(service, sc6)
	// Mount userBlogEntry" controller
	sc7 := controller.NewUserBlogEntryController(service)
	app.MountUserBlogEntryController(service, sc7)
	// Mount blogDesignEntry" controller
	sc8 := controller.NewBlogDesignController(service)
	app.MountBlogDesignController(service, sc8)

	// Start service
	if common.GetScheme() == "https" {
		sslConfig := common.GetSSLConfig()
		if err := service.ListenAndServeTLS(":"+strconv.Itoa(int(common.GetPort())), sslConfig.CertificateFilePath, sslConfig.PrivateKeyFilePath); err != nil {
			service.LogError("startup", "err", err)
		}
	} else {
		if err := service.ListenAndServe(":" + strconv.Itoa(int(common.GetPort()))); err != nil {
			service.LogError("startup", "err", err)
		}
	}
}

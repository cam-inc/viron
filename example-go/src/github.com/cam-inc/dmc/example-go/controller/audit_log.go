package controller

import (
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/goadesign/goa"
	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/models"
)

// AuditLogController implements the audit_log resource.
type AuditLogController struct {
	*goa.Controller
}

// NewAuditLogController creates a audit_log controller.
func NewAuditLogController(service *goa.Service) *AuditLogController {
	return &AuditLogController{Controller: service.NewController("AuditLogController")}
}

// List runs the list action.
func (c *AuditLogController) List(ctx *app.ListAuditLogContext) error {
	// AuditLogController_List: start_implement

	// Put your logic here
	auditLogTable := models.NewAuditLogDB(common.DB)
	list := auditLogTable.ListAuditLog(ctx.Context)

	// AuditLogController_List: end_implement
	return ctx.OK(list)
}

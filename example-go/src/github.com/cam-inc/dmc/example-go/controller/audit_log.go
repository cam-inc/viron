package controller

import (
	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/cam-inc/dmc/example-go/models"
	"github.com/goadesign/goa"
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
	pager := common.Pager{}
	pager.SetLimit(ctx.Limit)
	pager.SetOffset(ctx.Offset)

	auditLogTable := models.NewAuditLogDB(models.DB)
	list := auditLogTable.ListPage(ctx.Context, pager.Limit, pager.Offset)
	count := auditLogTable.Count(ctx.Context)

	pager.SetCount(count)
	pager.SetPaginationHeader(ctx.ResponseWriter)

	// AuditLogController_List: end_implement
	return ctx.OK(list)
}

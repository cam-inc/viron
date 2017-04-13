package controller

import (
	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/cam-inc/dmc/example-go/gen/models"
	"github.com/goadesign/goa"
	"github.com/jinzhu/gorm"
)

// AdminRoleController implements the admin_role resource.
type AdminRoleController struct {
	*goa.Controller
}

// NewAdminRoleController creates a admin_role controller.
func NewAdminRoleController(service *goa.Service) *AdminRoleController {
	return &AdminRoleController{Controller: service.NewController("AdminRoleController")}
}

// Create runs the create action.
func (c *AdminRoleController) Create(ctx *app.CreateAdminRoleContext) error {
	// AdminRoleController_Create: start_implement

	// Put your logic here
	adminRoleTable := models.NewAdminRoleDB(common.DB)
	m := models.AdminRole{}
	m.RoleID = *ctx.Payload.RoleID
	m.AllowType = *ctx.Payload.AllowType
	m.Target = *ctx.Payload.Target
	err := adminRoleTable.Add(ctx.Context, &m)
	if err != nil {
		panic(err)
	}

	// AdminRoleController_Create: end_implement
	res := &app.AdminRole{}
	return ctx.OK(res)
}

// Delete runs the delete action.
func (c *AdminRoleController) Delete(ctx *app.DeleteAdminRoleContext) error {
	// AdminRoleController_Delete: start_implement

	// Put your logic here
	adminRoleTable := models.NewAdminRoleDB(common.DB)
	err := adminRoleTable.Delete(ctx.Context, ctx.ID)
	if err != nil {
		panic(err)
	}

	// AdminRoleController_Delete: end_implement
	return ctx.NoContent()
}

// List runs the list action.
func (c *AdminRoleController) List(ctx *app.ListAdminRoleContext) error {
	// AdminRoleController_List: start_implement

	// Put your logic here
	adminRoleTable := models.NewAdminRoleDB(common.DB)
	list := adminRoleTable.ListAdminRole(ctx.Context)

	// AdminRoleController_List: end_implement
	return ctx.OK(list)
}

// Show runs the show action.
func (c *AdminRoleController) Show(ctx *app.ShowAdminRoleContext) error {
	// AdminRoleController_Show: start_implement

	// Put your logic here
	adminRoleTable := models.NewAdminRoleDB(common.DB)
	m, err := adminRoleTable.OneAdminRole(ctx.Context, ctx.ID)
	if err == gorm.ErrRecordNotFound {
		return ctx.NotFound()
	} else if err != nil {
		panic(err)
	}

	// AdminRoleController_Show: end_implement
	return ctx.OK(m)
}

// Update runs the update action.
func (c *AdminRoleController) Update(ctx *app.UpdateAdminRoleContext) error {
	// AdminRoleController_Update: start_implement

	// Put your logic here
	adminRoleTable := models.NewAdminRoleDB(common.DB)
	m, err := adminRoleTable.Get(ctx.Context, ctx.ID)
	if err == gorm.ErrRecordNotFound {
		return ctx.NotFound()
	} else if err != nil {
		panic(err)
	}

	if &ctx.Payload.RoleID != nil {
		m.RoleID = *ctx.Payload.RoleID
	}
	if &ctx.Payload.AllowType != nil {
		m.AllowType = *ctx.Payload.AllowType
	}
	if &ctx.Payload.Target != nil {
		m.Target = *ctx.Payload.Target
	}
	err = adminRoleTable.Update(ctx.Context, m)
	if err != nil {
		panic(err)
	}

	r, err := adminRoleTable.OneAdminRole(ctx.Context, ctx.ID)
	if err != nil {
		panic(err)
	}

	// AdminRoleController_Update: end_implement
	return ctx.OK(r)
}

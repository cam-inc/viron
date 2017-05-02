package controller

import (
	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/cam-inc/dmc/example-go/models"
	"github.com/goadesign/goa"
	"github.com/jinzhu/gorm"

	"github.com/cam-inc/dmc/example-go/service"
)

// AdminUserController implements the admin_user resource.
type AdminUserController struct {
	*goa.Controller
}

// NewAdminUserController creates a admin_user controller.
func NewAdminUserController(service *goa.Service) *AdminUserController {
	return &AdminUserController{Controller: service.NewController("AdminUserController")}
}

// Create runs the create action.
func (c *AdminUserController) Create(ctx *app.CreateAdminUserContext) error {
	// AdminUserController_Create: start_implement

	// Put your logic here
	if m, err := service.CreateAdminUserByIdPassword(ctx.Context, *ctx.Payload.Email, *ctx.Payload.Password, common.GetDefaultRole()); err != nil {
		return ctx.InternalServerError()
	} else {
		res := &app.AdminUser{
			Email:  m.Email,
			RoleID: &m.RoleID,
		}
		return ctx.OK(res)
	}
}

// Delete runs the delete action.
func (c *AdminUserController) Delete(ctx *app.DeleteAdminUserContext) error {
	// AdminUserController_Delete: start_implement

	// Put your logic here
	adminUserTable := models.NewAdminUserDB(common.DB)
	err := adminUserTable.Delete(ctx.Context, ctx.ID)
	if err != nil {
		panic(err)
	}

	// AdminUserController_Delete: end_implement
	return ctx.NoContent()
}

// List runs the list action.
func (c *AdminUserController) List(ctx *app.ListAdminUserContext) error {
	// AdminUserController_List: start_implement

	// Put your logic here
	adminUserTable := models.NewAdminUserDB(common.DB)
	list := adminUserTable.ListAdminUser(ctx.Context)
	// AdminUserController_List: end_implement

	return ctx.OK(list)
}

// Show runs the show action.
func (c *AdminUserController) Show(ctx *app.ShowAdminUserContext) error {
	// AdminUserController_Show: start_implement

	// Put your logic here
	adminUserTable := models.NewAdminUserDB(common.DB)
	m, err := adminUserTable.OneAdminUser(ctx.Context, ctx.ID)
	if err == gorm.ErrRecordNotFound {
		return ctx.NotFound()
	} else if err != nil {
		panic(err)
	}

	// AdminUserController_Show: end_implement
	return ctx.OK(m)
}

// Update runs the update action.
func (c *AdminUserController) Update(ctx *app.UpdateAdminUserContext) error {
	// AdminUserController_Update: start_implement

	// Put your logic here
	adminUserTable := models.NewAdminUserDB(common.DB)
	m, err := adminUserTable.Get(ctx.Context, ctx.ID)
	if err == gorm.ErrRecordNotFound {
		return ctx.NotFound()
	} else if err != nil {
		panic(err)
	}

	if &ctx.Payload.Password != nil {
		m.Password = *ctx.Payload.Password
	}
	if &ctx.Payload.RoleID != nil {
		m.RoleID = *ctx.Payload.RoleID
	}
	err = adminUserTable.Update(ctx.Context, m)
	if err != nil {
		panic(err)
	}

	r, err := adminUserTable.OneAdminUser(ctx.Context, ctx.ID)
	if err != nil {
		panic(err)
	}

	// AdminUserController_Update: end_implement
	return ctx.OK(r)
}

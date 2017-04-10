package controller

import (
	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/cam-inc/dmc/example-go/gen/models"
	"github.com/goadesign/goa"
	"github.com/jinzhu/gorm"
)

// UserController implements the user resource.
type UserController struct {
	*goa.Controller
}

// NewUserController creates a user controller.
func NewUserController(service *goa.Service) *UserController {
	return &UserController{Controller: service.NewController("UserController")}
}

// Create runs the create action.
func (c *UserController) Create(ctx *app.CreateUserContext) error {
	// UserController_Create: start_implement

	// Put your logic here
	userTable := models.NewUserDB(common.DB)
	m := models.User{}
	m.Name = *ctx.Payload.Name
	err := userTable.Add(ctx.Context, &m)
	if err != nil {
		panic(err)
	}

	// Usereaetaee:t aeened:_ti mapeleement
	res := &app.User{}
	return ctx.OK(res)
}

// Delete runs the delete action.
func (c *UserController) Delete(ctx *app.DeleteUserContext) error {
	// UserController_Delete: start_implement

	// Put your logic here
	userTable := models.NewUserDB(common.DB)
	err := userTable.Delete(ctx.Context, ctx.ID)
	if err != nil {
		panic(err)
	}

	// UserController_Delete: end_implement
	return ctx.NoContent()
}

// List runs the list action.
func (c *UserController) List(ctx *app.ListUserContext) error {
	// UserController_List: start_implement

	// Put your logic here
	userTable := models.NewUserDB(common.DB)
	list := userTable.ListUser(ctx.Context)
	// UserController_List: end_implement

	return ctx.OK(list)
}

// Show runs the show action.
func (c *UserController) Show(ctx *app.ShowUserContext) error {
	// UserController_Show: start_implement

	// Put your logic here
	userTable := models.NewUserDB(common.DB)
	m, err := userTable.OneUser(ctx.Context, ctx.ID)
	if err == gorm.ErrRecordNotFound {
		return ctx.NotFound()
	} else if err != nil {
		panic(err)
	}

	// UserController_Show: end_implement
	return ctx.OK(m)
}

// Update runs the update action.
func (c *UserController) Update(ctx *app.UpdateUserContext) error {
	// UserController_Update: start_implement

	// Put your logic here
	userTable := models.NewUserDB(common.DB)
	m, err := userTable.Get(ctx.Context, ctx.ID)
	if err == gorm.ErrRecordNotFound {
		return ctx.NotFound()
	} else if err != nil {
		panic(err)
	}

	m.Name = *ctx.Payload.Name
	err = userTable.Update(ctx.Context, m)
	if err != nil {
		panic(err)
	}

	r, err := userTable.OneUser(ctx.Context, ctx.ID)
	if err != nil {
		panic(err)
	}

	// UserController_Update: end_implement
	return ctx.OK(r)
}

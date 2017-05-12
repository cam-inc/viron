package controller

import (
	"github.com/cam-inc/dmc/example-go/gen/app"
	genModels "github.com/cam-inc/dmc/example-go/gen/models"
	"github.com/cam-inc/dmc/example-go/models"
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
	userTable := models.NewUserDB(models.DB)
	m := genModels.User{}
	m.Name = ctx.Payload.Name

	if ctx.Payload.Sex != nil {
		m.Sex = *ctx.Payload.Sex
	}
	if ctx.Payload.Birthday != nil {
		m.Birthday = ctx.Payload.Birthday
	}
	if ctx.Payload.BloodType != nil {
		m.BloodType = *ctx.Payload.BloodType
	}
	if ctx.Payload.Job != nil {
		m.Job = *ctx.Payload.Job
	}
	if ctx.Payload.HomeTown != nil {
		m.HomeTown = *ctx.Payload.HomeTown
	}
	if ctx.Payload.LivingRegion != nil {
		m.LivingRegion = *ctx.Payload.LivingRegion
	}
	if ctx.Payload.Married != nil {
		m.Married = *ctx.Payload.Married
	}
	if ctx.Payload.AppearArea != nil {
		m.AppearArea = *ctx.Payload.AppearArea
	}
	if ctx.Payload.School != nil {
		m.School = *ctx.Payload.School
	}
	if ctx.Payload.Homepage != nil {
		m.Homepage = *ctx.Payload.Homepage
	}
	if err := userTable.Add(ctx.Context, &m); err != nil {
		return ctx.InternalServerError()
	}

	// UserController_Create: end_implement
	res := &app.User{}
	return ctx.OK(res)
}

// Delete runs the delete action.
func (c *UserController) Delete(ctx *app.DeleteUserContext) error {
	// UserController_Delete: start_implement

	// Put your logic here
	userTable := models.NewUserDB(models.DB)
	if err := userTable.Delete(ctx.Context, ctx.ID); err != nil {
		return ctx.InternalServerError()
	}

	// UserController_Delete: end_implement
	return ctx.NoContent()
}

// List runs the list action.
func (c *UserController) List(ctx *app.ListUserContext) error {
	// UserController_List: start_implement

	// Put your logic here
	userTable := models.NewUserDB(models.DB)
	list := userTable.ListUser(ctx.Context, ctx.Params)
	// UserController_List: end_implement

	return ctx.OK(list)
}

// Show runs the show action.
func (c *UserController) Show(ctx *app.ShowUserContext) error {
	// UserController_Show: start_implement

	// Put your logic here
	userTable := models.NewUserDB(models.DB)
	if m, err := userTable.OneUser(ctx.Context, ctx.ID); err == gorm.ErrRecordNotFound {
		return ctx.NotFound()
	} else if err != nil {
		return ctx.InternalServerError()
	} else {
		return ctx.OK(m)
	}
}

// Update runs the update action.
func (c *UserController) Update(ctx *app.UpdateUserContext) error {
	// UserController_Update: start_implement

	// Put your logic here
	userTable := models.NewUserDB(models.DB)
	m, err := userTable.Get(ctx.Context, ctx.ID)
	if err == gorm.ErrRecordNotFound {
		return ctx.NotFound()
	} else if err != nil {
		return ctx.InternalServerError()
	}

	m.Name = ctx.Payload.Name
	if ctx.Payload.Sex != nil {
		m.Sex = *ctx.Payload.Sex
	}
	if ctx.Payload.Birthday != nil {
		m.Birthday = ctx.Payload.Birthday
	}
	if ctx.Payload.BloodType != nil {
		m.BloodType = *ctx.Payload.BloodType
	}
	if ctx.Payload.Job != nil {
		m.Job = *ctx.Payload.Job
	}
	if ctx.Payload.HomeTown != nil {
		m.HomeTown = *ctx.Payload.HomeTown
	}
	if ctx.Payload.LivingRegion != nil {
		m.LivingRegion = *ctx.Payload.LivingRegion
	}
	if ctx.Payload.Married != nil {
		m.Married = *ctx.Payload.Married
	}
	if ctx.Payload.AppearArea != nil {
		m.AppearArea = *ctx.Payload.AppearArea
	}
	if ctx.Payload.School != nil {
		m.School = *ctx.Payload.School
	}
	if ctx.Payload.Homepage != nil {
		m.Homepage = *ctx.Payload.Homepage
	}
	if err = userTable.Update(ctx.Context, m); err != nil {
		return ctx.InternalServerError()
	}

	if r, err := userTable.OneUser(ctx.Context, ctx.ID); err != nil {
		return ctx.InternalServerError()
	} else {
		return ctx.OK(r)
	}
}

package controller

import (
	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/cam-inc/dmc/example-go/models"
	"github.com/goadesign/goa"
	genModels "github.com/cam-inc/dmc/example-go/gen/models"
	"github.com/jinzhu/gorm"
)

// UserBlogController implements the user_blog resource.
type UserBlogController struct {
	*goa.Controller
}

// NewUserBlogController creates a user_blog controller.
func NewUserBlogController(service *goa.Service) *UserBlogController {
	return &UserBlogController{Controller: service.NewController("UserBlogController")}
}

// Create runs the create action.
func (c *UserBlogController) Create(ctx *app.CreateUserBlogContext) error {
	// UserBlogController_Create: start_implement

	// Put your logic here
	userBlogTable := models.NewUserBlogDB(common.DB)
	m := genModels.UserBlog{}
	m.UserID = *ctx.Payload.UserID
	m.Title = *ctx.Payload.Title
	m.SubTitle = *ctx.Payload.SubTitle
	m.Genre = *ctx.Payload.Genre
	m.DesignID = *ctx.Payload.DesignID

	if err := userBlogTable.Add(ctx.Context, &m); err != nil {
		return ctx.InternalServerError()
	}

	// UserBlogController_Create: end_implement
	res := &app.UserBlog{}
	return ctx.OK(res)
}

// Delete runs the delete action.
func (c *UserBlogController) Delete(ctx *app.DeleteUserBlogContext) error {
	// UserBlogController_Delete: start_implement

	// Put your logic here
	userBlogTable := models.NewUserBlogDB(common.DB)
	if err := userBlogTable.Delete(ctx.Context, ctx.ID); err != nil {
		return ctx.InternalServerError()
	}

	// UserBlogController_Delete: end_implement
	return ctx.NoContent()
}

// List runs the list action.
func (c *UserBlogController) List(ctx *app.ListUserBlogContext) error {
	// UserBlogController_List: start_implement

	// Put your logic here
	pager := common.Pager{}
	pager.SetLimit(ctx.Limit)
	pager.SetOffset(ctx.Offset)

	userBlogTable := models.NewUserBlogDB(common.DB)
	list := userBlogTable.ListPage(ctx.Context, pager.Limit, pager.Offset)
	count := userBlogTable.Count(ctx.Context)

	pager.SetCount(count)
	pager.SetPaginationHeader(ctx.ResponseWriter)

	// UserBlogController_List: end_implement
	return ctx.OK(list)
}

// Show runs the show action.
func (c *UserBlogController) Show(ctx *app.ShowUserBlogContext) error {
	// UserBlogController_Show: start_implement

	// Put your logic here
	userBlogTable := models.NewUserBlogDB(common.DB)
	if m, err := userBlogTable.OneUserBlog(ctx.Context, ctx.ID); err == gorm.ErrRecordNotFound {
		return ctx.NotFound()
	} else if err != nil {
		return ctx.InternalServerError()
	} else {
		return ctx.OK(m)
	}
}

// Update runs the update action.
func (c *UserBlogController) Update(ctx *app.UpdateUserBlogContext) error {
	// UserBlogController_Update: start_implement

	// Put your logic here
	userBlogTable := models.NewUserBlogDB(common.DB)
	if m, err := userBlogTable.Get(ctx.Context, ctx.ID); err == gorm.ErrRecordNotFound {
		return ctx.NotFound()
	} else if err != nil {
		return ctx.InternalServerError()
	} else {
		m.UserID = *ctx.Payload.UserID
		m.Title = *ctx.Payload.Title
		m.SubTitle = *ctx.Payload.SubTitle
		m.Genre = *ctx.Payload.Genre
		m.DesignID = *ctx.Payload.DesignID

		if err = userBlogTable.Update(ctx.Context, m); err != nil {
			return ctx.InternalServerError()
		}

		res := &app.UserBlog{}
		return ctx.OK(res)
	}
}

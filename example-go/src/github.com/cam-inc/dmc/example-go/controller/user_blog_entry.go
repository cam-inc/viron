package controller

import (
	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/cam-inc/dmc/example-go/models"
	"github.com/goadesign/goa"
	genModels "github.com/cam-inc/dmc/example-go/gen/models"
	"github.com/jinzhu/gorm"
)

// UserBlogEntryController implements the user_blog_entry resource.
type UserBlogEntryController struct {
	*goa.Controller
}

// NewUserBlogEntryController creates a user_blog_entry controller.
func NewUserBlogEntryController(service *goa.Service) *UserBlogEntryController {
	return &UserBlogEntryController{Controller: service.NewController("UserBlogEntryController")}
}

// Create runs the create action.
func (c *UserBlogEntryController) Create(ctx *app.CreateUserBlogEntryContext) error {
	// UserBlogEntryController_Create: start_implement

	// Put your logic here
	userBlogEntryTable := models.NewUserBlogEntryDB(common.DB)
	m := genModels.UserBlogEntry{}
	m.UserBlogID = *ctx.Payload.UserBlogID
	m.Title = *ctx.Payload.Title
	m.Content = *ctx.Payload.Content
	m.Theme = *ctx.Payload.Theme

	if err := userBlogEntryTable.Add(ctx.Context, &m); err != nil {
		return ctx.InternalServerError()
	}

	// UserBlogEntryController_Create: end_implement
	res := &app.UserBlogEntry{}
	return ctx.OK(res)
}

// Delete runs the delete action.
func (c *UserBlogEntryController) Delete(ctx *app.DeleteUserBlogEntryContext) error {
	// UserBlogEntryController_Delete: start_implement

	// Put your logic here
	userBlogEntryTable := models.NewUserBlogEntryDB(common.DB)
	if err := userBlogEntryTable.Delete(ctx.Context, ctx.ID); err != nil {
		return ctx.InternalServerError()
	}

	// UserBlogEntryController_Delete: end_implement
	return ctx.NoContent()
}

// List runs the list action.
func (c *UserBlogEntryController) List(ctx *app.ListUserBlogEntryContext) error {
	// UserBlogEntryController_List: start_implement

	// Put your logic here
	pager := common.Pager{}
	pager.SetLimit(ctx.Limit)
	pager.SetOffset(ctx.Offset)

	userBlogEntryTable := models.NewUserBlogEntryDB(common.DB)
	list := userBlogEntryTable.ListPage(ctx.Context, pager.Limit, pager.Offset)
	count := userBlogEntryTable.Count(ctx.Context)

	pager.SetCount(count)
	pager.SetPaginationHeader(ctx.ResponseWriter)

	// UserBlogEntryController_List: end_implement
	return ctx.OK(list)
}

// Show runs the show action.
func (c *UserBlogEntryController) Show(ctx *app.ShowUserBlogEntryContext) error {
	// UserBlogEntryController_Show: start_implement

	// Put your logic here
	userBlogEntryTable := models.NewUserBlogEntryDB(common.DB)
	if m, err := userBlogEntryTable.OneUserBlogEntry(ctx.Context, ctx.ID); err == gorm.ErrRecordNotFound {
		return ctx.NotFound()
	} else if err != nil {
		return ctx.InternalServerError()
	} else {
		return ctx.OK(m)
	}
}

// Update runs the update action.
func (c *UserBlogEntryController) Update(ctx *app.UpdateUserBlogEntryContext) error {
	// UserBlogEntryController_Update: start_implement

	// Put your logic here
	userBlogEntryTable := models.NewUserBlogEntryDB(common.DB)
	if m, err := userBlogEntryTable.Get(ctx.Context, ctx.ID); err == gorm.ErrRecordNotFound {
		return ctx.NotFound()
	} else if err != nil {
		return ctx.InternalServerError()
	} else {
		m.UserBlogID = *ctx.Payload.UserBlogID
		m.Title = *ctx.Payload.Title
		m.Content = *ctx.Payload.Content
		m.Theme = *ctx.Payload.Theme

		if err = userBlogEntryTable.Update(ctx.Context, m); err != nil {
			return ctx.InternalServerError()
		}

		res := &app.UserBlogEntry{}
		return ctx.OK(res)
	}
}

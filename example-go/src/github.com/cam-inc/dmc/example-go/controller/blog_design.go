package controller

import (
	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/cam-inc/dmc/example-go/models"
	"github.com/goadesign/goa"
	"github.com/jinzhu/gorm"
)

// BlogDesignController implements the blog_design resource.
type BlogDesignController struct {
	*goa.Controller
}

// NewBlogDesignController creates a blog_design controller.
func NewBlogDesignController(service *goa.Service) *BlogDesignController {
	return &BlogDesignController{Controller: service.NewController("BlogDesignController")}
}

// Create runs the create action.
func (c *BlogDesignController) Create(ctx *app.CreateBlogDesignContext) error {
	// BlogDesignController_Create: start_implement

	// Put your logic here
	blogDesignTable := models.NewBlogDesignDB(models.DB)
	m := models.BlogDesign{}
	m.ID = ctx.Payload.ID
	m.Name = ctx.Payload.Name
	m.BaseColor = ctx.Payload.BaseColor
	m.BackgroundImage = *ctx.Payload.BackgroundImage

	if err := blogDesignTable.Add(ctx.Context, &m); err != nil {
		return ctx.InternalServerError()
	}

	// BlogDesignController_Create: end_implement
	res := &app.BlogDesign{}
	return ctx.OK(res)
}

// Delete runs the delete action.
func (c *BlogDesignController) Delete(ctx *app.DeleteBlogDesignContext) error {
	// BlogDesignController_Delete: start_implement

	// Put your logic here
	blogDesignTable := models.NewBlogDesignDB(models.DB)
	if err := blogDesignTable.Delete(ctx.Context, ctx.ID); err != nil {
		return ctx.InternalServerError()
	}

	// BlogDesignController_Delete: end_implement
	return nil
}

// List runs the list action.
func (c *BlogDesignController) List(ctx *app.ListBlogDesignContext) error {
	// BlogDesignController_List: start_implement

	// Put your logic here
	pager := common.Pager{}
	pager.SetLimit(ctx.Limit)
	pager.SetOffset(ctx.Offset)

	blogDesignTable := models.NewBlogDesignDB(models.DB)
	list := blogDesignTable.ListPage(ctx.Context, pager.Limit, pager.Offset)
	count := blogDesignTable.Count(ctx.Context)

	pager.SetCount(count)
	pager.SetPaginationHeader(ctx.ResponseWriter)

	// BlogDesignController_List: end_implement
	return ctx.OK(list)
}

// Show runs the show action.
func (c *BlogDesignController) Show(ctx *app.ShowBlogDesignContext) error {
	// BlogDesignController_Show: start_implement

	// Put your logic here
	blogDesignTable := models.NewBlogDesignDB(models.DB)
	if m, err := blogDesignTable.Get(ctx.Context, ctx.ID); err == gorm.ErrRecordNotFound {
		return ctx.NotFound()
	} else if err != nil {
		return ctx.InternalServerError()
	} else {
		res := m.BlogDesignToBlogDesign()
		return ctx.OK(res)
	}
}

// Update runs the update action.
func (c *BlogDesignController) Update(ctx *app.UpdateBlogDesignContext) error {
	// BlogDesignController_Update: start_implement

	// Put your logic here
	blogDesignTable := models.NewBlogDesignDB(models.DB)
	if m, err := blogDesignTable.Get(ctx.Context, ctx.ID); err == gorm.ErrRecordNotFound {
		return ctx.NotFound()
	} else if err != nil {
		return ctx.InternalServerError()
	} else {
		m.ID = ctx.Payload.ID
		m.Name = ctx.Payload.Name
		m.BaseColor = ctx.Payload.BaseColor
		m.BackgroundImage = *ctx.Payload.BackgroundImage

		if err = blogDesignTable.Update(ctx.Context, m); err != nil {
			return ctx.InternalServerError()
		}

		res := &app.BlogDesign{}
		return ctx.OK(res)
	}
}

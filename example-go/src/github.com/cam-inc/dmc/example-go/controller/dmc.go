package controller

import (
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/goadesign/goa"
	"github.com/cam-inc/dmc/example-go/bridge"
)

// DmcController implements the dmc resource.
type DmcController struct {
	*goa.Controller
}

// NewDmcController creates a dmc controller.
func NewDmcController(service *goa.Service) *DmcController {
	return &DmcController{Controller: service.NewController("DmcController")}
}

// Show runs the show action.
func (c *DmcController) Show(ctx *app.ShowDmcContext) error {
	// DmcController_Show: start_implement

	// Put your logic here

	// DmcController_Show: end_implement
	res := &app.Dmc{
		Name: "Example",
		Pages: []*app.Page{
			// Dashboard
			{
				Section: bridge.SectionDashboard,
				Group: bridge.GroupEmpty,
				Name: "Overview",
				API: &app.API{
					ID: "overview",
					Operation: "overview",
				},
				Layout: bridge.LayoutCard,
				Drawer:    true,
				Primary: "id",
			},
			{
				Section: bridge.SectionDashboard,
				Group: bridge.GroupEmpty,
				Name: "指標",
				API: &app.API{
					ID: "kpi",
					Operation: "kpi",
				},
				Layout: bridge.LayoutCard,
				Drawer:    true,
				Primary: "id",
			},

			// Mange
			{
				Section: bridge.SectionManage,
				Group: bridge.GroupBlog,
				Name: "記事",
				API: &app.API{
					ID: "blog",
					Operation: "posts",
				},
				Layout: bridge.LayoutTable,
				Drawer:    true,
				Primary: "id",
			},
			{
				Section: bridge.SectionManage,
				Group: bridge.GroupUser,
				Name: "ユーザ",
				API: &app.API{
					ID: "user",
					Operation: "user",
				},
				Layout: bridge.LayoutTable,
				Drawer:    true,
				Primary: "id",
			},
			{
				Section: bridge.SectionManage,
				Group: bridge.GroupAdmin,
				Name: "管理者",
				API: &app.API{
					ID: "admin",
					Operation: "admin",
				},
				Layout: bridge.LayoutTable,
				Drawer:    true,
				Primary: "id",
			},

		},
	}
	return ctx.OK(res)
}

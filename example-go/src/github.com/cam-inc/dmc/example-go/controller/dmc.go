package controller

import (
	"github.com/cam-inc/dmc/example-go/bridge"
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/goadesign/goa"
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
				Group:   bridge.GroupEmpty,
				Name:    "クイックビュー",
				API: &app.API{
					Path:   "/quickview",
					Method: "get",
				},
			},
			{
				Section: bridge.SectionDashboard,
				Group:   bridge.GroupEmpty,
				Name:    "DMC ユーザー権限",
				API: &app.API{
					Path:   "/adminrole",
					Method: "get",
				},
			},

			// Mange
			{
				Section: bridge.SectionManage,
				Group:   bridge.GroupBlog,
				Name:    "DMC ユーザー",
				API: &app.API{
					Path:   "/adminuser",
					Method: "get",
				},
			},
			{
				Section: bridge.SectionManage,
				Group:   bridge.GroupUser,
				Name:    "ユーザ",
				API: &app.API{
					Path:   "/user",
					Method: "get",
				},
			},
		},
	}
	return ctx.OK(res)
}

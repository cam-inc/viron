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
				ID:      "quickview",
				Name:    "クイックビュー",
				Section: bridge.SectionDashboard,
				Group:   bridge.GroupEmpty,
				Components: []*app.Component{
					{
						Name: "DAU",
						API: &app.API{
							Path:   "/stats/dau",
							Method: "get",
						},
						Style: bridge.StyleNumber,
						Options: []*app.Option{
							{
								Key:   "key",
								Value: "value",
							},
						},
					},
					{
						Name: "MAU",
						API: &app.API{
							Path:   "/stats/mau",
							Method: "get",
						},
						Style: bridge.StyleNumber,
						Options: []*app.Option{
							{
								Key:   "key",
								Value: "value",
							},
						},
					},
				},
			},
			// Mange
			{
				ID:      "user",
				Section: bridge.SectionManage,
				Group:   bridge.GroupUser,
				Name:    "ユーザ",
				Components: []*app.Component{
					{
						Name: "ユーザ",
						API: &app.API{
							Path:   "/user",
							Method: "get",
						},
						Style: bridge.StyleTable,
						Options: []*app.Option{
							{
								Key:   "key",
								Value: "value",
							},
						},
					},
				},
			},

			{
				ID:      "adminrole",
				Name:    "DMC ユーザー権限",
				Section: bridge.SectionManage,
				Group:   bridge.GroupEmpty,
				Components: []*app.Component{
					{
						Name: "DMC ユーザー権限",
						API: &app.API{
							Path:   "/adminrole",
							Method: "get",
						},
						Style: bridge.StyleNumber,
						Options: []*app.Option{
							{
								Key:   "key",
								Value: "value",
							},
						},
					},
				},
			},
			{
				ID:      "adminuser",
				Name:    "DMC ユーザー",
				Section: bridge.SectionManage,
				Group:   bridge.GroupBlog,
				Components: []*app.Component{
					{
						Name: "DMC ユーザー権限",
						API: &app.API{
							Path:   "/adminuser",
							Method: "get",
						},
						Style: bridge.StyleNumber,
						Options: []*app.Option{
							{
								Key:   "key",
								Value: "value",
							},
						},
					},
				},
			},
		},
	}
	return ctx.OK(res)
}

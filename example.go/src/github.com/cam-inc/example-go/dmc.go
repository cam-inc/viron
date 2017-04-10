package main

import (
	"github.com/cam-inc/example-go/app"
	"github.com/cam-inc/example-go/common"
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
		Name: &app.Name{
			Long:  common.String(""),
			Short: "",
		},
		Pages: []*app.Page{
			{
				Display:   "overview",
				Drawer:    true,
				API:       "overview",
				Operation: "overview#show",
				Name: &app.Name{
					Long:  common.String("Overview"),
					Short: "Overview",
				},
			},
			{
				Display:   "table",
				Drawer:    true,
				API:       "user",
				Operation: "user#list",
				Name: &app.Name{
					Long:  common.String("User"),
					Short: "User",
				},
			},
			{
				Display:   "table",
				Drawer:    true,
				API:       "post",
				Operation: "post#list",
				Name: &app.Name{
					Long:  common.String("Post"),
					Short: "Post",
				},
			},
		},
	}
	return ctx.OK(res)
}

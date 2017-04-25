package controller

import (
	"github.com/cam-inc/dmc/example-go/bridge"

	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/goadesign/goa"
)

// QuickviewController implements the quickview resource.
type QuickviewController struct {
	*goa.Controller
}

// NewQuickviewController creates a quickview controller.
func NewQuickviewController(service *goa.Service) *QuickviewController {
	return &QuickviewController{Controller: service.NewController("QuickviewController")}
}

// Show runs the show action.
func (c *QuickviewController) Show(ctx *app.ShowQuickviewContext) error {
	// QuickviewController_Show: start_implement

	// Put your logic here

	// QuickviewController_Show: end_implement
	res := &app.Quickview{
		Name: "Quick View",
		Componets: []*app.Component{
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
	}
	return ctx.OK(res)
}

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
				Name: "Quick View",
				API: &app.API{
					ID:        "quickview",
					Operation: "quickview",
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
				Name: "Quick View1",
				API: &app.API{
					ID:        "quickview1",
					Operation: "quickview1",
				},
				Style: bridge.StyleNumber,
				Options: []*app.Option{
					{
						Key:   "key1",
						Value: "value1",
					},
				},
			},
			{
				Name: "Quick View2",
				API: &app.API{
					ID:        "quickview2",
					Operation: "quickview2",
				},
				Style: bridge.StyleNumber,
				Options: []*app.Option{
					{
						Key:   "key2",
						Value: "value2",
					},
				},
			},
		},
	}
	return ctx.OK(res)
}

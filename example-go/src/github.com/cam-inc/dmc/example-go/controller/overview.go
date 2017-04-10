package controller

import (
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/goadesign/goa"
)

// OverviewController implements the overview resource.
type OverviewController struct {
	*goa.Controller
}

// NewOverviewController creates a overview controller.
func NewOverviewController(service *goa.Service) *OverviewController {
	return &OverviewController{Controller: service.NewController("OverviewController")}
}

// Show runs the show action.
func (c *OverviewController) Show(ctx *app.ShowOverviewContext) error {
	// OverviewController_Show: start_implement

	// Put your logic here

	// OverviewController_Show: end_implement
	res := &app.Overview{}
	return ctx.OK(res)
}

package controller

import (
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/goadesign/goa"
)

// RootController implements the root resource.
type RootController struct {
	*goa.Controller
}

// NewRootController creates a root controller.
func NewRootController(service *goa.Service) *RootController {
	return &RootController{Controller: service.NewController("RootController")}
}

// Show runs the show action.
func (c *RootController) Show(ctx *app.ShowRootContext) error {
	// RootController_Show: start_implement

	// Put your logic here
	ctx.ResponseWriter.Header().Set("location", "/swagger.json")

	// RootController_Show: end_implement
	return ctx.MovedPermanently()
}

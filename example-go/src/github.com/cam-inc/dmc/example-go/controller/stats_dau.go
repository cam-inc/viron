package controller

import (
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/goadesign/goa"
)

// StatsDauController implements the stats_dau resource.
type StatsDauController struct {
	*goa.Controller
}

// NewStatsDauController creates a stats_dau controller.
func NewStatsDauController(service *goa.Service) *StatsDauController {
	return &StatsDauController{Controller: service.NewController("StatsDauController")}
}

// Show runs the show action.
func (c *StatsDauController) Show(ctx *app.ShowStatsDauContext) error {
	// StatsDauController_Show: start_implement

	// Put your logic here

	// StatsDauController_Show: end_implement
	return ctx.OK(1234567)
}

package controller

import (
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/goadesign/goa"
)

// StatsMauController implements the stats_mau resource.
type StatsMauController struct {
	*goa.Controller
}

// NewStatsMauController creates a stats_mau controller.
func NewStatsMauController(service *goa.Service) *StatsMauController {
	return &StatsMauController{Controller: service.NewController("StatsMauController")}
}

// Show runs the show action.
func (c *StatsMauController) Show(ctx *app.ShowStatsMauContext) error {
	// StatsMauController_Show: start_implement

	// Put your logic here

	// StatsMauController_Show: end_implement
	return ctx.OK(9876543)
}

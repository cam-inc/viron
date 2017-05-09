package controller

import (
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/goadesign/goa"
)

// StatsPlanetController implements the stats_planet resource.
type StatsPlanetController struct {
	*goa.Controller
}

// NewStatsPlanetController creates a stats_planet controller.
func NewStatsPlanetController(service *goa.Service) *StatsPlanetController {
	return &StatsPlanetController{Controller: service.NewController("StatsPlanetController")}
}

// Show runs the show action.
func (c *StatsPlanetController) Show(ctx *app.ShowStatsPlanetContext) error {
	// StatsPlanetController_Show: start_implement

	// Put your logic here

	// StatsPlanetController_Show: end_implement
	res := &app.Statsplanet{
		Keys: []string{"Name", "Distance", "Temperature", "Albedo"},
		Data: [][]interface{}{
			{"Mercury", 0.387, 452, 0.12},
			{"Venus", 0.723, 726, 0.59},
			{"Earth", 1.000, 281, 0.39},
			{"Mars", 1.524, 230, 0.15},
			{"Jupiter", 5.203, 120, 0.44},
			{"Saturn", 9.539, 88, 0.46},
			{"Uranus", 19.180, 59, 0.56},
			{"Neptune", 30.060, 48, 0.51},
			{"Pluto", 39.530, 37, 0.50},
		},
	}
	return ctx.OK(res)
}

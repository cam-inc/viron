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

// Bar runs the bar action.
func (c *StatsPlanetController) Bar(ctx *app.BarStatsPlanetContext) error {
	// StatsPlanetController_Bar: start_implement

	// Put your logic here

	// StatsPlanetController_Bar: end_implement
	res := &app.Statsplanet{
		Keys: []string{"Name", "Distance"},
		Data: [][]interface{}{
			{"Mercury", 0.387},
			{"Venus", 0.723},
			{"Earth", 1.000},
			{"Mars", 1.524},
			{"Jupiter", 5.203},
			{"Saturn", 9.539},
			{"Uranus", 19.180},
			{"Neptune", 30.060},
			{"Pluto", 39.530},
		},
	}
	return ctx.OK(res)
}

// HorizontalBar runs the horizontal-bar action.
func (c *StatsPlanetController) HorizontalBar(ctx *app.HorizontalBarStatsPlanetContext) error {
	// StatsPlanetController_HorizontalBar: start_implement

	// Put your logic here

	// StatsPlanetController_HorizontalBar: end_implement
	res := &app.Statsplanet{
		Keys: []string{"Name", "Distance"},
		Data: [][]interface{}{
			{"Mercury", 0.387},
			{"Venus", 0.723},
			{"Earth", 1.000},
			{"Mars", 1.524},
			{"Jupiter", 5.203},
			{"Saturn", 9.539},
			{"Uranus", 19.180},
			{"Neptune", 30.060},
			{"Pluto", 39.530},
		},
	}
	return ctx.OK(res)
}

// HorizontalStackedBar runs the horizontal-stacked-bar action.
func (c *StatsPlanetController) HorizontalStackedBar(ctx *app.HorizontalStackedBarStatsPlanetContext) error {
	// StatsPlanetController_HorizontalStackedBar: start_implement

	// Put your logic here

	// StatsPlanetController_HorizontalStackedBar: end_implement
	res := &app.Statsplanet{
		Keys: []string{"Name", "Distance"},
		Data: [][]interface{}{
			{"Mars", 0.387},
			{"Mars", 0.723},
			{"Mars", 1.000},
			{"Mars", 1.524},
			{"Pluto", 5.203},
			{"Pluto", 9.539},
			{"Pluto", 19.180},
			{"Pluto", 30.060},
			{"Pluto", 39.530},
		},
	}
	return ctx.OK(res)
}

// Line runs the line action.
func (c *StatsPlanetController) Line(ctx *app.LineStatsPlanetContext) error {
	// StatsPlanetController_Line: start_implement

	// Put your logic here

	// StatsPlanetController_Line: end_implement
	res := &app.Statsplanet{
		Keys: []string{"Name", "Distance", "Temperature"},
		Data: [][]interface{}{
			{"Earth", 0.387, 452},
			{"Earth", 0.723, 726},
			{"Earth", 1.000, 281},
			{"Saturn", 1.524, 230},
			{"Saturn", 5.203, 120},
			{"Saturn", 9.539, 88},
			{"Pluto", 19.180, 59},
			{"Pluto", 30.060, 48},
			{"Pluto", 39.530, 37},
		},
	}
	return ctx.OK(res)
}

// Scatterplot runs the scatterplot action.
func (c *StatsPlanetController) Scatterplot(ctx *app.ScatterplotStatsPlanetContext) error {
	// StatsPlanetController_Scatterplot: start_implement

	// Put your logic here

	// StatsPlanetController_Scatterplot: end_implement
	res := &app.Statsplanet{
		Keys: []string{"Name", "Distance", "Temperature", "Albedo"},
		Data: [][]interface{}{
			{"Earth", 0.387, 452, 0.12},
			{"Earth", 0.723, 726, 0.59},
			{"Earth", 1.000, 281, 0.39},
			{"Saturn", 1.524, 230, 0.15},
			{"Saturn", 5.203, 120, 0.44},
			{"Saturn", 9.539, 88, 0.46},
			{"Pluto", 19.180, 59, 0.56},
			{"Pluto", 30.060, 48, 0.51},
			{"Pluto", 39.530, 37, 0.50},
		},
	}
	return ctx.OK(res)
}

// StackedArea runs the stacked-area action.
func (c *StatsPlanetController) StackedArea(ctx *app.StackedAreaStatsPlanetContext) error {
	// StatsPlanetController_StackedArea: start_implement

	// Put your logic here

	// StatsPlanetController_StackedArea: end_implement
	res := &app.Statsplanet{
		Keys: []string{"Name", "Distance", "Temperature"},
		Data: [][]interface{}{
			{"Earth", 1, 452},
			{"Earth", 2, 726},
			{"Earth", 3, 281},
			{"Saturn", 1, 230},
			{"Saturn", 2, 120},
			{"Saturn", 3, 88},
			{"Pluto", 1, 59},
			{"Pluto", 2, 48},
			{"Pluto", 3, 37},
		},
	}
	return ctx.OK(res)
}

// StackedBar runs the stacked-bar action.
func (c *StatsPlanetController) StackedBar(ctx *app.StackedBarStatsPlanetContext) error {
	// StatsPlanetController_StackedBar: start_implement

	// Put your logic here

	// StatsPlanetController_StackedBar: end_implement
	res := &app.Statsplanet{
		Keys: []string{"Name", "Distance"},
		Data: [][]interface{}{
			{"Mars", 0.387},
			{"Mars", 0.723},
			{"Mars", 1.000},
			{"Mars", 1.524},
			{"Saturn", 5.203},
			{"Saturn", 9.539},
			{"Pluto", 19.180},
			{"Pluto", 30.060},
			{"Pluto", 39.530},
		},
	}
	return ctx.OK(res)
}

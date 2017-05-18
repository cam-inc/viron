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
		Data: []map[string]interface{}{
			{"name": "水星", "distance": 0.387},
			{"name": "金星", "distance": 0.723},
			{"name": "地球", "distance": 1.000},
			{"name": "火星", "distance": 1.524},
			{"name": "木星", "distance": 5.203},
			{"name": "土星", "distance": 9.539},
			{"name": "天王星", "distance": 19.180},
			{"name": "海王星", "distance": 30.060},
			{"name": "冥王星", "distance": 39.530},
		},
		X: "name",
		Y: "distance",
		Guide: &app.StatsGuideType{
			X: &app.StatsLabelType{
				Label: "名前",
			},
			Y: &app.StatsLabelType{
				Label: "距離",
			},
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
		Data: []map[string]interface{}{
			{"name": "水星", "distance": 0.387},
			{"name": "金星", "distance": 0.723},
			{"name": "地球", "distance": 1.000},
			{"name": "火星", "distance": 1.524},
			{"name": "木星", "distance": 5.203},
			{"name": "土星", "distance": 9.539},
			{"name": "天王星", "distance": 19.180},
			{"name": "海王星", "distance": 30.060},
			{"name": "冥王星", "distance": 39.530},
		},
		X: "name",
		Y: "distance",
		Guide: &app.StatsGuideType{
			X: &app.StatsLabelType{
				Label: "名前",
			},
			Y: &app.StatsLabelType{
				Label: "距離",
			},
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
		Data: []map[string]interface{}{
			{"name": "水星", "distance": 0.387},
			{"name": "金星", "distance": 0.723},
			{"name": "地球", "distance": 1.000},
			{"name": "火星", "distance": 1.524},
			{"name": "木星", "distance": 5.203},
			{"name": "土星", "distance": 9.539},
			{"name": "天王星", "distance": 19.180},
			{"name": "海王星", "distance": 30.060},
			{"name": "冥王星", "distance": 39.530},
		},
		X: "name",
		Y: "distance",
		Guide: &app.StatsGuideType{
			X: &app.StatsLabelType{
				Label: "名前",
			},
			Y: &app.StatsLabelType{
				Label: "距離",
			},
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
		Data: []map[string]interface{}{
			{"name": "水星", "distance": 0.387, "temperature": 452},
			{"name": "金星", "distance": 0.723, "temperature": 726},
			{"name": "地球", "distance": 1.000, "temperature": 281},
			{"name": "火星", "distance": 1.524, "temperature": 230},
			{"name": "木星", "distance": 5.203, "temperature": 120},
			{"name": "土星", "distance": 9.539, "temperature": 88},
			{"name": "天王星", "distance": 19.180, "temperature": 59},
			{"name": "海王星", "distance": 30.060, "temperature": 48},
			{"name": "冥王星", "distance": 39.530, "temperature": 37},
		},
		X:     "name",
		Y:     "distance",
		Color: "albedo",
		Guide: &app.StatsGuideType{
			X: &app.StatsLabelType{
				Label: "名前",
			},
			Y: &app.StatsLabelType{
				Label: "距離",
			},
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
		Data: []map[string]interface{}{
			{"name": "水星", "distance": 0.387, "temperature": 452, "albedo": 0.1},
			{"name": "金星", "distance": 0.723, "temperature": 726, "albedo": 0.6},
			{"name": "地球", "distance": 1.000, "temperature": 281, "albedo": 0.4},
			{"name": "火星", "distance": 1.524, "temperature": 230, "albedo": 0.2},
			{"name": "木星", "distance": 5.203, "temperature": 120, "albedo": 0.4},
			{"name": "土星", "distance": 9.539, "temperature": 88, "albedo": 0.5},
			{"name": "天王星", "distance": 19.180, "temperature": 59, "albedo": 0.6},
			{"name": "海王星", "distance": 30.060, "temperature": 48, "albedo": 0.5},
			{"name": "冥王星", "distance": 39.530, "temperature": 37, "albedo": 0.5},
		},
		X:     "name",
		Y:     "distance",
		Size:  "temperature",
		Color: "albedo",
		Guide: &app.StatsGuideType{
			X: &app.StatsLabelType{
				Label: "名前",
			},
			Y: &app.StatsLabelType{
				Label: "距離",
			},
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
		Data: []map[string]interface{}{
			{"name": "水星", "distance": 0.387, "temperature": 452},
			{"name": "金星", "distance": 0.723, "temperature": 726},
			{"name": "地球", "distance": 1.000, "temperature": 281},
			{"name": "火星", "distance": 1.524, "temperature": 230},
			{"name": "木星", "distance": 5.203, "temperature": 120},
			{"name": "土星", "distance": 9.539, "temperature": 88},
			{"name": "天王星", "distance": 19.180, "temperature": 59},
			{"name": "海王星", "distance": 30.060, "temperature": 48},
			{"name": "冥王星", "distance": 39.530, "temperature": 37},
		},
		X:     "name",
		Y:     "distance",
		Color: "albedo",
		Guide: &app.StatsGuideType{
			X: &app.StatsLabelType{
				Label: "名前",
			},
			Y: &app.StatsLabelType{
				Label: "距離",
			},
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
	//	Keys: []string{"Name", "Distance"},
	//	Data: [][]interface{}{
	//		{"火星", 0.387},
	//		{"火星", 0.723},
	//		{"火星", 1.000},
	//		{"火星", 1.524},
	//		{"土星", 5.203},
	//		{"土星", 9.539},
	//		{"冥王星", 19.180},
	//		{"冥王星", 30.060},
	//		{"冥王星", 39.530},
	//	},
	}
	return ctx.OK(res)
}

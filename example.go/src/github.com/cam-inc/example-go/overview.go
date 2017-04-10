package main

import (
	"github.com/cam-inc/example-go/app"
	"github.com/cam-inc/example-go/common"
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
	res := &app.Overview{
		Name: &app.Name{
			Long:  common.String("Dashboard"),
			Short: "Dashboard",
		},
		Componets: []*app.Component{
			{
				Display: "dmc-chartjs-doughnut-text-inside",
				//Drawer:    true,
				API:       "crash",
				Operation: "crash_overview",
				Name: &app.Name{
					Long:  common.String("Native Android Crash"),
					Short: "Cash (Android)",
				},
			},
			{
				Display: "dmc-chartjs-doughnut-text-inside",
				//Drawer:    true,
				API:       "crash",
				Operation: "crash_overview",
				Name: &app.Name{
					Long:  common.String("Native iOS Crash"),
					Short: "Cash (iOS)",
				},
			},
			{
				Display: "dmc-chartjs-doughnut-text-inside",
				//Drawer:    true,
				API:       "crash",
				Operation: "crash_overview",
				Name: &app.Name{
					Long:  common.String("Native Web Crash"),
					Short: "Cash (Web)",
				},
			},
		},
	}
	return ctx.OK(res)
}

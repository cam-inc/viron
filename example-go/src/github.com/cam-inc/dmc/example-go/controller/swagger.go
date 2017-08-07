package controller

import (
	"encoding/json"

	"github.com/cam-inc/dmc/example-go/service"

	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/goadesign/goa"
)

// SwaggerController implements the swagger resource.
type SwaggerController struct {
	*goa.Controller
}

// NewSwaggerController creates a swagger controller.
func NewSwaggerController(service *goa.Service) *SwaggerController {
	return &SwaggerController{Controller: service.NewController("SwaggerController")}
}

// Show runs the show action.
func (c *SwaggerController) Show(ctx *app.ShowSwaggerContext) error {
	// SwaggerController_Show: start_implement

	// Put your logic here
	swaggerAll := service.GetSwagger()
	if res, err := json.Marshal(swaggerAll); err != nil {
		return ctx.InternalServerError()
	} else {
		return ctx.OK(res)
	}
}

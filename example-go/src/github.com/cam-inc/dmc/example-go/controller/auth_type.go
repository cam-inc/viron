package controller

import (
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/goadesign/goa"
)

// AuthTypeController implements the auth_type resource.
type AuthTypeController struct {
	*goa.Controller
}

// NewAuthTypeController creates a auth_type controller.
func NewAuthTypeController(service *goa.Service) *AuthTypeController {
	return &AuthTypeController{Controller: service.NewController("AuthTypeController")}
}

// List runs the list action.
func (c *AuthTypeController) List(ctx *app.ListAuthTypeContext) error {
	// AuthTypeController_List: start_implement

	// Put your logic here
	res := &app.AuthType{
		AuthTypes: []string{
			"google",
			"idpassword",
		},
	}

	// AuthTypeController_List: end_implement
	return ctx.OK(res)
}

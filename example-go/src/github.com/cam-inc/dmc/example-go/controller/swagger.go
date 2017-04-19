package controller

import (
	"encoding/json"
	"fmt"

	_ "github.com/cam-inc/dmc/example-go/design"

	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/goadesign/goa"
	"github.com/goadesign/goa/design"
	"github.com/goadesign/goa/goagen/codegen"
	"github.com/goadesign/goa/goagen/gen_swagger"
)

// SwaggerController implements the swagger resource.
type SwaggerController struct {
	*goa.Controller
}

var swaggerAll *genswagger.Swagger

func init() {
	codegen.ParseDSL()
	sw, err := genswagger.New(design.Design)
	if err != nil {
		panic(err)
	}
	swaggerAll = sw
}

func filter(s genswagger.Swagger) genswagger.Swagger {
	if s.Paths != nil {
		for uri, v := range s.Paths {
			path, ok := v.(*genswagger.Path)
			if ok != true {
				continue
			}
			raw, err := json.Marshal(path)
			if err != nil {
				panic(err)
			}

			mt := map[string]interface{}{}
			json.Unmarshal(raw, &mt)
			for method := range mt {
				fmt.Printf("%s: %s\n", method, uri)
				// TODO: これでRoleと突き合わせできそう
			}
		}
	}
	return s
}

// NewSwaggerController creates a swagger controller.
func NewSwaggerController(service *goa.Service) *SwaggerController {
	return &SwaggerController{Controller: service.NewController("SwaggerController")}
}

// Show runs the show action.
func (c *SwaggerController) Show(ctx *app.ShowSwaggerContext) error {
	// DmcController_Show: start_implement

	// Put your logic here
	sw := filter(*swaggerAll)
	res, err := json.Marshal(&sw)
	if err != nil {
		panic(err)
	}

	// DmcController_Show: end_implement
	return ctx.OK(res)
}

package controller

import (
	"encoding/json"

	"github.com/cam-inc/dmc/example-go/service"

	"strings"

	"github.com/cam-inc/dmc/example-go/bridge"
	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	jwtgo "github.com/dgrijalva/jwt-go"
	"github.com/goadesign/goa"
	"github.com/goadesign/goa/goagen/gen_swagger"
)

func filter(s genswagger.Swagger, roles map[string][]string) genswagger.Swagger {
	if s.Paths != nil {
		for uri, p := range s.Paths {
			path, ok := p.(*genswagger.Path)
			if ok != true {
				continue
			}

			resource := strings.Split(uri, "/")[1]
			raw, _ := path.MarshalJSON()
			mt := map[string]interface{}{}
			json.Unmarshal(raw, &mt)

			for method := range mt {
				if roles[method] == nil || (common.InStringArray("*", roles[method]) < 0 && common.InStringArray(resource, roles[method]) < 0) {
					switch method {
					case "get":
						path.Get = nil
					case "options":
						path.Options = nil
					case "put":
						path.Put = nil
					case "post":
						path.Post = nil
					case "delete":
						path.Delete = nil
					}
				}
			}
		}
	}
	return s
}

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
	var sw genswagger.Swagger

	cl := ctx.Context.Value(bridge.JwtClaims)
	if cl == nil {
		// swagger.json自体に認証をかけていないときは全部返す
		sw = *swaggerAll
	} else {
		// JWTclaimsからRoleを取り出す
		var roles map[string][]string
		claims := cl.(jwtgo.MapClaims)
		json.Unmarshal([]byte(claims["roles"].(string)), &roles)
		sw = filter(*swaggerAll, roles)
	}
	if res, err := json.Marshal(&sw); err != nil {
		return ctx.InternalServerError()
	} else {
		return ctx.OK(res)
	}
}

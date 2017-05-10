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
					delete(mt, method)
				}
			}

			newRaw, _ := json.Marshal(&mt)
			var newPath genswagger.Path
			json.Unmarshal(newRaw, &newPath)

			if len(mt) <= 0 {
				delete(s.Paths, uri)
			} else {
				s.Paths[uri] = newPath
			}
		}
	}
	return s
}

func replaceSeparator(str string) string {
	return strings.Replace(str, "#", "@", -1)
}

// OperationIdに含まれる＃を＠に変換する
// クライアントサイドでoperationIdをフラグメントハッシュに渡すときに＃だと都合が悪いため。
func replaceOperationId(s genswagger.Swagger) genswagger.Swagger {
	if s.Paths != nil {
		for _, p := range s.Paths {
			if path, ok := p.(*genswagger.Path); ok != true {
				continue
			} else {
				if path.Get != nil {
					path.Get.OperationID = replaceSeparator(path.Get.OperationID)
				}
				if path.Put != nil {
					path.Put.OperationID = replaceSeparator(path.Put.OperationID)
				}
				if path.Post != nil {
					path.Post.OperationID = replaceSeparator(path.Post.OperationID)
				}
				if path.Delete != nil {
					path.Delete.OperationID = replaceSeparator(path.Delete.OperationID)
				}
				if path.Options != nil {
					path.Options.OperationID = replaceSeparator(path.Options.OperationID)
				}
				if path.Head != nil {
					path.Head.OperationID = replaceSeparator(path.Head.OperationID)
				}
				if path.Patch != nil {
					path.Patch.OperationID = replaceSeparator(path.Patch.OperationID)
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
	// DmcController_Show: start_implement

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
	// operationIdに含まれる#を＠に変換する
	sw = replaceOperationId(sw)
	res, err := json.Marshal(&sw)
	if err != nil {
		panic(err)
	}

	// DmcController_Show: end_implement
	return ctx.OK(res)
}

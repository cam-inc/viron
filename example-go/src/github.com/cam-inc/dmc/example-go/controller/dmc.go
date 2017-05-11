package controller

import (
	"encoding/json"

	"strings"

	"github.com/cam-inc/dmc/example-go/bridge"
	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	jwtgo "github.com/dgrijalva/jwt-go"
	"github.com/goadesign/goa"
)

// DmcController implements the dmc resource.
type DmcController struct {
	*goa.Controller
}

func apiFilter(pages []*app.Page, roles map[string][]string) []*app.Page {
	newPages := []*app.Page{}
	for _, page := range pages {
		newComponents := []*app.Component{}
		for _, component := range page.Components {
			api := component.API
			method := api.Method
			resource := strings.Split(api.Path, "/")[1]
			if roles[method] != nil && (common.InStringArray("*", roles[method]) >= 0 || common.InStringArray(resource, roles[method]) >= 0) {
				newComponents = append(newComponents, component)
			}
		}
		if len(newComponents) > 0 {
			// componentが1つもない場合はpageも返さない
			page.Components = newComponents
			newPages = append(newPages, page)
		}
	}
	return newPages
}

// NewDmcController creates a dmc controller.
func NewDmcController(service *goa.Service) *DmcController {
	return &DmcController{Controller: service.NewController("DmcController")}
}

// Show runs the show action.
func (c *DmcController) Show(ctx *app.ShowDmcContext) error {
	// DmcController_Show: start_implement

	// Put your logic here
	defaultOptions := []*app.Option{
		{
			Key: "key",
			Value: "value",
		},
	}

	api := func(path string, method string) *app.API {
		return &app.API{
			Path: path,
			Method: method,
		}
	}

	// DmcController_Show: end_implement
	res := &app.Dmc{
		Name:      "Example Project",
		Color:     bridge.ColorRed,
		Thumbnail: "https://avatars3.githubusercontent.com/u/23251378?v=3&s=200",
		Tags: []string{
			"develop",
			"dmc",
			"example",
		},
		Pages: []*app.Page{
			// Dashboard
			{
				ID:      "quickview",
				Name:    "クイックビュー",
				Section: bridge.SectionDashboard,
				Group:   bridge.GroupEmpty,
				Components: []*app.Component{
					{
						Name: "DAU",
						API: api("/stats/dau", "get"),
						Style: bridge.StyleNumber,
						Options: defaultOptions,
						Pagination: false,
					},
					{
						Name: "MAU",
						API: api("/stats/mau", "get"),
						Style: bridge.StyleNumber,
						Options: defaultOptions,
						Pagination: false,
					},
					{

						Name: "Planet",
						API: api("/stats/planet", "get"),
						Style: bridge.StyleGraphBar,
						Options: defaultOptions,
						Pagination: false,
					},
				},
			},
			// Manage
			{
				ID:      "user",
				Section: bridge.SectionManage,
				Group:   bridge.GroupUser,
				Name:    "ユーザ",
				Components: []*app.Component{
					{
						Name: "ユーザ",
						API: api("/user", "get"),
						Style: bridge.StyleTable,
						Query: []*app.Query{
							{
								Key:  "name",
								Type: "string",
							},
						},
						Options: defaultOptions,
						Pagination: false,
					},
				},
			},
			{
				ID:      "userblog",
				Section: bridge.SectionManage,
				Group:   bridge.GroupUser,
				Name:    "ユーザブログ",
				Components: []*app.Component{
					{
						Name: "ユーザーブログ",
						API: api("/userblog", "get"),
						Style: bridge.StyleTable,
						Options: defaultOptions,
						Pagination: true,
					},
				},
			},

			{
				ID:      "adminrole",
				Name:    "DMC ユーザー権限",
				Section: bridge.SectionManage,
				Group:   bridge.GroupEmpty,
				Components: []*app.Component{
					{
						Name: "DMC ユーザー権限",
						API: api("/adminrole", "get"),
						Style: bridge.StyleNumber,
						Options: defaultOptions,
						Pagination: false,
					},
				},
			},
			{
				ID:      "adminuser",
				Name:    "DMC ユーザー",
				Section: bridge.SectionManage,
				Group:   bridge.GroupBlog,
				Components: []*app.Component{
					{
						Name: "DMC ユーザー権限",
						API: api("/adminuser", "get"),
						Style: bridge.StyleNumber,
						Options: defaultOptions,
						Pagination: false,
					},
				},
			},
			{
				ID:      "auditlog",
				Name:    "DMC 監査ログ",
				Section: bridge.SectionManage,
				Group:   bridge.GroupAdmin,
				Components: []*app.Component{
					{
						Name: "DMC 監査ログ",
						API: api("/auditlog", "get"),
						Style: bridge.StyleTable,
						Options: defaultOptions,
						Pagination: true,
					},
				},
			},
		},
	}

	cl := ctx.Context.Value(bridge.JwtClaims)
	if cl != nil {
		// JWTclaimsからRoleを取り出す
		var roles map[string][]string
		claims := cl.(jwtgo.MapClaims)
		json.Unmarshal([]byte(claims["roles"].(string)), &roles)
		res.Pages = apiFilter(res.Pages, roles)
	}

	return ctx.OK(res)
}

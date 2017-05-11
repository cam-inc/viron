package controller

import (
	"encoding/json"
	"strings"

	"fmt"

	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	genModels "github.com/cam-inc/dmc/example-go/gen/models"
	"github.com/cam-inc/dmc/example-go/models"
	"github.com/cam-inc/dmc/example-go/service"
	"github.com/goadesign/goa"
	"github.com/goadesign/goa/goagen/gen_swagger"
	"github.com/jinzhu/gorm"
)

var pathList []string

func init() {
	sw := service.GetSwagger()
	for uri, p := range sw.Paths {
		if path, ok := p.(*genswagger.Path); ok != true {
			continue
		} else {
			resource := strings.Split(uri, "/")[1]
			raw, _ := path.MarshalJSON()
			mt := map[string]interface{}{}
			json.Unmarshal(raw, &mt)

			for method := range mt {
				rolePath := getRolePath(method, resource)
				if common.InStringArray(rolePath, pathList) < 0 {
					pathList = append(pathList, rolePath)
				}
			}
		}
	}
}

func getRolePath(method string, resource string) string {
	return fmt.Sprintf("%s:/%s", strings.ToUpper(method), resource)
}

func getResource(path string) (string, string) {
	p := strings.Split(path, ":/")
	return strings.ToUpper(p[0]), p[1]
}

func getAdminRolePathList(roleList []*genModels.AdminRole) map[string][]*app.Adminrolepath {
	// roleListを { [RoleID]: [path, path,,,] } に変換
	tmpRoles := map[string][]string{}
	for _, role := range roleList {
		if tmpRoles[role.RoleID] == nil {
			tmpRoles[role.RoleID] = []string{}
		}
		tmpRoles[role.RoleID] = append(tmpRoles[role.RoleID], getRolePath(role.Method, role.Resource))
	}

	// roleIDごとにadminRolePathListを回してroleListに含まれているものはtrue,含まれていないものはfalseにする
	res := map[string][]*app.Adminrolepath{}
	for roleID, paths := range tmpRoles {
		for _, p := range pathList {
			allow := false
			if common.InStringArray(p, paths) >= 0 {
				allow = true
			}
			res[roleID] = append(res[roleID], &app.Adminrolepath{
				Allow: allow,
				Path:  p,
			})
		}
	}
	return res
}

// AdminRoleController implements the admin_role resource.
type AdminRoleController struct {
	*goa.Controller
}

// NewAdminRoleController creates a admin_role controller.
func NewAdminRoleController(service *goa.Service) *AdminRoleController {
	return &AdminRoleController{Controller: service.NewController("AdminRoleController")}
}

// Create runs the create action.
func (c *AdminRoleController) Create(ctx *app.CreateAdminRoleContext) error {
	// AdminRoleController_Create: start_implement

	// Put your logic here
	paths := ctx.Payload.Paths
	data := []genModels.AdminRole{}
	for _, path := range paths {
		if path.Allow != true {
			continue
		}

		m := genModels.AdminRole{}
		m.Method, m.Resource = getResource(path.Path)
		data = append(data, m)
	}

	adminRoleTable := models.NewAdminRoleDB(common.DB)
	if err := adminRoleTable.CleanInsertByRoleID(ctx.Context, *ctx.Payload.RoleID, data); err != nil {
		return ctx.InternalServerError()
	}

	// AdminRoleController_Create: end_implement
	res := &app.AdminRole{}
	return ctx.OK(res)
}

// Delete runs the delete action.
func (c *AdminRoleController) Delete(ctx *app.DeleteAdminRoleContext) error {
	// AdminRoleController_Delete: start_implement

	// Put your logic here
	adminRoleTable := models.NewAdminRoleDB(common.DB)
	if err := adminRoleTable.DeleteByRoleID(ctx.Context, ctx.RoleID); err != nil {
		return ctx.InternalServerError()
	}

	// AdminRoleController_Delete: end_implement
	return ctx.NoContent()
}

// List runs the list action.
func (c *AdminRoleController) List(ctx *app.ListAdminRoleContext) error {
	// AdminRoleController_List: start_implement

	// Put your logic here
	pager := common.Pager{}
	pager.SetLimit(ctx.Limit)
	pager.SetOffset(ctx.Offset)

	adminRoleTable := models.NewAdminRoleDB(common.DB)
	list := adminRoleTable.ListPage(ctx.Context, pager.Limit, pager.Offset)
	tmp := getAdminRolePathList(list)
	var res []*app.AdminRole
	for roleId, arps := range tmp {
		res = append(res, &app.AdminRole{
			RoleID: roleId,
			Paths:  arps,
		})
	}
	count := adminRoleTable.CountRoleID(ctx.Context)

	pager.SetCount(uint64(count))
	pager.SetPaginationHeader(ctx.ResponseWriter)

	// AdminRoleController_List: end_implement
	return ctx.OK(res)
}

// Show runs the show action.
func (c *AdminRoleController) Show(ctx *app.ShowAdminRoleContext) error {
	// AdminRoleController_Show: start_implement

	// Put your logic here
	adminRoleTable := models.NewAdminRoleDB(common.DB)
	if list, err := adminRoleTable.ListByRoleID(ctx.Context, ctx.RoleID); err == gorm.ErrRecordNotFound {
		return ctx.NotFound()
	} else if err != nil {
		return ctx.InternalServerError()
	} else {
		tmp := getAdminRolePathList(list)
		res := &app.AdminRole{
			RoleID: ctx.RoleID,
			Paths:  tmp[ctx.RoleID],
		}
		return ctx.OK(res)
	}
}

// Update runs the update action.
func (c *AdminRoleController) Update(ctx *app.UpdateAdminRoleContext) error {
	// AdminRoleController_Update: start_implement

	// Put your logic here
	paths := ctx.Payload.Paths
	data := []genModels.AdminRole{}
	for _, path := range paths {
		if path.Allow != true {
			continue
		}

		m := genModels.AdminRole{}
		m.Method, m.Resource = getResource(path.Path)
		data = append(data, m)
	}

	adminRoleTable := models.NewAdminRoleDB(common.DB)
	if err := adminRoleTable.CleanInsertByRoleID(ctx.Context, ctx.RoleID, data); err != nil {
		return ctx.InternalServerError()
	}

	// AdminRoleController_Update: end_implement
	res := &app.AdminRole{}
	return ctx.OK(res)
}

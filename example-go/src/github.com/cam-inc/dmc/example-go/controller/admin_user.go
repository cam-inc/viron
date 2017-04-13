package controller

import (
	"crypto/rand"
	"encoding/base64"
	"io"

	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/cam-inc/dmc/example-go/models"
	"github.com/goadesign/goa"
	"github.com/jinzhu/gorm"

	"golang.org/x/crypto/scrypt"
)

// AdminUserController implements the admin_user resource.
type AdminUserController struct {
	*goa.Controller
}

// NewAdminUserController creates a admin_user controller.
func NewAdminUserController(service *goa.Service) *AdminUserController {
	return &AdminUserController{Controller: service.NewController("AdminUserController")}
}

// Create runs the create action.
func (c *AdminUserController) Create(ctx *app.CreateAdminUserContext) error {
	// AdminUserController_Create: start_implement

	// Put your logic here
	adminUserTable := models.NewAdminUserDB(common.DB)
	m := models.NewAdminUser()
	m.LoginID = *ctx.Payload.LoginID

	// generate password hash with salt
	ary := make([]byte, 32)
	_, err := io.ReadFull(rand.Reader, ary)
	if err != nil {
		panic(err)
	}
	salt := base64.StdEncoding.EncodeToString(ary)
	passwordHash, err := scrypt.Key([]byte(*ctx.Payload.Password), []byte(salt), 16384, 8, 1, 64)
	if err != nil {
		panic(err)
	}
	m.Salt = salt
	m.Password = base64.StdEncoding.EncodeToString(passwordHash)
	m.RoleID = "viewer"

	err = adminUserTable.Add(ctx.Context, &m)
	if err != nil {
		panic(err)
	}

	// AdminUserController_Create: end_implement
	res := &app.AdminUser{
		LoginID: m.LoginID,
		RoleID:  &m.RoleID,
	}
	return ctx.OK(res)
}

// Delete runs the delete action.
func (c *AdminUserController) Delete(ctx *app.DeleteAdminUserContext) error {
	// AdminUserController_Delete: start_implement

	// Put your logic here
	adminUserTable := models.NewAdminUserDB(common.DB)
	err := adminUserTable.Delete(ctx.Context, ctx.ID)
	if err != nil {
		panic(err)
	}

	// AdminUserController_Delete: end_implement
	return ctx.NoContent()
}

// List runs the list action.
func (c *AdminUserController) List(ctx *app.ListAdminUserContext) error {
	// AdminUserController_List: start_implement

	// Put your logic here
	adminUserTable := models.NewAdminUserDB(common.DB)
	list := adminUserTable.ListAdminUser(ctx.Context)
	// AdminUserController_List: end_implement

	return ctx.OK(list)
}

// Show runs the show action.
func (c *AdminUserController) Show(ctx *app.ShowAdminUserContext) error {
	// AdminUserController_Show: start_implement

	// Put your logic here
	adminUserTable := models.NewAdminUserDB(common.DB)
	m, err := adminUserTable.OneAdminUser(ctx.Context, ctx.ID)
	if err == gorm.ErrRecordNotFound {
		return ctx.NotFound()
	} else if err != nil {
		panic(err)
	}

	// AdminUserController_Show: end_implement
	return ctx.OK(m)
}

// Update runs the update action.
func (c *AdminUserController) Update(ctx *app.UpdateAdminUserContext) error {
	// AdminUserController_Update: start_implement

	// Put your logic here
	adminUserTable := models.NewAdminUserDB(common.DB)
	m, err := adminUserTable.Get(ctx.Context, ctx.ID)
	if err == gorm.ErrRecordNotFound {
		return ctx.NotFound()
	} else if err != nil {
		panic(err)
	}

	if &ctx.Payload.Password != nil {
		m.Password = *ctx.Payload.Password
	}
	if &ctx.Payload.RoleID != nil {
		m.RoleID = *ctx.Payload.RoleID
	}
	err = adminUserTable.Update(ctx.Context, m)
	if err != nil {
		panic(err)
	}

	r, err := adminUserTable.OneAdminUser(ctx.Context, ctx.ID)
	if err != nil {
		panic(err)
	}

	// AdminUserController_Update: end_implement
	return ctx.OK(r)
}

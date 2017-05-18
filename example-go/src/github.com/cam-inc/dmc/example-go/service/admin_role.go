package service

import (
	"context"

	"github.com/cam-inc/dmc/example-go/common"
	genModels "github.com/cam-inc/dmc/example-go/gen/models"
	"github.com/cam-inc/dmc/example-go/models"
)

func CreateDefaultRole(ctx context.Context) error {
	adminRoleTable := models.NewAdminRoleDB(models.DB)
	m := models.NewAdminRole()
	m.RoleID = common.GetDefaultRole()
	m.Method = "GET"
	m.Resource = "*"

	var native genModels.AdminRole
	return adminRoleTable.Db.Table(adminRoleTable.TableName()).FirstOrCreate(&native, m).Error
}

package domains

import (
	"github.com/cam-inc/viron/packages/golang/errors"
	"github.com/stretchr/testify/assert"
	"net/http"
	"testing"
)

func setUpRole() {
	if err := NewFile("./test_casbin"); err != nil {
		panic(err)
	}
}

func TestValidateRoleAndPermissions(t *testing.T) {
	tests := []struct {
		Title       string
		RoleId      string
		Permissions []*AdminRolePermission
		Expected    bool
		Err         *errors.VironError
	}{
		{
			Title:  "Role id with commas.",
			RoleId: "role_00001_,",
			Permissions: []*AdminRolePermission{
				{
					ResourceID: "resource_00001",
					Permission: "read",
				},
			},
			Err: errors.Initialize(http.StatusBadRequest, "role id cannot contain commas."),
		},
		{
			Title:  "Resource id with commas.",
			RoleId: "role_00002",
			Permissions: []*AdminRolePermission{
				{
					ResourceID: "resource_00002_,",
					Permission: "read",
				},
			},
			Err: errors.Initialize(http.StatusBadRequest, "policy resource id cannot contain commas."),
		},
		{
			Title:  "Permission with commas.",
			RoleId: "role_00003",
			Permissions: []*AdminRolePermission{
				{
					ResourceID: "resource_00003",
					Permission: "read_,",
				},
			},
			Err: errors.Initialize(http.StatusBadRequest, "policy permission cannot contain commas."),
		},
		{
			Title:  "No commas.",
			RoleId: "role_00004",
			Permissions: []*AdminRolePermission{
				{
					ResourceID: "resource_00004",
					Permission: "read",
				},
			},
			Err: nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.Title, func(t *testing.T) {
			if err := ValidateRoleAndPermissions(tt.RoleId, tt.Permissions); err != nil {
				assert.EqualError(t, err, tt.Err.Error())
			} else {
				assert.Equal(t, tt.Err, err)
			}
		})
	}
}

package domains

import (
	"context"
	"testing"

	"github.com/cam-inc/viron/packages/golang/helpers"

	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/stretchr/testify/assert"

	"github.com/cam-inc/viron/packages/golang/repositories"

	"github.com/cam-inc/viron/packages/golang/repositories/container"
	"github.com/cam-inc/viron/packages/golang/repositories/mock"
)

func TestCreateAdminUser(t *testing.T) {
	setUpRole()

	pass := "pass"
	email := "test@example.com"
	payload := &AdminUser{
		ID:       "0",
		Email:    email,
		Password: &pass,
	}
	adminEntity := &repositories.AdminUserEntity{
		ID:    "0",
		Email: email,
	}
	f := mock.MockFunc{
		FindOne: func(ctx context.Context, s string) (repositories.Entity, error) {
			return nil, nil
		},
		Find: func(ctx context.Context, conditions repositories.Conditions) (repositories.EntitySlice, error) {
			return nil, nil
		},
		Count: func(ctx context.Context, conditions repositories.Conditions) int {
			return 0
		},
		CreateOne: func(ctx context.Context, entity repositories.Entity) (repositories.Entity, error) {
			p := helpers.GenPassword(pass, "")
			adminEntity.Password = &p.Password
			adminEntity.Salt = &p.Salt
			return adminEntity, nil
		},
		UpdateByID: func(ctx context.Context, s string, entity repositories.Entity) error {
			return nil
		},
		RemoveByID: func(ctx context.Context, s string) error {
			return nil
		},
	}
	if err := container.SetUpMock(map[string]mock.MockFunc{
		"adminusers": f,
	}); err != nil {
		t.Fatal(err)
	}
	createdUser, err := CreateAdminUser(context.Background(), payload, constant.AUTH_TYPE_EMAIL)
	assert.Nil(t, err)
	assert.NotNil(t, createdUser)

	payload.Password = adminEntity.Password
	payload.Password = adminEntity.Salt

	assert.Equal(t, createdUser, payload)
}

func TestRemoveAdminUser(t *testing.T) {
	// TODO: テストするためには、casbinInstanceを使っている箇所をmock化する必要がある
	// https://github.com/cam-inc/viron/blob/83a4ef0e2b58a6bba3b580d626bf697724325a35/packages/golang/domains/adminusers.go#L275
	// https://github.com/cam-inc/viron/blob/next-golang/packages/golang/domains/adminusers.go
}

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
	container.SetUpMock(map[string]mock.MockFunc{
		"adminusers": f,
	})
	createdUser, err := CreateAdminUser(context.Background(), payload, constant.AUTH_TYPE_EMAIL)
	assert.Nil(t, err)
	assert.NotNil(t, createdUser)

	payload.Password = adminEntity.Password
	payload.Password = adminEntity.Salt

	assert.Equal(t, createdUser, payload)
}

func TestRemoveAdminUser(t *testing.T) {
	// TODO: casbinInstanceを使ってる箇所をtestできるようにする
	// https://github.com/cam-inc/viron/blob/next-golang/packages/golang/domains/adminusers.go

	//setUpRole()
	//
	//id := "xxxxxxxxxxxxxxxx"
	//pass := "pass"
	//email := "test@example.com"
	//adminUser := &repositories.AdminUserEntity{
	//	ID:       id,
	//	Email:    email,
	//	Password: &pass,
	//}
	//f := mock.MockFunc{
	//	Find: func(ctx context.Context, conditions repositories.Conditions) (repositories.EntitySlice, error) {
	//		var results repositories.EntitySlice
	//		results = append(results, adminUser)
	//		return results, nil
	//	},
	//	RemoveByID: func(ctx context.Context, s string) error {
	//		return nil
	//	},
	//}
	//container.SetUpMock(map[string]mock.MockFunc{
	//	"adminusers": f,
	//})
	//
	//// 実行
	//err := RemoveAdminUserById(context.Background(), id)
	//
	//// 検証
	//assert.Nil(t, err)
}

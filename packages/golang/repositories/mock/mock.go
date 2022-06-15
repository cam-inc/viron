package mock

import (
	"context"

	"github.com/cam-inc/viron/packages/golang/repositories"
)

type (
	MockRepository struct {
		f MockFunc
	}

	MockFunc struct {
		FindOne    func(context.Context, string) (repositories.Entity, error)
		Find       func(context.Context, repositories.Conditions) (repositories.EntitySlice, error)
		Count      func(context.Context, repositories.Conditions) int
		CreateOne  func(context.Context, repositories.Entity) (repositories.Entity, error)
		UpdateByID func(context.Context, string, repositories.Entity) error
		RemoveByID func(context.Context, string) error
	}
)

func (m *MockRepository) FindOne(ctx context.Context, s string) (repositories.Entity, error) {
	return m.f.FindOne(ctx, s)
}

func (m *MockRepository) Find(ctx context.Context, conditions repositories.Conditions) (repositories.EntitySlice, error) {
	return m.f.Find(ctx, conditions)
}

func (m *MockRepository) Count(ctx context.Context, conditions repositories.Conditions) int {
	return m.f.Count(ctx, conditions)
}

func (m *MockRepository) CreateOne(ctx context.Context, entity repositories.Entity) (repositories.Entity, error) {
	return m.f.CreateOne(ctx, entity)
}

func (m *MockRepository) UpdateByID(ctx context.Context, s string, entity repositories.Entity) error {
	return m.f.UpdateByID(ctx, s, entity)
}

func (m *MockRepository) RemoveByID(ctx context.Context, s string) error {
	return m.f.RemoveByID(ctx, s)
}

func New(f MockFunc) repositories.Repository {
	return &MockRepository{
		f,
	}
}

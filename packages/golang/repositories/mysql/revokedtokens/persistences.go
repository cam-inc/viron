package revokedtokens

import (
	"context"
	"database/sql"

	"github.com/cam-inc/viron/packages/golang/repositories"
)

type revokedTokensPersistence struct {
	conn *sql.DB
}

func (r *revokedTokensPersistence) FindOne(ctx context.Context, id string) (repositories.Entity, error) {
	panic("implement me")
}

func (r *revokedTokensPersistence) Find(ctx context.Context, conditions repositories.Conditions) (repositories.EntitySlice, error) {
	panic("implement me")
}

func (r *revokedTokensPersistence) Count(ctx context.Context, conditions repositories.Conditions) int {
	panic("implement me")
}

func (r *revokedTokensPersistence) CreateOne(ctx context.Context, entity repositories.Entity) (repositories.Entity, error) {
	panic("implement me")
}

func (r *revokedTokensPersistence) UpdateByID(ctx context.Context, id string, entity repositories.Entity) error {
	panic("implement me")
}

func (r *revokedTokensPersistence) RemoveByID(ctx context.Context, id string) error {
	panic("implement me")
}

func New(db *sql.DB) repositories.Repository {
	return &revokedTokensPersistence{
		conn: db,
	}
}

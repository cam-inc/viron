package auditlogs

import (
	"context"
	"database/sql"

	"github.com/cam-inc/viron/packages/golang/repositories"
)

type auditLogsPersistence struct {
	conn *sql.DB
}

func (a *auditLogsPersistence) FindOne(ctx context.Context, id string) (repositories.Entity, error) {
	panic("implement me")
}

func (a *auditLogsPersistence) Find(ctx context.Context, conditions repositories.Conditions) (repositories.EntitySlice, error) {
	panic("implement me")
}

func (a *auditLogsPersistence) Count(ctx context.Context, conditions repositories.Conditions) int {
	panic("implement me")
}

func (a *auditLogsPersistence) CreateOne(ctx context.Context, entity repositories.Entity) (repositories.Entity, error) {
	panic("implement me")
}

func (a *auditLogsPersistence) UpdateByID(ctx context.Context, id string, entity repositories.Entity) error {
	panic("implement me")
}

func (a *auditLogsPersistence) RemoveByID(ctx context.Context, id string) error {
	panic("implement me")
}

func New(db *sql.DB) repositories.Repository {
	return &auditLogsPersistence{}
}

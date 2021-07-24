package auditlogs

import (
	"database/sql"

	"github.com/viron/packages/golang/repositories"
)

type auditLogsPersistence struct {
	conn *sql.DB
}

func (a *auditLogsPersistence) FindOne(s string) (repositories.Entity, error) {
	panic("implement me")
}

func (a *auditLogsPersistence) Find(conditions repositories.Conditions) (repositories.EntitySlice, error) {
	panic("implement me")
}

func (a *auditLogsPersistence) Count(conditions repositories.Conditions) int {
	panic("implement me")
}

func (a *auditLogsPersistence) CreateOne(entity repositories.Entity) error {
	panic("implement me")
}

func (a *auditLogsPersistence) UpdateByID(s string, entity repositories.Entity) error {
	panic("implement me")
}

func (a *auditLogsPersistence) RemoveByID(s string) error {
	panic("implement me")
}

func New(db *sql.DB) repositories.Repository {
	return &auditLogsPersistence{}
}

package repositories

import (
	"context"
	"database/sql"

	"github.com/viron/packages/golang/repositories/mysql/adminusers"
	"github.com/viron/packages/golang/repositories/mysql/auditlogs"
	"github.com/viron/packages/golang/repositories/mysql/revokedtokens"

	"github.com/volatiletech/sqlboiler/queries/qm"
)

type (
	Conditions interface {
		ConvertConditionMySQL() []qm.QueryMod
	}

	Entity interface {
		Bind(interface{}) error
	}

	EntitySlice []Entity

	Repository interface {
		FindOne(context.Context, string) (Entity, error)
		Find(context.Context, Conditions) (EntitySlice, error)
		Count(context.Context, Conditions) int
		CreateOne(context.Context, Entity) error
		UpdateByID(context.Context, string, Entity) error
		RemoveByID(context.Context, string) error
	}
)

var (
	repogitories map[string]Repository
)

func NewMySQL(db *sql.DB) error {
	repogitories = map[string]Repository{}
	repogitories["adminusers"] = adminusers.New(db)
	repogitories["auditlogs"] = auditlogs.New(db)
	repogitories["revokedtokens"] = revokedtokens.New(db)
	return nil
}

func GetRepository(name string) Repository {
	if r, exists := repogitories[name]; exists {
		return r
	}
	return nil
}

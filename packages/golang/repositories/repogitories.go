package repositories

import (
	"context"

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

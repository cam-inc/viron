package repositories

import (
	"time"

	"github.com/volatiletech/sqlboiler/queries/qm"
)

type (
	RevokedToken struct {
		ID        uint
		Token     string
		RevokedAt time.Time
		CreatedAt time.Time
		UpdatedAt time.Time
	}

	RevokedTokenOptions struct {
		*RevokedToken
	}
)

func (revoked *RevokedToken) Bind(b interface{}) error {
	panic("")
}

func (op *RevokedTokenOptions) ConvertConditionMySQL() []qm.QueryMod {
	q := []qm.QueryMod{}
	return q
}

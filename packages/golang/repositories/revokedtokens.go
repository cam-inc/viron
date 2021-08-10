package repositories

import (
	"fmt"
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
	revoked, ok := b.(*RevokedToken)
	if !ok {
		return fmt.Errorf("revoked bind failed")
	}
	*revoked = *revoked
	return nil
}

func (op *RevokedTokenOptions) ConvertConditionMySQL() []qm.QueryMod {
	q := []qm.QueryMod{}
	return q
}

package repositories

import (
	"time"

	"github.com/volatiletech/sqlboiler/queries/qm"
)

type (
	AuditLog struct {
		ID            uint
		RequestMethod *string
		RequestUri    *string
		SourceIp      *string
		UserId        *string
		RequestBody   *string
		StatusCode    *uint
		CreatedAt     time.Time
		UpdatedAt     time.Time
	}
	AuditLogOptions struct {
		*AuditLog
	}
)

func (audit *AuditLog) Bind(b interface{}) error {
	panic("")
}

func (op *AuditLogOptions) ConvertConditionMySQL() []qm.QueryMod {
	q := []qm.QueryMod{}
	return q
}

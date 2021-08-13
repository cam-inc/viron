package repositories

import (
	"fmt"
	"time"

	"github.com/cam-inc/viron/packages/golang/repositories/mysql"

	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

type (
	AuditLog struct {
		ID            uint      `json:"id"`
		RequestMethod *string   `json:"requestMethod"`
		RequestUri    *string   `json:"requestUri"`
		SourceIp      *string   `json:"sourceIp"`
		UserId        *string   `json:"userId"`
		RequestBody   *string   `json:"requestBody"`
		StatusCode    *uint     `json:"statusCode"`
		CreatedAt     time.Time `json:"-"`
		CreatedAtInt  int64     `json:"createdAt"`
		UpdatedAt     time.Time `json:"-"`
		UpdatedAtInt  int64     `json:"updatedAt"`
	}
	AuditLogOptions struct {
		*AuditLog
		Size int
		Page int
		Sort []string
	}
)

func (audit *AuditLog) Bind(b interface{}) error {
	d, ok := b.(*AuditLog)
	if !ok {
		return fmt.Errorf("audit bind failed")
	}
	*d = *audit
	return nil
}

func (op *AuditLogOptions) ConvertConditionMongoDB() []interface{} {
	panic("implement me")
}

func (op *AuditLogOptions) ConvertConditionMySQL() []qm.QueryMod {
	conditions := []qm.QueryMod{}
	if op.ID != 0 {
		conditions = append(conditions, qm.Where("id = ?", op.ID))
	}

	if op.RequestMethod != nil {
		conditions = append(conditions, qm.Where("requestMethod = ?", *op.RequestMethod))
	}

	if op.RequestUri != nil {
		conditions = append(conditions, qm.Where("requestUri = ?", *op.RequestUri))
	}

	if op.SourceIp != nil {
		conditions = append(conditions, qm.Where("sourceIp = ?", *op.SourceIp))
	}

	if op.UserId != nil {
		conditions = append(conditions, qm.Where("userId = ?", *op.UserId))
	}

	if op.RequestBody != nil {
		conditions = append(conditions, qm.Where("requestBody = ?", *op.RequestBody))
	}

	if op.StatusCode != nil {
		conditions = append(conditions, qm.Where("statusCode = ?", *op.StatusCode))
	}

	if len(op.Sort) > 0 {
		conditions = append(conditions, mysql.GetOrderBy(op.Sort))
	}

	pager := mysql.GetPager(op.Size, op.Page)

	conditions = append(conditions, qm.Limit(pager.Limit))
	conditions = append(conditions, qm.Offset(pager.Offset))

	return conditions
}

func NewAuditLogOptions(audit *AuditLog, size, page int, sort []string) Conditions {
	return &AuditLogOptions{
		AuditLog: audit,
		Size:     size,
		Page:     page,
		Sort:     sort,
	}
}

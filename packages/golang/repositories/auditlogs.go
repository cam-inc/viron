package repositories

import (
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"go.mongodb.org/mongo-driver/mongo/options"

	"go.mongodb.org/mongo-driver/bson"

	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

type (
	AuditLogEntity struct {
		ID            string             `json:"id" bson:"-"`
		OID           primitive.ObjectID `json:"-" bson:"_id"`
		RequestMethod *string            `json:"requestMethod" bson:"requestMethod,omitempty"`
		RequestUri    *string            `json:"requestUri" bson:"requestUri,omitempty"`
		SourceIp      *string            `json:"sourceIp" bson:"sourceIp,omitempty"`
		UserID        *string            `json:"userId" bson:"userId,omitempty"`
		RequestBody   *string            `json:"requestBody" bson:"requestBody,omitempty"`
		StatusCode    *uint              `json:"statusCode" bson:"statusCode,omitempty"`
		CreatedAt     time.Time          `json:"-" bson:"-"`
		CreatedAtInt  int                `json:"createdAt" bson:"createdAt"`
		UpdatedAt     time.Time          `json:"-" bson:"-"`
		UpdatedAtInt  int                `json:"updatedAt" bson:"updatedAt"`
	}
	AuditLogConditions struct {
		*AuditLogEntity
		*options.FindOptions
		*Paginate
	}
)

func (audit *AuditLogEntity) Bind(b interface{}) error {
	d, ok := b.(*AuditLogEntity)
	if !ok {
		return fmt.Errorf("audit bind failed")
	}
	*d = *audit
	return nil
}

func (op *AuditLogConditions) ConvertConditionMongoDB() *MongoConditions {
	conditions := &MongoConditions{}

	m := bson.M{}

	if op.ID != "" {
		m["_id"], _ = primitive.ObjectIDFromHex(op.ID)
	}

	if op.RequestMethod != nil {
		m["requestMethod"] = op.RequestMethod
	}

	if op.RequestUri != nil {
		m["requestUri"] = op.RequestUri
	}

	if op.SourceIp != nil {
		m["sourceIp"] = op.SourceIp
	}

	if op.UserID != nil {
		m["userId"] = op.UserID
	}

	if op.RequestBody != nil {
		m["requestBody"] = op.RequestBody
	}

	if op.StatusCode != nil {
		m["statusCode"] = op.StatusCode
	}

	conditions.Filter = m

	if op.FindOptions == nil {
		op.FindOptions = options.Find()
	}

	pager := op.ConvertPager()
	paginator := pager.PaginateMongo()
	op.FindOptions = options.MergeFindOptions(op.FindOptions, paginator)

	conditions.FindOptions = op.FindOptions

	return conditions
}

func (op *AuditLogConditions) ConvertConditionMySQL() []qm.QueryMod {
	conditions := []qm.QueryMod{}
	if op.ID != "" {
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

	if op.UserID != nil {
		conditions = append(conditions, qm.Where("userId = ?", *op.UserID))
	}

	if op.RequestBody != nil {
		conditions = append(conditions, qm.Where("requestBody = ?", *op.RequestBody))
	}

	if op.StatusCode != nil {
		conditions = append(conditions, qm.Where("statusCode = ?", *op.StatusCode))
	}

	return conditions
}

func NewAuditLogConditions(audit *AuditLogEntity, size, page int, sort []string) Conditions {
	return &AuditLogConditions{
		AuditLogEntity: audit,
		Paginate: &Paginate{
			Size: size,
			Page: page,
			Sort: sort,
		},
	}
}

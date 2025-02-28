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
		ID            string             `bson:"-"`
		OID           primitive.ObjectID `bson:"_id"`
		RequestMethod *string            `bson:"requestMethod,omitempty"`
		RequestUri    *string            `bson:"requestUri,omitempty"`
		SourceIp      *string            `bson:"sourceIp,omitempty"`
		UserID        *string            `bson:"userId,omitempty"`
		RequestBody   *string            `bson:"requestBody,omitempty"`
		StatusCode    *int               `bson:"statusCode,omitempty"`
		CreatedAt     time.Time          `bson:"-"`
		CreatedAtInt  int                `bson:"createdAt"`
		UpdatedAt     time.Time          `bson:"-"`
		UpdatedAtInt  int                `bson:"updatedAt"`
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

func (c *AuditLogConditions) ConvertConditionMongoDB() *MongoConditions {
	conditions := &MongoConditions{}

	m := bson.M{}

	if c.ID != "" {
		if objID, err := primitive.ObjectIDFromHex(c.ID); err == nil {
			m["_id"] = objID
		}
	}

	if c.RequestMethod != nil {
		m["requestMethod"] = *c.RequestMethod
	}

	if c.RequestUri != nil {
		m["requestUri"] = *c.RequestUri
	}

	if c.SourceIp != nil {
		m["sourceIp"] = *c.SourceIp
	}

	if c.UserID != nil {
		m["userId"] = *c.UserID
	}

	if c.RequestBody != nil {
		m["requestBody"] = *c.RequestBody
	}

	if c.StatusCode != nil {
		m["statusCode"] = *c.StatusCode
	}

	conditions.Filter = m

	if c.FindOptions == nil {
		c.FindOptions = options.Find()
	}

	// Paginatorの値を個別にセット
	pager := c.ConvertPager()
	paginator := pager.PaginateMongo()

	if paginator.Limit != nil {
		c.FindOptions.Limit = paginator.Limit
	}
	if paginator.Skip != nil {
		c.FindOptions.Skip = paginator.Skip
	}
	if paginator.Sort != nil {
		c.FindOptions.Sort = paginator.Sort
	}

	conditions.FindOptions = c.FindOptions

	return conditions
}

func (c *AuditLogConditions) ConvertConditionMySQL() []qm.QueryMod {
	conditions := []qm.QueryMod{}
	if c.ID != "" {
		conditions = append(conditions, qm.Where("id = ?", c.ID))
	}

	if c.RequestMethod != nil {
		conditions = append(conditions, qm.Where("requestMethod = ?", *c.RequestMethod))
	}

	if c.RequestUri != nil {
		conditions = append(conditions, qm.Where("requestUri = ?", *c.RequestUri))
	}

	if c.SourceIp != nil {
		conditions = append(conditions, qm.Where("sourceIp = ?", *c.SourceIp))
	}

	if c.UserID != nil {
		conditions = append(conditions, qm.Where("userId = ?", *c.UserID))
	}

	if c.RequestBody != nil {
		conditions = append(conditions, qm.Where("requestBody = ?", *c.RequestBody))
	}

	if c.StatusCode != nil {
		conditions = append(conditions, qm.Where("statusCode = ?", *c.StatusCode))
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

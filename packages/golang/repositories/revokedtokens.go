package repositories

import (
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"go.mongodb.org/mongo-driver/bson"

	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

type (
	RevokedTokenEntity struct {
		ID           string             `bson:"-"`
		OID          primitive.ObjectID `bson:"_id"`
		Token        string             `bson:"token"`
		RevokedAt    time.Time          `bson:"-"`
		RevokedAtInt int                `bson:"revokedAt"`
		CreatedAt    time.Time          `bson:"-"`
		CreatedAtInt int                `bson:"createdAt"`
		UpdatedAt    time.Time          `bson:"-"`
		UpdatedAtInt int                `bson:"updatedAt"`
	}

	RevokedTokenConditions struct {
		*RevokedTokenEntity
		*Paginate
	}
)

func (revoked *RevokedTokenEntity) Bind(b interface{}) error {
	d, ok := b.(*RevokedTokenEntity)
	if !ok {
		return fmt.Errorf("revoked bind failed")
	}
	*d = *revoked
	return nil
}

var _ Conditions = &RevokedTokenConditions{}

func (c *RevokedTokenConditions) ConvertConditionMongoDB() *MongoConditions {
	conditions := &MongoConditions{}
	m := bson.M{}
	if c.Token != "" {
		m["token"] = c.Token
	}
	conditions.Filter = m
	return conditions
}

func (c *RevokedTokenConditions) ConvertConditionMySQL() []qm.QueryMod {
	conditions := []qm.QueryMod{}
	if c.Token != "" {
		conditions = append(conditions, qm.Where("token = ?", c.Token))
	}
	return conditions
}

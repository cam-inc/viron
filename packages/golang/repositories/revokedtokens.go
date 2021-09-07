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
		RevokedAtInt int64              `bson:"revokedAt"`
		CreatedAt    time.Time          `bson:"-"`
		CreatedAtInt int64              `bson:"createdAt"`
		UpdatedAt    time.Time          `bson:"-"`
		UpdatedAtInt int64              `bson:"updatedAt"`
	}

	RevokedTokenConditions struct {
		*RevokedTokenEntity
		*Paginate
	}
)

var _ Conditions = &RevokedTokenConditions{}

func (op *RevokedTokenConditions) ConvertConditionMongoDB() *MongoConditions {
	conditions := &MongoConditions{}
	m := bson.M{}
	if op.Token != "" {
		m["token"] = op.Token
	}
	conditions.Filter = m
	return conditions
}

func (revoked *RevokedTokenEntity) Bind(b interface{}) error {
	d, ok := b.(*RevokedTokenEntity)
	if !ok {
		return fmt.Errorf("revoked bind failed")
	}
	*d = *revoked
	return nil
}

func (op *RevokedTokenConditions) ConvertConditionMySQL() []qm.QueryMod {
	conditions := []qm.QueryMod{}
	if op.Token != "" {
		conditions = append(conditions, qm.Where("token = ?", op.Token))
	}
	return conditions
}

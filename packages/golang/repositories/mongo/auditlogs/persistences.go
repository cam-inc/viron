package auditlogs

import (
	"context"
	"time"

	"github.com/cam-inc/viron/packages/golang/helpers"

	"go.mongodb.org/mongo-driver/bson"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/cam-inc/viron/packages/golang/repositories"
	"github.com/cam-inc/viron/packages/golang/repositories/mongo"
)

type (
	auditLogsPersistence struct {
		client *mongo.Client
	}
)

const (
	collectionName = "auditlogs"
)

func (a *auditLogsPersistence) FindOne(ctx context.Context, s string) (repositories.Entity, error) {
	panic("implement me")
}

func (a *auditLogsPersistence) Find(ctx context.Context, conditions repositories.Conditions) (repositories.EntitySlice, error) {
	cond := conditions.ConvertConditionMongoDB()
	cur, err := a.client.Collection(collectionName).Find(ctx, cond.Filter, cond.FindOptions)
	if err != nil {
		return nil, err
	}
	var results repositories.EntitySlice
	for cur.Next(ctx) {
		auditLog := &repositories.AuditLogEntity{}
		if err := cur.Decode(auditLog); err != nil {
			return nil, err
		}
		auditLog.ID = auditLog.OID.Hex()
		auditLog.CreatedAt = helpers.UnixToTime(auditLog.CreatedAtInt)
		auditLog.UpdatedAt = helpers.UnixToTime(auditLog.UpdatedAtInt)
		results = append(results, auditLog)
	}

	if results == nil {
		return nil, nil
	}
	return results, nil
}

func (a *auditLogsPersistence) Count(ctx context.Context, conditions repositories.Conditions) int {
	cond := &repositories.MongoConditions{
		Filter: bson.D{},
	}
	if conditions != nil {
		cond = conditions.ConvertConditionMongoDB()
	}
	count, err := a.client.Collection(collectionName).CountDocuments(ctx, cond.Filter)
	if err != nil {
		return 0
	}
	return int(count)
}

func (a *auditLogsPersistence) CreateOne(ctx context.Context, entity repositories.Entity) (repositories.Entity, error) {

	audit := &repositories.AuditLogEntity{}
	if err := entity.Bind(audit); err != nil {
		return nil, err
	}

	audit.OID = primitive.NewObjectID()

	now := time.Now().Unix()
	audit.CreatedAtInt = int(now)
	audit.UpdatedAtInt = int(now)
	response, err := a.client.Collection(collectionName).InsertOne(ctx, audit)
	if err != nil {
		return nil, err
	}

	result := &repositories.AuditLogEntity{}
	if err := a.client.Collection(collectionName).FindOne(ctx, bson.D{{"_id", response.InsertedID}}).Decode(result); err != nil {
		return nil, err
	}

	return result, nil

}

func (a *auditLogsPersistence) UpdateByID(ctx context.Context, s string, entity repositories.Entity) error {
	panic("implement me")
}

func (a *auditLogsPersistence) RemoveByID(ctx context.Context, s string) error {
	panic("implement me")
}

func New(client *mongo.Client) repositories.Repository {
	return &auditLogsPersistence{
		client: client,
	}
}

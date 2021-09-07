package revokedtokens

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	mongoDriver "go.mongodb.org/mongo-driver/mongo"

	"github.com/cam-inc/viron/packages/golang/repositories"
	"github.com/cam-inc/viron/packages/golang/repositories/mongo"
)

type (
	revokedTokensPersistence struct {
		client *mongo.Client
	}
)

const (
	collectionName = "revokedtokens"
)

func (r *revokedTokensPersistence) FindOne(ctx context.Context, token string) (repositories.Entity, error) {
	cond := &repositories.RevokedTokenConditions{
		RevokedTokenEntity: &repositories.RevokedTokenEntity{
			Token: token,
		},
	}

	results, err := r.Find(ctx, cond)
	if err != nil {
		return nil, err
	}
	if len(results) == 0 {
		return nil, mongoDriver.ErrNoDocuments
	}

	return results[0], nil
}

func (r *revokedTokensPersistence) Find(ctx context.Context, conditions repositories.Conditions) (repositories.EntitySlice, error) {
	cond := conditions.ConvertConditionMongoDB()
	cur, err := r.client.Collection(collectionName).Find(ctx, cond.Filter, cond.FindOptions)
	if err != nil {
		return nil, err
	}
	var results repositories.EntitySlice
	for cur.Next(ctx) {
		revokedToken := &repositories.RevokedTokenEntity{}
		if err := cur.Decode(revokedToken); err != nil {
			return nil, err
		}
		revokedToken.ID = revokedToken.OID.Hex()
		results = append(results, revokedToken)
	}

	if results == nil {
		return nil, nil
	}
	return results, nil
}

func (r *revokedTokensPersistence) Count(ctx context.Context, conditions repositories.Conditions) int {
	panic("implement me")
}

func (r *revokedTokensPersistence) CreateOne(ctx context.Context, entity repositories.Entity) (repositories.Entity, error) {
	revokedToken := &repositories.RevokedTokenEntity{}
	if err := entity.Bind(revokedToken); err != nil {
		return nil, err
	}

	revokedToken.RevokedAtInt = revokedToken.RevokedAt.Unix()

	now := time.Now().Unix()
	revokedToken.CreatedAtInt = now
	revokedToken.UpdatedAtInt = now
	response, err := r.client.Collection(collectionName).InsertOne(ctx, revokedToken)
	if err != nil {
		return nil, err
	}

	result := &repositories.RevokedTokenEntity{}

	if err := r.client.Collection(collectionName).FindOne(ctx, bson.D{{"_id", response.InsertedID}}).Decode(result); err != nil {
		return nil, err
	}
	result.ID = result.OID.Hex()
	return result, nil

}

func (r *revokedTokensPersistence) UpdateByID(ctx context.Context, s string, entity repositories.Entity) error {
	panic("implement me")
}

func (r *revokedTokensPersistence) RemoveByID(ctx context.Context, s string) error {
	panic("implement me")
}

func New(client *mongo.Client) repositories.Repository {
	return &revokedTokensPersistence{
		client: client,
	}
}

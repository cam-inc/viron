package adminusers

import (
	"context"
	"time"

	"github.com/cam-inc/viron/packages/golang/helpers"

	"go.mongodb.org/mongo-driver/bson"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/cam-inc/viron/packages/golang/repositories"
	"github.com/cam-inc/viron/packages/golang/repositories/mongo"
)

type adminUsersPersistence struct {
	client *mongo.Client
}

const (
	collectionName = "adminusers"
)

func (a *adminUsersPersistence) FindOne(ctx context.Context, id string) (repositories.Entity, error) {
	conditions := &repositories.AdminUserConditions{
		ID: id,
	}
	slice, err := a.Find(ctx, conditions)
	if err != nil {
		return nil, err
	}
	if len(slice) == 0 {
		return nil, nil
	}
	return slice[0], nil
}

func (a *adminUsersPersistence) Find(ctx context.Context, conditions repositories.Conditions) (repositories.EntitySlice, error) {
	cond := conditions.ConvertConditionMongoDB()
	cur, err := a.client.Collection(collectionName).Find(ctx, cond.Filter, cond.FindOptions)
	if err != nil {
		return nil, err
	}
	var results repositories.EntitySlice
	for cur.Next(ctx) {
		adminUser := &repositories.AdminUserEntity{}
		if err := cur.Decode(adminUser); err != nil {
			return nil, err
		}
		adminUser.ID = adminUser.OID.Hex()
		adminUser.CreatedAt = helpers.UnixToTime(adminUser.CreatedAtInt)
		adminUser.UpdatedAt = helpers.UnixToTime(adminUser.UpdatedAtInt)
		results = append(results, adminUser)
	}

	if results == nil {
		return nil, nil
	}
	return results, nil
}

func (a *adminUsersPersistence) Count(ctx context.Context, conditions repositories.Conditions) int {
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

func (a *adminUsersPersistence) CreateOne(ctx context.Context, entity repositories.Entity) (repositories.Entity, error) {

	adminuser := &repositories.AdminUserEntity{}
	if err := entity.Bind(adminuser); err != nil {
		return nil, err
	}
	adminuser.OID = primitive.NewObjectID()
	now := time.Now()
	adminuser.CreatedAtInt = int(now.Unix())
	adminuser.UpdatedAtInt = int(now.Unix())
	response, err := a.client.Collection(collectionName).InsertOne(ctx, adminuser)
	if err != nil {
		return nil, err
	}

	result := &repositories.AdminUserEntity{}

	if err := a.client.Collection(collectionName).FindOne(ctx, bson.D{{"_id", response.InsertedID}}).Decode(result); err != nil {
		return nil, err
	}
	result.ID = result.OID.Hex()
	return result, nil

}

func (a *adminUsersPersistence) UpdateByID(ctx context.Context, id string, entity repositories.Entity) error {
	adminUser := &repositories.AdminUserEntity{}
	if err := entity.Bind(adminUser); err != nil {
		return err
	}
	adminUser.UpdatedAtInt = int(time.Now().Unix())
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	up := adminUser.ToBSONSet()

	if _, err = a.client.Collection(collectionName).UpdateByID(ctx, oid, up); err != nil {
		return err
	}
	return nil

}

func (a *adminUsersPersistence) RemoveByID(ctx context.Context, id string) error {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	// 削除
	if _, err = a.client.Collection(collectionName).DeleteOne(ctx, bson.D{{Key: "_id", Value: oid}}); err != nil {
		return err
	}
	return nil
}

func New(client *mongo.Client) repositories.Repository {
	return &adminUsersPersistence{
		client: client,
	}
}

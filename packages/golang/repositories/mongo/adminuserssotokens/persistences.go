package adminuserssotokens

import (
	"context"
	"time"

	"github.com/cam-inc/viron/packages/golang/helpers"

	"go.mongodb.org/mongo-driver/bson"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/cam-inc/viron/packages/golang/repositories"
	"github.com/cam-inc/viron/packages/golang/repositories/mongo"
)

type adminUserSSOTokensPersistence struct {
	client *mongo.Client
}

const (
	collectionName = "adminuserssotokens"
)

func (a *adminUserSSOTokensPersistence) FindOne(ctx context.Context, id string) (repositories.Entity, error) {
	conditions := &repositories.AdminUserSSOTokenConditions{
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

func (a *adminUserSSOTokensPersistence) Find(ctx context.Context, conditions repositories.Conditions) (repositories.EntitySlice, error) {
	cond := conditions.ConvertConditionMongoDB()
	cur, err := a.client.Collection(collectionName).Find(ctx, cond.Filter, cond.FindOptions)
	if err != nil {
		return nil, err
	}
	var results repositories.EntitySlice
	for cur.Next(ctx) {
		adminUser := &repositories.AdminUserSSOTokenEntity{}
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

func (a *adminUserSSOTokensPersistence) Count(ctx context.Context, conditions repositories.Conditions) int {
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

func (a *adminUserSSOTokensPersistence) CreateOne(ctx context.Context, entity repositories.Entity) (repositories.Entity, error) {

	adminuser := &repositories.AdminUserSSOTokenEntity{}
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

	result := &repositories.AdminUserSSOTokenEntity{}

	if err := a.client.Collection(collectionName).FindOne(ctx, bson.D{{Key: "_id", Value: response.InsertedID}}).Decode(result); err != nil {
		return nil, err
	}
	result.ID = result.OID.Hex()
	return result, nil

}

func (a *adminUserSSOTokensPersistence) UpdateByID(ctx context.Context, id string, entity repositories.Entity) error {
	adminUser := &repositories.AdminUserSSOTokenEntity{}
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

// RemoveByID userIDに紐づくtokenをすべて削除
func (a *adminUserSSOTokensPersistence) RemoveByID(ctx context.Context, userID string) error {
	// 削除
	if _, err := a.client.Collection(collectionName).DeleteMany(ctx, bson.D{{Key: "userId", Value: userID}}); err != nil {
		return err
	}
	return nil
}

func New(client *mongo.Client) repositories.Repository {
	return &adminUserSSOTokensPersistence{
		client: client,
	}
}

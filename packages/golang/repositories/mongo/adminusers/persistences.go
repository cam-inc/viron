package adminusers

import (
	"context"
	"fmt"
	"time"

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
		adminUser := &repositories.AdminUser{}
		if err := cur.Decode(adminUser); err != nil {
			return nil, err
		}
		adminUser.ID = adminUser.OID.Hex()
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

	adminuser := &repositories.AdminUser{}
	if err := entity.Bind(adminuser); err != nil {
		return nil, err
	}
	adminuser.OID = primitive.NewObjectID()
	now := time.Now().Unix()
	adminuser.CreatedAtInt = now
	adminuser.UpdatedAtInt = now
	response, err := a.client.Collection(collectionName).InsertOne(ctx, adminuser)
	if err != nil {
		return nil, err
	}

	result := &repositories.AdminUser{}

	fmt.Printf("InsertedID %+v\n", response.InsertedID)
	if err := a.client.Collection(collectionName).FindOne(ctx, bson.D{{"_id", response.InsertedID}}).Decode(result); err != nil {
		fmt.Printf("err %+v\n", err)
		return nil, err
	}
	result.ID = result.OID.Hex()
	fmt.Printf("result %+v\n", result)
	return result, nil

}

func (a *adminUsersPersistence) UpdateByID(ctx context.Context, id string, entity repositories.Entity) error {
	adminUser := &repositories.AdminUser{}
	if err := entity.Bind(adminUser); err != nil {
		return err
	}
	adminUser.UpdatedAtInt = time.Now().Unix()
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	up := adminUser.ToBSONSet()

	fmt.Printf("update %+v\n", up)

	if result, err := a.client.Collection(collectionName).UpdateByID(ctx, oid, up); err != nil {
		return err
	} else {
		fmt.Printf("update-result %+v\n", result)
	}
	return nil

}

func (a *adminUsersPersistence) RemoveByID(ctx context.Context, s string) error {
	panic("implement me")
}

func New(client *mongo.Client) repositories.Repository {
	return &adminUsersPersistence{
		client: client,
	}
}

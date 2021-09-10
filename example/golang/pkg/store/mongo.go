package store

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/cam-inc/viron/example/golang/pkg/config"
	"go.mongodb.org/mongo-driver/mongo"
)

type (
	MongoClientWithOptions struct {
		Client  *mongo.Client
		Options *options.ClientOptions
	}
)

var con *MongoClientWithOptions

func SetupMongo(config *config.Mongo) {
	opt := options.Client().ApplyURI(config.URI)
	opt.SetAuth(options.Credential{
		Username: config.User,
		Password: config.Password,
	})

	fmt.Printf("mongo client options %+v\n", opt)

	client, err := mongo.NewClient(opt)
	if err != nil {
		panic(err)
	}
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	if err := client.Connect(ctx); err != nil {
		panic(err)
	}
	con = &MongoClientWithOptions{
		Client:  client,
		Options: opt,
	}
}

func GetMongoCollection() *MongoClientWithOptions {
	return con
}

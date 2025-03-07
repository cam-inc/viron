package store

import (
	"context"
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
	opt := options.Client().ApplyURI(config.URI).SetAuth(options.Credential{
		Username: config.User,
		Password: config.Password,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, opt)
	if err != nil {
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

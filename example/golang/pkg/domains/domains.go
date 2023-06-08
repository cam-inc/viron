package domains

import (
	"database/sql"

	vironMongo "github.com/cam-inc/viron/packages/golang/repositories/mongo"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/cam-inc/viron/packages/golang/repositories/container"
)

func SetUpMySQL(conn *sql.DB) error {
	if err := container.SetUpMySQL(conn); err != nil {
		return err
	}
	// SetUpMySQL users, purchases repository
	return nil
}

func SetUpMongo(client *mongo.Client, dbName string) error {
	if err := container.SetUpMongoDB(vironMongo.New(client, dbName)); err != nil {
		return err
	}
	// SetUpMongo users, purchases repository
	return nil
}

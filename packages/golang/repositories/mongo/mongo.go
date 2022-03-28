package mongo

import (
	"go.mongodb.org/mongo-driver/mongo"
)

type (
	Database struct {
		Name        string
		Collections []string
	}

	Databases []*Database

	Client struct {
		Database *mongo.Database
	}
)

func New(client *mongo.Client, db string) *Client {
	c := &Client{}
	c.Database = client.Database(db)
	return c
}
func (c *Client) Collection(name string) *mongo.Collection {
	col := c.Database.Collection(name)
	return col
}

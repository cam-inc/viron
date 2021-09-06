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
		//*mongo.Client
		//Databases Databases
		//vironDB string
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

/*
func NewOld(client *mongo.Client, databases ...map[string][]string) *Client {
	c := &Client{
		Client:    client,
		Databases: []*Database{},
	}

	for _, database := range databases {
		for name, collections := range database {
			d := &Database{
				Name:        name,
				Collections: collections,
			}
			c.Databases = append(c.Databases, d)
		}
	}

	return c
}


func (c *Client) CollectionOld(name string) *mongo.Collection {
	for _, db := range c.Databases {
		for _, collection := range db.Collections {
			if collection == name {
				return c.Client.Database(name).Collection(collection)
			}
		}
	}
	return nil
}

*/

/*
// Mongo: クエリ用のオプションを生成
export const getMongoQueryOptions = (
  size: number = DEFAULT_PAGER_SIZE,
  page: number = DEFAULT_PAGER_PAGE
): MongoQueryOptions => {
  return {
    limit: size,
    skip: (page - 1) * size,
  };
};
*/

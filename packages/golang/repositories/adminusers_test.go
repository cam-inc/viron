package repositories

import (
	"fmt"
	"testing"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/stretchr/testify/assert"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func TestAdminUserConditions_ConvertConditionMongoDB(t *testing.T) {
	c := &AdminUserConditions{
		Paginate: &Paginate{
			Size: 1,
			Page: 1,
			Sort: []string{"id:desc"},
		},
	}
	c.ID = "000000000000000000000000"
	eMongo := c.ConvertConditionMongoDB()
	aMongo := &MongoConditions{}
	id, _ := primitive.ObjectIDFromHex("000000000000000000000000")
	aMongo.Filter = bson.M{
		"_id": id,
	}
	size := int64(1)
	skip := int64(0)
	aMongo.FindOptions = &options.FindOptions{
		Limit: &size,
		Skip:  &skip,
		Sort:  parseSorts([]string{"id:desc"}).MongoDB(),
	}
	assert.Equal(t, eMongo.Filter, aMongo.Filter)
	assert.Equal(t, eMongo.FindOptions, aMongo.FindOptions)
}

func TestAdminUserConditions_ConvertConditionMySQL(t *testing.T) {
	c := &AdminUserConditions{
		Paginate: &Paginate{
			Size: 1,
			Page: 1,
			Sort: []string{"id:desc"},
		},
	}
	c.ID = "0"
	eMySQL := c.ConvertConditionMySQL()
	eMySQL = append(eMySQL, c.ConvertPager().PaginateMySQL()...)
	aMySQL := []qm.QueryMod{
		qm.Where("id = ?", 0),
		qm.OrderBy(fmt.Sprintf("%s %s", "id", Desc)),
		qm.Limit(1),
		qm.Offset(0),
	}

	assert.Equal(t, eMySQL, aMySQL)

}

func TestAdminUserEntity_Bind(t *testing.T) {
	a := &AdminUserEntity{}
	assert.NoError(t, a.Bind(&AdminUserEntity{}))
	assert.Error(t, a.Bind(nil))
}

func TestAdminUserEntity_ToBSONSet(t *testing.T) {
	a := &AdminUserEntity{}

	b := a.ToBSONSet()
	e := bson.D{
		{Key: "$set", Value: bson.D{
			bson.E{Key: "updatedAt", Value: int(time.Now().Unix())},
		},
		},
	}
	assert.Equal(t, b, e)
}

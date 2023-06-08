package repositories

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
	"go.mongodb.org/mongo-driver/bson"
)

func TestRevokedTokens_ConvertConditionMongoDB(t *testing.T) {
	c := &RevokedTokenConditions{
		RevokedTokenEntity: &RevokedTokenEntity{},
		Paginate: &Paginate{
			Size: 1,
			Page: 1,
			Sort: []string{"id:desc"},
		},
	}
	c.Token = "000000000000000000000000"
	eMongo := c.ConvertConditionMongoDB()
	aMongo := &MongoConditions{}
	aMongo.Filter = bson.M{
		"token": "000000000000000000000000",
	}

	assert.Equal(t, eMongo.Filter, aMongo.Filter)
	assert.Equal(t, eMongo.FindOptions, aMongo.FindOptions)
}

func TestRevokedTokens_ConvertConditionMySQL(t *testing.T) {
	c := &RevokedTokenConditions{
		RevokedTokenEntity: &RevokedTokenEntity{},
		Paginate: &Paginate{
			Size: 1,
			Page: 1,
			Sort: []string{"id:desc"},
		},
	}
	c.Token = "0"
	eMySQL := c.ConvertConditionMySQL()
	eMySQL = append(eMySQL, c.ConvertPager().PaginateMySQL()...)
	aMySQL := []qm.QueryMod{
		qm.Where("token = ?", "0"),
		qm.OrderBy(fmt.Sprintf("%s %s", "id", Desc)),
		qm.Limit(1),
		qm.Offset(0),
	}

	assert.Equal(t, eMySQL, aMySQL)

}

func TestRevokendTokensEntity_Bind(t *testing.T) {
	a := &RevokedTokenEntity{}
	assert.NoError(t, a.Bind(&RevokedTokenEntity{}))
	assert.Error(t, a.Bind(nil))
}

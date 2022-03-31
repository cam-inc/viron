package repositories

import (
	"fmt"
	"net/http"
	"testing"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/volatiletech/sqlboiler/v4/queries/qm"

	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson"
)

func TestAuditLogConditionsMongoDB(t *testing.T) {
	e := NewAuditLogConditions(&AuditLogEntity{
		ID:            "000000000000000000000000",
		RequestMethod: strPtr(http.MethodGet),
		RequestUri:    strPtr("/test"),
		RequestBody:   strPtr("{}"),
		SourceIp:      strPtr("0.0.0.0"),
		UserID:        strPtr("user_id"),
		StatusCode:    intPtr(200),
	}, 1, 1, []string{"id:desc"})

	eMongo := e.ConvertConditionMongoDB()
	aMongo := &MongoConditions{}
	id, _ := primitive.ObjectIDFromHex("000000000000000000000000")
	aMongo.Filter = bson.M{
		"_id":           id,
		"requestMethod": http.MethodGet,
		"requestUri":    "/test",
		"sourceIp":      "0.0.0.0",
		"userId":        "user_id",
		"requestBody":   "{}",
		"statusCode":    200,
	}
	size := int64(1)
	skip := int64(0)
	aMongo.FindOptions = &options.FindOptions{
		Limit: &size,
		Skip:  &skip,
		Sort:  parseSorts([]string{"id:desc"}).MongoDB(),
	}
	assert.Equal(t, eMongo.Filter, aMongo.Filter)
	assert.Equal(t, eMongo.FindOptions.Limit, aMongo.FindOptions.Limit)
	assert.Equal(t, eMongo.FindOptions.Skip, aMongo.FindOptions.Skip)
	assert.Equal(t, eMongo.FindOptions.Sort, aMongo.FindOptions.Sort)
}

func TestAuditLogCondtionsMySQL(t *testing.T) {
	e := NewAuditLogConditions(&AuditLogEntity{
		ID:            "test",
		RequestMethod: strPtr(http.MethodGet),
		RequestUri:    strPtr("/test"),
		RequestBody:   strPtr("{}"),
		SourceIp:      strPtr("0.0.0.0"),
		UserID:        strPtr("user_id"),
		StatusCode:    intPtr(200),
	}, 1, 1, []string{"id:desc"})
	eMySQL := e.ConvertConditionMySQL()
	eMySQL = append(eMySQL, e.ConvertPager().PaginateMySQL()...)

	aMySQL := []qm.QueryMod{
		qm.Where("id = ?", "test"),
		qm.Where("requestMethod = ?", http.MethodGet),
		qm.Where("requestUri = ?", "/test"),
		qm.Where("sourceIp = ?", "0.0.0.0"),
		qm.Where("userId = ?", "user_id"),
		qm.Where("requestBody = ?", "{}"),
		qm.Where("statusCode = ?", 200),
		qm.OrderBy(fmt.Sprintf("%s %s", "id", Desc)),
		qm.Limit(1),
		qm.Offset(0),
	}

	assert.ElementsMatch(t, eMySQL, aMySQL)

}

func TestAuditLogEntity_Bind(t *testing.T) {
	a := &AuditLogEntity{}
	assert.NoError(t, a.Bind(&AuditLogEntity{}))
	assert.Error(t, a.Bind(nil))
}

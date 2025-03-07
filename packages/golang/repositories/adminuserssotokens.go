package repositories

import (
	"fmt"
	"strconv"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

type (
	AdminUserSSOTokenEntity struct {
		ID           string             `bson:"-"`
		OID          primitive.ObjectID `bson:"_id"`
		UserID       string             `bson:"userId"`
		ClientID     string             `bson:"clientId"`
		Provider     string             `bson:"provider"`
		AuthType     string             `bson:"authType"`
		AccessToken  string             `bson:"accessToken"`
		ExpiryDate   int64              `bson:"expiryDate"`
		IdToken      string             `bson:"idToken"`
		RefreshToken *string            `bson:"refreshToken,omitempty"`
		TokenType    string             `bson:"TokenType"`
		CreatedAt    time.Time          `bson:"-"`
		UpdatedAt    time.Time          `bson:"-"`
		CreatedAtInt int                `bson:"createdAt,omitempty"`
		UpdatedAtInt int                `bson:"updatedAt,omitempty"`

		RoleIDs []string `bson:"-"`
	}

	AdminUserSSOTokens []*AdminUserSSOTokenEntity

	AdminUserSSOTokenConditions struct {
		ID       string
		UserID   string
		ClientID string
		Provider string
		AuthType string

		*options.FindOptions
		*Paginate
	}
)

var _ Conditions = &AdminUserSSOTokenConditions{}

func (admin *AdminUserSSOTokenEntity) Bind(b interface{}) error {
	d, ok := b.(*AdminUserSSOTokenEntity)
	if !ok {
		return fmt.Errorf("adminuser bind failed")
	}
	*d = *admin
	return nil
}

func (ssoToken *AdminUserSSOTokenEntity) ToBSONSet() bson.D {
	set := bson.D{}

	set = append(set, bson.E{Key: "accessToken", Value: ssoToken.AccessToken})
	set = append(set, bson.E{Key: "expiryDate", Value: ssoToken.ExpiryDate})
	set = append(set, bson.E{Key: "idToken", Value: ssoToken.IdToken})
	set = append(set, bson.E{Key: "tokenType", Value: ssoToken.TokenType})
	if ssoToken.RefreshToken != nil {
		set = append(set, bson.E{Key: "refreshToken", Value: *ssoToken.RefreshToken})
	}
	if ssoToken.UpdatedAtInt == 0 {
		ssoToken.UpdatedAtInt = int(time.Now().Unix())
	}
	set = append(set, bson.E{Key: "updatedAt", Value: ssoToken.UpdatedAtInt})

	return bson.D{
		{Key: "$set", Value: set},
	}
}

func (c *AdminUserSSOTokenConditions) ConvertConditionMongoDB() *MongoConditions {
	conditions := &MongoConditions{}

	m := bson.M{}
	if c.ID != "" {
		oID, _ := primitive.ObjectIDFromHex(c.ID)
		m["_id"] = oID
	}
	if c.UserID != "" {
		m["userId"] = c.UserID
	}
	if c.ClientID != "" {
		m["clientId"] = c.ClientID
	}
	if c.Provider != "" {
		m["provider"] = c.Provider
	}
	if c.AuthType != "" {
		m["authType"] = c.AuthType
	}

	conditions.Filter = m

	if c.FindOptions == nil {
		c.FindOptions = options.Find()
	}

	// Paginatorの値を個別にセット
	pager := c.ConvertPager()
	paginator := pager.PaginateMongo()

	if paginator.Limit != nil {
		c.FindOptions.Limit = paginator.Limit
	}
	if paginator.Skip != nil {
		c.FindOptions.Skip = paginator.Skip
	}
	if paginator.Sort != nil {
		c.FindOptions.Sort = paginator.Sort
	}

	conditions.FindOptions = c.FindOptions

	return conditions
}

func (c *AdminUserSSOTokenConditions) ConvertConditionMySQL() []qm.QueryMod {

	conditions := []qm.QueryMod{}
	if c.ID != "" {
		intID, _ := strconv.Atoi(c.ID)
		conditions = append(conditions, qm.Where("id = ?", intID))
	}
	if c.UserID != "" {
		conditions = append(conditions, qm.Where("userId = ?", c.UserID))
	}
	if c.ClientID != "" {
		conditions = append(conditions, qm.Where("clientId = ?", c.ClientID))
	}
	if c.Provider != "" {
		conditions = append(conditions, qm.Where("provider = ?", c.Provider))
	}
	if c.AuthType != "" {
		conditions = append(conditions, qm.Where("authType = ?", c.AuthType))
	}

	return conditions
}

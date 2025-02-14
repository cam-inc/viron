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
	AdminUserEntity struct {
		ID                       string             `bson:"-"`
		OID                      primitive.ObjectID `bson:"_id"`
		Email                    string             `bson:"email,omitempty"`
		AuthType                 string             `bson:"authType"`
		Password                 *string            `bson:"password,omitempty"`
		Salt                     *string            `bson:"salt,omitempty"`
		GoogleOAuth2AccessToken  *string            `bson:"googleOAuth2AccessToken,omitempty"`
		GoogleOAuth2ExpiryDate   *uint64            `bson:"googleOAuth2ExpiryDate,omitempty"`
		GoogleOAuth2IdToken      *string            `bson:"googleOAuth2IdToken,omitempty"`
		GoogleOAuth2RefreshToken *string            `bson:"googleOAuth2RefreshToken,omitempty"`
		GoogleOAuth2TokenType    *string            `bson:"googleOAuth2TokenType,omitempty"`
		OidcAccessToken          *string            `bson:"oidcAccessToken,omitempty"`
		OidcExpiryDate           *uint64            `bson:"oidcExpiryDate,omitempty"`
		OidcIdToken              *string            `bson:"oidcIdToken,omitempty"`
		OidcRefreshToken         *string            `bson:"oidcRefreshToken,omitempty"`
		OidcTokenType            *string            `bson:"oidcTokenType,omitempty"`
		CreatedAt                time.Time          `bson:"-"`
		UpdatedAt                time.Time          `bson:"-"`
		CreatedAtInt             int                `bson:"createdAt,omitempty"`
		UpdatedAtInt             int                `bson:"updatedAt,omitempty"`

		RoleIDs []string `bson:"-"`
	}

	AdminUsers []*AdminUserEntity

	AdminUserConditions struct {
		ID    string
		Email string

		LikeEmail string
		IDs       []uint
		Emails    []string
		*options.FindOptions
		*Paginate
	}
)

var _ Conditions = &AdminUserConditions{}

func (admin *AdminUserEntity) Bind(b interface{}) error {
	d, ok := b.(*AdminUserEntity)
	if !ok {
		return fmt.Errorf("adminuser bind failed")
	}
	*d = *admin
	return nil
}

func (admin *AdminUserEntity) ToBSONSet() bson.D {
	set := bson.D{}

	if admin.Password != nil {
		set = append(set, bson.E{Key: "password", Value: *admin.Password})
	}

	if admin.GoogleOAuth2AccessToken != nil {
		set = append(set, bson.E{Key: "googleOAuth2AccessToken", Value: *admin.GoogleOAuth2AccessToken})
	}

	if admin.GoogleOAuth2ExpiryDate != nil {
		set = append(set, bson.E{Key: "googleOAuth2ExpiryDate", Value: *admin.GoogleOAuth2ExpiryDate})
	}

	if admin.GoogleOAuth2IdToken != nil {
		set = append(set, bson.E{Key: "googleOAuth2IdToken", Value: *admin.GoogleOAuth2IdToken})
	}

	if admin.GoogleOAuth2RefreshToken != nil {
		set = append(set, bson.E{Key: "googleOAuth2RefreshToken", Value: *admin.GoogleOAuth2RefreshToken})
	}

	if admin.GoogleOAuth2TokenType != nil {
		set = append(set, bson.E{Key: "googleOAuth2TokenType", Value: *admin.GoogleOAuth2TokenType})
	}

	if admin.OidcAccessToken != nil {
		set = append(set, bson.E{Key: "oidcAccessToken", Value: *admin.OidcAccessToken})
	}

	if admin.OidcExpiryDate != nil {
		set = append(set, bson.E{Key: "oidcExpiryDate", Value: *admin.OidcExpiryDate})
	}

	if admin.OidcIdToken != nil {
		set = append(set, bson.E{Key: "oidcIdToken", Value: *admin.OidcIdToken})
	}

	if admin.OidcRefreshToken != nil {
		set = append(set, bson.E{Key: "oidcRefreshToken", Value: *admin.OidcRefreshToken})
	}

	if admin.OidcTokenType != nil {
		set = append(set, bson.E{Key: "oidcTokenType", Value: *admin.OidcTokenType})
	}

	if admin.UpdatedAtInt == 0 {
		admin.UpdatedAtInt = int(time.Now().Unix())
	}
	set = append(set, bson.E{Key: "updatedAt", Value: admin.UpdatedAtInt})

	return bson.D{
		{Key: "$set", Value: set},
	}
}

func (c *AdminUserConditions) ConvertConditionMongoDB() *MongoConditions {
	conditions := &MongoConditions{}

	m := bson.M{}
	if c.ID != "" {
		oID, _ := primitive.ObjectIDFromHex(c.ID)
		m["_id"] = oID
	}
	if c.Email != "" {
		m["email"] = c.Email
	}
	if c.LikeEmail != "" {
		m["email"] = bson.M{"$regex": c.LikeEmail}
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

func (c *AdminUserConditions) ConvertConditionMySQL() []qm.QueryMod {

	conditions := []qm.QueryMod{}
	if c.ID != "" {
		intID, _ := strconv.Atoi(c.ID)
		conditions = append(conditions, qm.Where("id = ?", intID))
	}
	if c.Email != "" {
		conditions = append(conditions, qm.Where("email = ?", c.Email))
	}
	if c.LikeEmail != "" {
		conditions = append(conditions, qm.Where("email like ?", c.LikeEmail))
	}
	if len(c.IDs) != 0 {
		ids := []interface{}{}
		for i := range c.IDs {
			ids = append(ids, i)
		}
		conditions = append(conditions, qm.WhereIn("id in ?", ids...))
	}
	if len(c.Emails) != 0 {
		emails := []interface{}{}
		for e := range c.Emails {
			emails = append(emails, e)
		}
		conditions = append(conditions, qm.WhereIn("email in ?", emails...))
	}

	return conditions
}

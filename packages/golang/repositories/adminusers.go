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

	/*
		export interface AdminUser {
		  id: string;
		  email: string;
		  authType: AuthType;
		  password: string | null;
		  salt: string | null;
		  googleOAuth2AccessToken: string | null;
		  googleOAuth2ExpiryDate: number | null;
		  googleOAuth2IdToken: string | null;
		  googleOAuth2RefreshToken: string | null;
		  googleOAuth2TokenType: string | null;
		  createdAt: Date;
		  updatedAt: Date;
	*/
	AdminUser struct {
		ID                       string             `bson:"-"`
		OID                      primitive.ObjectID `bson:"_id"`
		Email                    string             `bson:"email"`
		AuthType                 string             `bson:"authType"`
		Password                 *string            `bson:"password"`
		Salt                     *string            `bson:"salt"`
		GoogleOAuth2AccessToken  *string            `bson:"googleOAuth2AccessToken""`
		GoogleOAuth2ExpiryDate   *int               `bson:"googleOAuth2ExpiryDate"`
		GoogleOAuth2IdToken      *string            `bson:"googleOAuth2IdToken"`
		GoogleOAuth2RefreshToken *string            `bson:"googleOAuth2RefreshToken"`
		GoogleOAuth2TokenType    *string            `bson:"googleOAuth2TokenType"`
		CreatedAt                time.Time          `bson:"-"`
		UpdatedAt                time.Time          `bson:"-"`
		CreatedAtInt             int64              `bson:"createdAt"`
		UpdatedAtInt             int64              `bson:"updatedAt"`

		RoleIDs []string `bson:"-"`
	}

	AdminUsers []*AdminUser

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

func (admins AdminUsers) ToEntitySlice() EntitySlice {
	entities := EntitySlice{}
	for _, admin := range admins {
		entities = append(entities, admin)
	}
	return entities
}

func (admin *AdminUser) Bind(b interface{}) error {
	d, ok := b.(*AdminUser)
	if !ok {
		return fmt.Errorf("adminuser bind failed")
	}
	*d = *admin
	return nil
}

func (admin *AdminUser) ToBSONSet() bson.D {
	set := bson.D{}

	if admin.Password != nil {
		set = append(set, bson.E{"password", *admin.Password})
	}

	if admin.GoogleOAuth2AccessToken != nil {
		set = append(set, bson.E{"googleOAuth2AccessToken", *admin.GoogleOAuth2AccessToken})
	}

	if admin.GoogleOAuth2ExpiryDate != nil {
		set = append(set, bson.E{"googleOAuth2ExpiryDate", *admin.GoogleOAuth2ExpiryDate})
	}

	if admin.GoogleOAuth2IdToken != nil {
		set = append(set, bson.E{"googleOAuth2IdToken", *admin.GoogleOAuth2IdToken})
	}

	if admin.GoogleOAuth2RefreshToken != nil {
		set = append(set, bson.E{"googleOAuth2RefreshToken", *admin.GoogleOAuth2RefreshToken})
	}

	if admin.GoogleOAuth2TokenType != nil {
		set = append(set, bson.E{"googleOAuth2TokenType", *admin.GoogleOAuth2TokenType})
	}
	if admin.UpdatedAtInt == 0 {
		admin.UpdatedAtInt = time.Now().Unix()
	}
	set = append(set, bson.E{"updatedAt", admin.UpdatedAtInt})

	return bson.D{
		{"$set", set},
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
		m["email"] = bson.M{"$regex": c.Email}
	}

	conditions.Filter = m

	if c.FindOptions == nil {
		c.FindOptions = options.Find()
	}
	pager := c.ConvertPager()
	paginator := pager.PaginateMongo()
	c.FindOptions = options.MergeFindOptions(c.FindOptions, paginator)

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

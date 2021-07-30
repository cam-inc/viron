package repositories

import (
	"fmt"
	"time"

	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

type (
	AdminUser struct {
		ID                       uint
		Email                    string
		AuthType                 string
		Password                 *string
		Salt                     *string
		GoogleOAuth2AccessToken  *string
		GoogleOAuth2ExpiryDate   *int
		GoogleOAuth2IdToken      *string
		GoogleOAuth2RefreshToken *string
		GoogleOAuth2TokenType    *string
		CreatedAt                time.Time
		UpdatedAt                time.Time

		RoleIDs []string
	}

	AdminUserOptions struct {
		*AdminUser
		IDs []string
	}
)

func (admin *AdminUser) Bind(b interface{}) error {
	d, ok := b.(*AdminUser)
	if !ok {
		return fmt.Errorf("adminuser bind failed")
	}
	*d = *admin
	return nil
}

func (op *AdminUserOptions) ConvertConditionMySQL() []qm.QueryMod {
	q := []qm.QueryMod{}
	return q
}

package service

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"io"

	"github.com/cam-inc/dmc/example-go/common"
	genModels "github.com/cam-inc/dmc/example-go/gen/models"
	"github.com/cam-inc/dmc/example-go/models"
	"golang.org/x/crypto/scrypt"
)

func CreateAdminUserByIdPassword(ctx context.Context, email string, password string, role string) (*genModels.AdminUser, error) {
	adminUserTable := models.NewAdminUserDB(models.DB)
	m := models.NewAdminUser()
	m.Email = email

	// generate password hash with salt
	ary := make([]byte, 32)
	if _, err := io.ReadFull(rand.Reader, ary); err != nil {
		return nil, err
	}
	salt := base64.StdEncoding.EncodeToString(ary)
	if passwordHash, err := scrypt.Key([]byte(password), []byte(salt), 16384, 8, 1, 64); err != nil {
		return nil, err
	} else {
		m.Salt = salt
		m.Password = base64.StdEncoding.EncodeToString(passwordHash)
		m.RoleID = role

		if role == common.GetDefaultRole() {
			CreateDefaultRole(ctx)
		}

		return &m, adminUserTable.Add(ctx, &m)
	}
}

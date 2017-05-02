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
	adminUserTable := models.NewAdminUserDB(common.DB)
	m := models.NewAdminUser()
	m.Email = email

	// generate password hash with salt
	ary := make([]byte, 32)
	_, err := io.ReadFull(rand.Reader, ary)
	if err != nil {
		panic(err)
	}
	salt := base64.StdEncoding.EncodeToString(ary)
	passwordHash, err := scrypt.Key([]byte(password), []byte(salt), 16384, 8, 1, 64)
	if err != nil {
		panic(err)
	}
	m.Salt = salt
	m.Password = base64.StdEncoding.EncodeToString(passwordHash)
	m.RoleID = role

	return &m, adminUserTable.Add(ctx, &m)
}

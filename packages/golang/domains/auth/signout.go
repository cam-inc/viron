package auth

import (
	"context"
	"fmt"
	"time"

	"github.com/cam-inc/viron/packages/golang/repositories"

	"github.com/cam-inc/viron/packages/golang/repositories/container"
)

func SignOut(ctx context.Context, token string) bool {
	if token == "" {
		fmt.Printf("debug token is empty\n")
		return false
	}

	repo := container.GetRevokedTokensRepository()
	fmt.Printf("now = %+v\n", time.Now())
	revokedToken := &repositories.RevokedToken{
		Token:     token,
		RevokedAt: time.Now(),
	}

	if _, err := repo.CreateOne(ctx, revokedToken); err != nil {
		fmt.Printf("debug %s\n", err)
		return false
	}

	return true

}

func IsSignedOut(ctx context.Context, token string) bool {
	if token != "" {
		return false
	}
	repo := container.GetRevokedTokensRepository()
	entity, err := repo.FindOne(ctx, token)
	if err != nil {
		return false
	}
	revoked := &repositories.RevokedToken{}
	if err := entity.Bind(revoked); err != nil {
		return false
	}
	return true
}

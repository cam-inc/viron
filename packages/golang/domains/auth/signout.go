package auth

import (
	"context"
	"time"

	"github.com/cam-inc/viron/packages/golang/repositories"

	"github.com/cam-inc/viron/packages/golang/repositories/container"
)

func SignOut(ctx context.Context, token string) bool {
	if token == "" {
		return false
	}

	repo := container.GetRevokedTokensRepository()
	revokedToken := &repositories.RevokedTokenEntity{
		Token:     token,
		RevokedAt: time.Now(),
	}

	if _, err := repo.CreateOne(ctx, revokedToken); err != nil {
		return false
	}

	return true

}

func IsSignedOut(ctx context.Context, token string) bool {
	// tokenが空の場合はsingoutされていないと判断
	if token == "" {
		return false
	}
	repo := container.GetRevokedTokensRepository()
	entity, err := repo.FindOne(ctx, token)
	if err != nil {
		return false
	}
	revoked := &repositories.RevokedTokenEntity{}
	if err := entity.Bind(revoked); err != nil {
		return false
	}
	return true
}

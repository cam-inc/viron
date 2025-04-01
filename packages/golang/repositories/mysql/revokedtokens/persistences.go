package revokedtokens

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/volatiletech/sqlboiler/v4/boil"

	models "github.com/cam-inc/viron/packages/golang/repositories/mysql/gen"

	"github.com/cam-inc/viron/packages/golang/repositories"
)

type revokedTokensPersistence struct {
	conn *sql.DB
}

func (r *revokedTokensPersistence) FindOne(ctx context.Context, token string) (repositories.Entity, error) {

	cond := &repositories.RevokedTokenConditions{
		RevokedTokenEntity: &repositories.RevokedTokenEntity{
			Token: token,
		},
		Paginate: &repositories.Paginate{
			Size: 1,
			Page: 1,
		},
	}

	results, err := r.Find(ctx, cond)
	if err != nil {
		return nil, err
	}
	if len(results) == 0 {
		return nil, sql.ErrNoRows
	}

	return results[0], nil

}

func (r *revokedTokensPersistence) Find(ctx context.Context, conditions repositories.Conditions) (repositories.EntitySlice, error) {

	mods := conditions.ConvertConditionMySQL()
	mods = append(mods, conditions.ConvertPager().PaginateMySQL()...)
	list := repositories.EntitySlice{}
	results, err := models.Revokedtokens(mods...).All(ctx, r.conn)
	if err != nil {
		return nil, err
	}

	for _, r := range results {
		revokedtoken := &repositories.RevokedTokenEntity{
			ID:        fmt.Sprintf("%d", r.ID),
			Token:     r.Token,
			RevokedAt: r.RevokedAt,
			CreatedAt: r.CreatedAt,
			UpdatedAt: r.UpdatedAt,
		}
		list = append(list, revokedtoken)
	}

	return list, nil

}

func (r *revokedTokensPersistence) Count(ctx context.Context, conditions repositories.Conditions) int {
	panic("implement me")
}

func (r *revokedTokensPersistence) CreateOne(ctx context.Context, entity repositories.Entity) (repositories.Entity, error) {
	revokedToken := &repositories.RevokedTokenEntity{}
	if err := entity.Bind(revokedToken); err != nil {
		return nil, err
	}
	model := &models.Revokedtoken{
		Token:     revokedToken.Token,
		RevokedAt: revokedToken.RevokedAt,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := model.Insert(ctx, r.conn, boil.Infer()); err != nil {
		return nil, err
	}
	revokedToken.ID = fmt.Sprintf("%d", model.ID)
	return revokedToken, nil
}

func (r *revokedTokensPersistence) UpdateByID(ctx context.Context, id string, entity repositories.Entity) error {
	panic("implement me")
}

func (r *revokedTokensPersistence) RemoveByID(ctx context.Context, id string) error {
	panic("implement me")
}

func New(db *sql.DB) repositories.Repository {
	return &revokedTokensPersistence{
		conn: db,
	}
}

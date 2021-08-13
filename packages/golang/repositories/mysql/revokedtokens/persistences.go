package revokedtokens

import (
	"context"
	"database/sql"
	"time"

	"github.com/volatiletech/sqlboiler/v4/queries/qm"

	"github.com/volatiletech/sqlboiler/v4/boil"

	models "github.com/cam-inc/viron/packages/golang/repositories/mysql/gen"

	"github.com/cam-inc/viron/packages/golang/repositories"
)

type revokedTokensPersistence struct {
	conn *sql.DB
}
type RevokedTokenConditions struct {
	Token string
}

func (r *RevokedTokenConditions) ConvertConditionMongoDB() []interface{} {
	panic("no implements")
}
func (r *RevokedTokenConditions) ConvertConditionMySQL() []qm.QueryMod {
	return []qm.QueryMod{qm.Where("token = ?", r.Token)}
}

func (r *revokedTokensPersistence) FindOne(ctx context.Context, token string) (repositories.Entity, error) {

	cond := &RevokedTokenConditions{
		Token: token,
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
	list := repositories.EntitySlice{}
	results, err := models.Revokedtokens(mods...).All(ctx, r.conn)
	if err != nil {
		return nil, err
	}

	for _, r := range results {
		revokedtoken := &repositories.RevokedToken{
			ID:        r.ID,
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
	revokedToken := &repositories.RevokedToken{}
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
	revokedToken.ID = model.ID
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

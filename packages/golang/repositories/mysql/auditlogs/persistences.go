package auditlogs

import (
	"context"
	"database/sql"
	"time"

	"github.com/volatiletech/sqlboiler/v4/boil"

	"github.com/volatiletech/null/v8"

	models "github.com/cam-inc/viron/packages/golang/repositories/mysql/gen"

	"github.com/cam-inc/viron/packages/golang/repositories"
)

type auditLogsPersistence struct {
	conn *sql.DB
}

func (a *auditLogsPersistence) FindOne(ctx context.Context, id string) (repositories.Entity, error) {
	panic("implement me")
}

func (a *auditLogsPersistence) Find(ctx context.Context, conditions repositories.Conditions) (repositories.EntitySlice, error) {
	mods := conditions.ConvertConditionMySQL()

	list := repositories.EntitySlice{}

	result, err := models.Auditlogs(mods...).All(ctx, a.conn)
	if err != nil {
		return nil, err
	}

	for _, r := range result {
		auditlog := &repositories.AuditLog{
			ID:            r.ID,
			RequestMethod: r.RequestMethod.Ptr(),
			RequestUri:    r.RequestUri.Ptr(),
			SourceIp:      r.SourceIp.Ptr(),
			UserId:        r.UserId.Ptr(),
			RequestBody:   r.RequestBody.Ptr(),
			StatusCode:    r.StatusCode.Ptr(),
			CreatedAt:     r.CreatedAt,
			CreatedAtInt:  r.CreatedAt.Unix(),
			UpdatedAt:     r.UpdatedAt,
			UpdatedAtInt:  r.UpdatedAt.Unix(),
		}
		list = append(list, auditlog)
	}

	return list, nil

}

func (a *auditLogsPersistence) Count(ctx context.Context, conditions repositories.Conditions) int {
	panic("implement me")
}

func (a *auditLogsPersistence) CreateOne(ctx context.Context, entity repositories.Entity) (repositories.Entity, error) {

	audit := &repositories.AuditLog{}
	if err := entity.Bind(audit); err != nil {
		return nil, err
	}
	model := &models.Auditlog{
		RequestMethod: null.StringFromPtr(audit.RequestMethod),
		RequestUri:    null.StringFromPtr(audit.RequestUri),
		SourceIp:      null.StringFromPtr(audit.SourceIp),
		UserId:        null.StringFromPtr(audit.UserId),
		RequestBody:   null.StringFromPtr(audit.RequestBody),
		StatusCode:    null.UintFromPtr(audit.StatusCode),
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	if err := model.Insert(ctx, a.conn, boil.Infer()); err != nil {
		return nil, err
	}
	audit.ID = model.ID
	return audit, nil
}

func (a *auditLogsPersistence) UpdateByID(ctx context.Context, id string, entity repositories.Entity) error {
	panic("implement me")
}

func (a *auditLogsPersistence) RemoveByID(ctx context.Context, id string) error {
	panic("implement me")
}

func New(db *sql.DB) repositories.Repository {
	return &auditLogsPersistence{conn: db}
}

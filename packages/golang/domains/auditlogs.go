package domains

import (
	"context"

	"github.com/getkin/kin-openapi/openapi3"

	"github.com/cam-inc/viron/packages/golang/repositories"
	"github.com/cam-inc/viron/packages/golang/repositories/container"
)

type (
	AuditLog struct {
		ID            string  `json:"id"`
		RequestMethod *string `json:"requestMethod"`
		RequestUri    *string `json:"requestUri"`
		SourceIp      *string `json:"sourceIp"`
		UserId        *string `json:"userId"`
		RequestBody   *string `json:"requestBody"`
		StatusCode    *uint   `json:"statusCode"`
		CreatedAt     int64   `json:"createdAt"`
		UpdatedAt     int64   `json:"updatedAt"`
	}

	AuditLogsWithPager struct {
		Pager
		List []*AuditLog `json:"list"`
	}
)

func auditLogToEntity(audit *AuditLog) *repositories.AuditLog {
	return &repositories.AuditLog{
		ID:            audit.ID,
		RequestMethod: audit.RequestMethod,
		RequestUri:    audit.RequestUri,
		SourceIp:      audit.SourceIp,
		UserID:        audit.UserId,
		RequestBody:   audit.RequestBody,
		StatusCode:    audit.StatusCode,
	}
}

func entityToAuditlog(entity *repositories.AuditLog) *AuditLog {
	return &AuditLog{
		ID:            entity.ID,
		RequestMethod: entity.RequestMethod,
		RequestUri:    entity.RequestUri,
		SourceIp:      entity.SourceIp,
		UserId:        entity.UserID,
		RequestBody:   entity.RequestBody,
		StatusCode:    entity.StatusCode,
		CreatedAt:     entity.CreatedAtInt,
		UpdatedAt:     entity.UpdatedAtInt,
	}
}

func ListAuditLog(ctx context.Context, audit *AuditLog, page, size int, sort []string) *AuditLogsWithPager {
	repo := container.GetAuditLogRepository()
	results, err := repo.Find(ctx, &repositories.AuditLogOptions{
		AuditLog: auditLogToEntity(audit),
		Paginate: &repositories.Paginate{
			Size: size,
			Page: page,
			Sort: sort,
		},
	})

	res := &AuditLogsWithPager{
		List: []*AuditLog{},
	}
	if err != nil {
		res.Pager = Pagging(0, size, page)
		return res
	}

	for _, result := range results {
		a := &repositories.AuditLog{}
		if err := result.Bind(a); err != nil {
			continue
		}
		res.List = append(res.List, entityToAuditlog(a))
	}

	count := repo.Count(ctx, nil)
	res.Pager = Pagging(count, size, page)

	return res
}

func CreateAuditLog(ctx context.Context, audit *AuditLog) error {
	repo := container.GetAuditLogRepository()
	if _, err := repo.CreateOne(ctx, auditLogToEntity(audit)); err != nil {
		return err
	}
	return nil
}

func IsSkip(uri, method string, apiDef *openapi3.T) bool {
	/*
		// スキップ判定
		export const isSkip = (
		  uri: string,
		  method: string,
		  oas: VironOpenAPIObject
		): boolean => {
		  const { pathItem } = getPathItem(uri, oas);
		  const operation = pathItem?.[method.toLowerCase()];
		  return !!operation?.[OAS_X_SKIP_AUDITLOG];
		};
	*/
	return false
}

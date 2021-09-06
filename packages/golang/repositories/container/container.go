package container

import (
	"database/sql"

	"github.com/cam-inc/viron/packages/golang/repositories/mongo"

	"github.com/cam-inc/viron/packages/golang/repositories"

	"github.com/cam-inc/viron/packages/golang/repositories/mysql/adminusers"
	"github.com/cam-inc/viron/packages/golang/repositories/mysql/auditlogs"
	"github.com/cam-inc/viron/packages/golang/repositories/mysql/revokedtokens"

	mongoAdminUsers "github.com/cam-inc/viron/packages/golang/repositories/mongo/adminusers"
	mongoAuditlogs "github.com/cam-inc/viron/packages/golang/repositories/mongo/auditlogs"
	mongoRevokedtokens "github.com/cam-inc/viron/packages/golang/repositories/mongo/revokedtokens"
)

var (
	repositoriesContainer = map[string]repositories.Repository{}
)

func SetUpMongoDB(client *mongo.Client) error {
	repositoriesContainer["adminusers"] = mongoAdminUsers.New(client)
	repositoriesContainer["auditlogs"] = mongoAuditlogs.New(client)
	repositoriesContainer["revokedtokens"] = mongoRevokedtokens.New(client)
	return nil
}

func SetUpMySQL(conn *sql.DB) error {
	repositoriesContainer["adminusers"] = adminusers.New(conn)
	repositoriesContainer["auditlogs"] = auditlogs.New(conn)
	repositoriesContainer["revokedtokens"] = revokedtokens.New(conn)
	// casbin

	return nil
}

func GetAdminUserRepository() repositories.Repository {
	return repositoriesContainer["adminusers"]
}

func GetAuditLogRepository() repositories.Repository {
	return repositoriesContainer["auditlogs"]
}

func GetRevokedTokensRepository() repositories.Repository {
	return repositoriesContainer["revokedtokens"]
}

func GetCasbinRepository() repositories.Repository {
	return nil
}

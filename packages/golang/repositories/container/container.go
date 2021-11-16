package container

import (
	"database/sql"

	"github.com/cam-inc/viron/packages/golang/repositories/mock"

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

func SetUpMock(m map[string]mock.MockFunc) error {
	if _, exists := m["adminusers"]; exists {
		repositoriesContainer["adminusers"] = mock.New(m["adminusers"])
	}
	if _, exists := m["auditlogs"]; exists {
		repositoriesContainer["auditlogs"] = mock.New(m["auditlogs"])
	}
	if _, exists := m["revokedtokens"]; exists {
		repositoriesContainer["revokedtokens"] = mock.New(m["revokedtokens"])
	}
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

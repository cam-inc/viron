package store

import (
	"database/sql"
	"fmt"

	"github.com/cam-inc/viron/packages/golang/repositories"

	"github.com/cam-inc/viron/packages/golang/repositories/mysql/adminusers"
	"github.com/cam-inc/viron/packages/golang/repositories/mysql/auditlogs"
	"github.com/cam-inc/viron/packages/golang/repositories/mysql/revokedtokens"

	"github.com/cam-inc/viron/example/golang/pkg/config"
)

var (
	conn          *sql.DB
	mRepositories map[string]repositories.Repository
)

func NewMySQL(config *config.MySQL) *sql.DB {
	dsn := config.ToDriverConfig().FormatDSN()
	fmt.Printf("mysql dsn: %s\n", dsn)
	db, err := sql.Open(config.Dialect, dsn)
	if err != nil {
		fmt.Printf("MySQL connection failed %v", err)
		panic(err)
	}

	if err := db.Ping(); err != nil {
		fmt.Printf("MySQL connection(ping) failed %v\n", err)
		//panic(err)
	} else {
		fmt.Println("mysql connect success")
	}

	fmt.Println("DEBUG")

	//db.SetMaxOpenConns()
	//db.SetMaxIdleConns()
	//db.SetConnMaxIdleTime()
	//db.SetConnMaxLifetime()

	return db
}

func SetupMySQL(config *config.MySQL) {
	conn = NewMySQL(config)
	mRepositories = map[string]repositories.Repository{}
	mRepositories["adminusers"] = adminusers.New(conn)
	mRepositories["auditlogs"] = auditlogs.New(conn)
	mRepositories["revokedtokens"] = revokedtokens.New(conn)
}

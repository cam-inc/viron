package store

import (
	"database/sql"

	"github.com/volatiletech/sqlboiler/v4/boil"

	"github.com/cam-inc/viron/example/golang/pkg/constant"
	"github.com/cam-inc/viron/packages/golang/logging"

	"github.com/cam-inc/viron/example/golang/pkg/config"
)

var (
	conn *sql.DB
)

func NewMySQL(config *config.MySQL) *sql.DB {
	dsn := config.ToDriverConfig().FormatDSN()
	log := logging.GetLogger(string(constant.LOG_NAME), logging.DebugLevel)
	db, err := sql.Open(config.Dialect, dsn)
	if err != nil {
		log.Errorf("MySQL connection failed %v", err)
		panic(err)
	}

	if err := db.Ping(); err != nil {
		log.Errorf("MySQL connection(ping) failed %v\n", err)
	} else {
		log.Debug("MySQL connect success")
	}

	boil.DebugMode = true

	return db
}

func SetupMySQL(config *config.MySQL) {
	conn = NewMySQL(config)
}

func GetMySQLConnection() *sql.DB {
	if conn == nil {
		panic("====DEBUG connection is nil DEBUG====")
	}
	return conn
}

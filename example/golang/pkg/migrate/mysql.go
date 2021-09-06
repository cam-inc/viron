package migrate

import (
	"database/sql"

	"github.com/golang-migrate/migrate/v4"

	"github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func InitMySQL(conn *sql.DB, dbName string, filePath string) error {
	driver, err := mysql.WithInstance(conn, &mysql.Config{})
	if err != nil {
		return err
	}
	m, err := migrate.NewWithDatabaseInstance(filePath, dbName, driver)
	if err != nil {
		return err
	}

	// vironDB migrate status is dirty
	if v, dirty, err := m.Version(); err != migrate.ErrNilVersion && dirty {
		if err := m.Force(int(v)); err != nil {
			return err
		}
	} else if err != migrate.ErrNilVersion {
		// vironDB migrated
		return nil
	}
	return m.Up()
}

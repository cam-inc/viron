package domains

import (
	"database/sql"

	"github.com/cam-inc/viron/packages/golang/repositories/container"
)

func SetUpMySQL(conn *sql.DB) error {
	if err := container.SetUpMySQL(conn); err != nil {
		return err
	}
	// SetUpMySQL users, purchases repository
	return nil
}

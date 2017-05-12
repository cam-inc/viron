package service

import (
	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/models"
	"go.uber.org/zap"
)

func Autocomplete(tableName string, fieldName string, searchWord *string) []string {
	logger := common.GetLogger("default")
	list := []string{}

	db := models.DB.Table(tableName).Select(fieldName)
	if searchWord != nil {
		db = db.Where("name LIKE ?", "%"+*searchWord+"%")
	}
	db = db.Order(fieldName + " ASC")

	if rows, err := db.Rows(); err != nil {
		logger.Error("error autocomplete", zap.Error(err))
	} else {
		defer rows.Close()
		for rows.Next() {
			var val string
			rows.Scan(&val)
			if common.InStringArray(val, list) < 0 {
				list = append(list, val)
			}
		}
	}
	return list
}

package mysql

import (
	"fmt"
	"strings"

	"github.com/cam-inc/viron/packages/golang/repositories"

	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

func GetOrderBy(sort []string) qm.QueryMod {
	if len(sort) > 0 {
		orderBy := strings.Join(sort, ",")
		return qm.OrderBy(orderBy)
	}
	return nil
}

func GenOrderBy(sort []repositories.Sort) qm.QueryMod {
	if len(sort) > 0 {
		var clause string
		for i, s := range sort {
			if i == 0 {
				clause = s.SQL()
			} else {
				clause = fmt.Sprintf("%s, %s", clause, s.SQL())
			}
		}
		return qm.OrderBy(clause)
	}
	return nil
}

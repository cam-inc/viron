package domains

import (
	"math"

	"github.com/cam-inc/viron/packages/golang/constant"
)

type (
	// Pager is common pager struct for viron
	Pager struct {
		CurrentPage int `json:"currentPage"`
		MaxPage     int `json:"maxPage"`
	}
)

func Pagging(listNum, size, page int) Pager {
	maxPage := constant.DEFAULT_PAGER_PAGE

	if listNum > 0 {
		maxPage = int(math.Ceil(float64(listNum) / float64(size)))
	}

	return Pager{
		CurrentPage: page,
		MaxPage:     maxPage,
	}
}

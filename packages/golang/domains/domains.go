package domains

import (
	"github.com/cam-inc/viron/packages/golang/constant"
	"math"
)

type (
	// Pager is common pager struct for viron
	Pager struct {
		CurrentPage int  `json:"currentPage"`
		MaxPage     int  `json:"maxPage"`
		Start       *int `json:"-"`
		End         *int `json:"-"`
	}
)

func Paging(listNum, size, page int) Pager {
	maxPage := constant.DEFAULT_PAGER_PAGE

	if listNum > 0 {
		maxPage = int(math.Ceil(float64(listNum) / float64(size)))
	}

	p := Pager{
		CurrentPage: page,
		MaxPage:     maxPage,
	}

	start := size * (page - 1)
	end := start + size

	if start < listNum {
		p.Start = &start
	}

	if end < listNum {
		p.End = &end
	}

	return p

}

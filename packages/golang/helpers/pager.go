package helpers

import (
	"math"
	"reflect"

	"github.com/cam-inc/viron/packages/golang/constant"
)

type (
	PagerResults struct {
		MaxPage     int           `json:"maxPage"`
		CurrentPage int           `json:"currentPage"`
		List        []interface{} `json:"list"`
	}
)

func getPagerResults(listNum, size, page int) *PagerResults {
	maxPage := constant.DEFAULT_PAGER_PAGE

	if listNum > 0 {
		maxPage = int(math.Ceil(float64(listNum) / float64(size)))
	}

	return &PagerResults{
		CurrentPage: page,
		MaxPage:     maxPage,
	}
}

// Paging スライスをPagerResults構造体でラップする
func Paging(list interface{}, size int, page int) *PagerResults {

	s := reflect.ValueOf(list)
	if s.Kind() != reflect.Slice {
		return nil
	}

	// Keep the distinction between nil and empty slice input
	if s.IsNil() {
		return nil
	}

	iList := make([]interface{}, s.Len())

	for i := 0; i < s.Len(); i++ {
		iList[i] = s.Index(i).Interface()
	}

	start := size * (page - 1)
	results := getPagerResults(len(iList), size, page)
	results.List = iList[start : start+size]
	return results
}

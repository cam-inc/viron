package helpers

import (
	"math"
	"reflect"

	"github.com/cam-inc/viron/packages/golang/constant"
)

/*
export interface PagerResults {
  currentPage: number;
  maxPage: number;
}

export interface ListWithPager<T> extends PagerResults {
  list: T[];
}

// listをページングする
export const paging = <T>(
  list: T[],
  size = DEFAULT_PAGER_SIZE,
  page = DEFAULT_PAGER_PAGE
): ListWithPager<T> => {
  const start = size * (page - 1);
  return {
    ...getPagerResults(list.length, size, page),
    list: list.slice(start, start + size),
  };
};

// 最大ページ数と現在のページ番号を取得
export const getPagerResults = (
  numberOfList: number,
  size = DEFAULT_PAGER_SIZE,
  page = DEFAULT_PAGER_PAGE
): PagerResults => {
  const maxPage =
    numberOfList > 0 ? Math.ceil(numberOfList / size) : DEFAULT_PAGER_PAGE;
  const currentPage = page;
  return { maxPage, currentPage };
};

*/

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

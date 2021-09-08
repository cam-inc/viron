package components

import (
	"time"
)

func (p VironPagerPageQueryParam) Page() int {
	return int(p)
}

func (s VironPagerSizeQueryParam) Size() int {
	return int(s)
}

func (sort VironSortQueryParam) Sort() []string {
	return sort
}

/*
別名type定義した場合、その構造体にMarshalJSONがないと上手くJSONにならないのでこうしてる
*/

func (c VironCreatedAt) MarshalJSON() ([]byte, error) {
	t := time.Time(c)
	return t.MarshalJSON()
}

func (u VironUpdatedAt) MarshalJSON() ([]byte, error) {
	t := time.Time(u)
	return t.MarshalJSON()
}

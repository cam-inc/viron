package components

func (p VironPagerPageQueryParam) Page() int {
	return int(p)
}

func (s VironPagerSizeQueryParam) Size() int {
	return int(s)
}

func (sort VironSortQueryParam) Sort() []string {
	return sort
}

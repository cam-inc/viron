package common

import (
	"math"
	"net/http"
	"strconv"
)

type Pager struct {
	Limit  int
	Offset int
	Count  uint64
}

func (p *Pager) SetLimit(limit *int) {
	if limit == nil {
		p.Limit = 100
	} else {
		p.Limit = *limit
	}
}

func (p *Pager) SetOffset(offset *int) {
	if offset == nil {
		p.Offset = 0
	} else {
		p.Offset = *offset
	}
}

func (p *Pager) SetCount(count uint64) {
	p.Count = count
}

func (p *Pager) GetTotalPageNum() int {
	return int(math.Ceil(float64(p.Count) / float64(p.Limit)))
}

func (p *Pager) GetCurrentPageNum() int {
	return int(math.Ceil(float64(p.Offset+1) / float64(p.Limit)))
}

func (p *Pager) SetPaginationHeader(rw http.ResponseWriter) {
	rw.Header().Set("X-Pagination-Limit", strconv.Itoa(p.Limit))
	rw.Header().Set("X-Pagination-Total-Pages", strconv.Itoa(p.GetTotalPageNum()))
	rw.Header().Set("X-Pagination-Current-Page", strconv.Itoa(p.GetCurrentPageNum()))
}

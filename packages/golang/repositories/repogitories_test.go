package repositories

import (
	"testing"

	"github.com/volatiletech/sqlboiler/v4/queries/qm"

	"github.com/stretchr/testify/assert"
)

func strPtr(s string) *string {
	return &s
}
func intPtr(i int) *int {
	return &i
}

func TestConvertPagenate(t *testing.T) {
	p := &Paginate{
		Size: 0,
		Page: 0,
		Sort: []string{"id:asc"},
	}

	pager := p.ConvertPager()

	if pager.Offset != 0 {
		t.Fatalf("offset%d != 0", pager.Offset)
	}

	assert.ElementsMatch(t, pager.Sort, Sorts{
		Sort{
			Key:   "id",
			Order: Asc,
		},
	})
}

func TestPaginateMongo(t *testing.T) {
	p := &Paginate{
		Size: 10,
		Page: 2,
		Sort: []string{"id:desc"},
	}

	pager := p.ConvertPager()

	limit := int64(pager.Limit)
	offset := int64(pager.Offset)
	paginate := pager.PaginateMongo()

	assert.ElementsMatch(t, paginate.Sort, pager.Sort.MongoDB())
	assert.Equal(t, paginate.Limit, &limit)
	assert.Equal(t, paginate.Skip, &offset)
}

func TestPaginateMySQL(t *testing.T) {
	p := &Paginate{
		Size: 10,
		Page: 2,
		Sort: []string{"id:desc"},
	}

	pager := p.ConvertPager()

	paginate := pager.PaginateMySQL()

	assert.ElementsMatch(t, paginate, []qm.QueryMod{
		pager.Sort.SQL(),
		qm.Limit(pager.Limit),
		qm.Offset(pager.Offset),
	})
}

func TestOrder_String(t *testing.T) {
	var o Order
	assert.Equal(t, o.String(), "asc")
	assert.Equal(t, Asc.String(), "asc")
	assert.Equal(t, Desc.String(), "desc")
}

func TestParseSort(t *testing.T) {
	idDescSort := parseSort("id:desc")
	assert.Equal(t, idDescSort, Sort{
		Key:   "id",
		Order: Desc,
	})

	idAscSort := parseSort("id:asc")
	assert.Equal(t, idAscSort, Sort{
		Key:   "id",
		Order: Asc,
	})

	idSort := parseSort("id")
	assert.Equal(t, idSort, Sort{
		Key: "id",
	})
}

func TestParseOrder(t *testing.T) {
	assert.Equal(t, parseOrder(""), Asc)
}

package repositories

import (
	"context"
	"fmt"
	"strings"

	"go.mongodb.org/mongo-driver/bson"

	"github.com/cam-inc/viron/packages/golang/constant"

	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/volatiletech/sqlboiler/v4/queries/qm"
)

type (
	MongoConditions struct {
		Filter      interface{}
		FindOptions *options.FindOptions
	}

	Conditions interface {
		ConvertConditionMySQL() []qm.QueryMod
		ConvertConditionMongoDB() *MongoConditions
		ConvertPager() *Pager
	}

	Entity interface {
		Bind(interface{}) error
	}

	EntitySlice []Entity

	Repository interface {
		FindOne(context.Context, string) (Entity, error)
		Find(context.Context, Conditions) (EntitySlice, error)
		Count(context.Context, Conditions) int
		CreateOne(context.Context, Entity) (Entity, error)
		UpdateByID(context.Context, string, Entity) error
		RemoveByID(context.Context, string) error
	}

	Sort struct {
		Key   string
		Order Order
	}

	Sorts []Sort

	Order int

	Pager struct {
		Limit  int
		Offset int
		Sort   Sorts
	}

	Paginate struct {
		Size int
		Page int
		Sort []string
	}
)

const (
	Asc Order = -1 + iota*2
	Desc
)

func (pg *Paginate) ConvertPager() *Pager {
	p := getPager(pg.Size, pg.Page)
	p.Sort = parseSorts(pg.Sort)
	return p
}

func (p *Pager) PaginateMongo() *options.FindOptions {
	findOptions := options.Find()
	if len(p.Sort) > 0 {
		findOptions.SetSort(p.Sort.MongoDB())
	}

	findOptions.SetLimit(int64(p.Limit))
	findOptions.SetSkip(int64(p.Offset))

	return findOptions
}

func (p *Pager) PaginateMySQL() []qm.QueryMod {
	conditions := []qm.QueryMod{}
	if len(p.Sort) > 0 {
		conditions = append(conditions, p.Sort.SQL())
	}

	conditions = append(conditions, qm.Limit(p.Limit))
	conditions = append(conditions, qm.Offset(p.Offset))
	return conditions
}

func getPager(size int, page int) *Pager {
	if size == 0 {
		size = constant.DEFAULT_PAGER_SIZE
	}
	if page == 0 {
		page = constant.DEFAULT_PAGER_PAGE
	}

	return &Pager{
		Limit:  size,
		Offset: (page - 1) * size,
	}
}

func parseSorts(v []string) Sorts {
	sort := Sorts{}
	for _, s := range v {
		sort = append(sort, parseSort(s))
	}
	return sort
}

func parseSort(v string) Sort {
	keyValue := strings.Split(v, ":")
	if len(keyValue) != 2 {
		return Sort{Key: v}
	}
	return Sort{
		Key:   keyValue[0],
		Order: parseOrder(keyValue[1]),
	}
}

func parseOrder(o string) Order {
	switch o {
	case "asc":
		return Asc
	case "desc":
		return Desc

	}
	return Asc
}

func (o Order) String() string {
	switch o {
	case Asc:
		return "asc"
	case Desc:
		return "desc"
	}
	return "asc"
}

func (s Sort) SQL() string {
	return fmt.Sprintf("%s %s", s.Key, s.Order)
}

func (s Sort) MongoDB() bson.E {
	return bson.E{s.Key, s.Order}
}

func (ss Sorts) SQL() qm.QueryMod {
	if len(ss) > 0 {
		var clause string
		for i, s := range ss {
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

func (ss Sorts) MongoDB() bson.D {
	d := bson.D{}
	if len(ss) > 0 {
		for _, s := range ss {
			d = append(d, s.MongoDB())
		}
	}
	return d
}

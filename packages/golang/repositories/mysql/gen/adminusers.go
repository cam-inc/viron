// Code generated by SQLBoiler 4.6.0 (https://github.com/volatiletech/sqlboiler). DO NOT EDIT.
// This file is meant to be re-generated in place and/or deleted at any time.

package models

import (
	"context"
	"database/sql"
	"fmt"
	"reflect"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/friendsofgo/errors"
	"github.com/volatiletech/null/v8"
	"github.com/volatiletech/sqlboiler/v4/boil"
	"github.com/volatiletech/sqlboiler/v4/queries"
	"github.com/volatiletech/sqlboiler/v4/queries/qm"
	"github.com/volatiletech/sqlboiler/v4/queries/qmhelper"
	"github.com/volatiletech/strmangle"
)

// Adminuser is an object representing the database table.
type Adminuser struct {
	ID                       uint        `boil:"id" json:"id" toml:"id" yaml:"id"`
	Email                    string      `boil:"email" json:"email" toml:"email" yaml:"email"`
	AuthType                 string      `boil:"authType" json:"authType" toml:"authType" yaml:"authType"`
	Password                 null.String `boil:"password" json:"password,omitempty" toml:"password" yaml:"password,omitempty"`
	Salt                     null.String `boil:"salt" json:"salt,omitempty" toml:"salt" yaml:"salt,omitempty"`
	GoogleOAuth2AccessToken  null.String `boil:"googleOAuth2AccessToken" json:"googleOAuth2AccessToken,omitempty" toml:"googleOAuth2AccessToken" yaml:"googleOAuth2AccessToken,omitempty"`
	GoogleOAuth2ExpiryDate   null.Uint64 `boil:"googleOAuth2ExpiryDate" json:"googleOAuth2ExpiryDate,omitempty" toml:"googleOAuth2ExpiryDate" yaml:"googleOAuth2ExpiryDate,omitempty"`
	GoogleOAuth2IdToken      null.String `boil:"googleOAuth2IdToken" json:"googleOAuth2IdToken,omitempty" toml:"googleOAuth2IdToken" yaml:"googleOAuth2IdToken,omitempty"`
	GoogleOAuth2RefreshToken null.String `boil:"googleOAuth2RefreshToken" json:"googleOAuth2RefreshToken,omitempty" toml:"googleOAuth2RefreshToken" yaml:"googleOAuth2RefreshToken,omitempty"`
	GoogleOAuth2TokenType    null.String `boil:"googleOAuth2TokenType" json:"googleOAuth2TokenType,omitempty" toml:"googleOAuth2TokenType" yaml:"googleOAuth2TokenType,omitempty"`
	CreatedAt                time.Time   `boil:"createdAt" json:"createdAt" toml:"createdAt" yaml:"createdAt"`
	UpdatedAt                time.Time   `boil:"updatedAt" json:"updatedAt" toml:"updatedAt" yaml:"updatedAt"`

	R *adminuserR `boil:"-" json:"-" toml:"-" yaml:"-"`
	L adminuserL  `boil:"-" json:"-" toml:"-" yaml:"-"`
}

var AdminuserColumns = struct {
	ID                       string
	Email                    string
	AuthType                 string
	Password                 string
	Salt                     string
	GoogleOAuth2AccessToken  string
	GoogleOAuth2ExpiryDate   string
	GoogleOAuth2IdToken      string
	GoogleOAuth2RefreshToken string
	GoogleOAuth2TokenType    string
	CreatedAt                string
	UpdatedAt                string
}{
	ID:                       "id",
	Email:                    "email",
	AuthType:                 "authType",
	Password:                 "password",
	Salt:                     "salt",
	GoogleOAuth2AccessToken:  "googleOAuth2AccessToken",
	GoogleOAuth2ExpiryDate:   "googleOAuth2ExpiryDate",
	GoogleOAuth2IdToken:      "googleOAuth2IdToken",
	GoogleOAuth2RefreshToken: "googleOAuth2RefreshToken",
	GoogleOAuth2TokenType:    "googleOAuth2TokenType",
	CreatedAt:                "createdAt",
	UpdatedAt:                "updatedAt",
}

var AdminuserTableColumns = struct {
	ID                       string
	Email                    string
	AuthType                 string
	Password                 string
	Salt                     string
	GoogleOAuth2AccessToken  string
	GoogleOAuth2ExpiryDate   string
	GoogleOAuth2IdToken      string
	GoogleOAuth2RefreshToken string
	GoogleOAuth2TokenType    string
	CreatedAt                string
	UpdatedAt                string
}{
	ID:                       "adminusers.id",
	Email:                    "adminusers.email",
	AuthType:                 "adminusers.authType",
	Password:                 "adminusers.password",
	Salt:                     "adminusers.salt",
	GoogleOAuth2AccessToken:  "adminusers.googleOAuth2AccessToken",
	GoogleOAuth2ExpiryDate:   "adminusers.googleOAuth2ExpiryDate",
	GoogleOAuth2IdToken:      "adminusers.googleOAuth2IdToken",
	GoogleOAuth2RefreshToken: "adminusers.googleOAuth2RefreshToken",
	GoogleOAuth2TokenType:    "adminusers.googleOAuth2TokenType",
	CreatedAt:                "adminusers.createdAt",
	UpdatedAt:                "adminusers.updatedAt",
}

// Generated where

type whereHelperuint struct{ field string }

func (w whereHelperuint) EQ(x uint) qm.QueryMod  { return qmhelper.Where(w.field, qmhelper.EQ, x) }
func (w whereHelperuint) NEQ(x uint) qm.QueryMod { return qmhelper.Where(w.field, qmhelper.NEQ, x) }
func (w whereHelperuint) LT(x uint) qm.QueryMod  { return qmhelper.Where(w.field, qmhelper.LT, x) }
func (w whereHelperuint) LTE(x uint) qm.QueryMod { return qmhelper.Where(w.field, qmhelper.LTE, x) }
func (w whereHelperuint) GT(x uint) qm.QueryMod  { return qmhelper.Where(w.field, qmhelper.GT, x) }
func (w whereHelperuint) GTE(x uint) qm.QueryMod { return qmhelper.Where(w.field, qmhelper.GTE, x) }
func (w whereHelperuint) IN(slice []uint) qm.QueryMod {
	values := make([]interface{}, 0, len(slice))
	for _, value := range slice {
		values = append(values, value)
	}
	return qm.WhereIn(fmt.Sprintf("%s IN ?", w.field), values...)
}
func (w whereHelperuint) NIN(slice []uint) qm.QueryMod {
	values := make([]interface{}, 0, len(slice))
	for _, value := range slice {
		values = append(values, value)
	}
	return qm.WhereNotIn(fmt.Sprintf("%s NOT IN ?", w.field), values...)
}

type whereHelperstring struct{ field string }

func (w whereHelperstring) EQ(x string) qm.QueryMod  { return qmhelper.Where(w.field, qmhelper.EQ, x) }
func (w whereHelperstring) NEQ(x string) qm.QueryMod { return qmhelper.Where(w.field, qmhelper.NEQ, x) }
func (w whereHelperstring) LT(x string) qm.QueryMod  { return qmhelper.Where(w.field, qmhelper.LT, x) }
func (w whereHelperstring) LTE(x string) qm.QueryMod { return qmhelper.Where(w.field, qmhelper.LTE, x) }
func (w whereHelperstring) GT(x string) qm.QueryMod  { return qmhelper.Where(w.field, qmhelper.GT, x) }
func (w whereHelperstring) GTE(x string) qm.QueryMod { return qmhelper.Where(w.field, qmhelper.GTE, x) }
func (w whereHelperstring) IN(slice []string) qm.QueryMod {
	values := make([]interface{}, 0, len(slice))
	for _, value := range slice {
		values = append(values, value)
	}
	return qm.WhereIn(fmt.Sprintf("%s IN ?", w.field), values...)
}
func (w whereHelperstring) NIN(slice []string) qm.QueryMod {
	values := make([]interface{}, 0, len(slice))
	for _, value := range slice {
		values = append(values, value)
	}
	return qm.WhereNotIn(fmt.Sprintf("%s NOT IN ?", w.field), values...)
}

type whereHelpernull_String struct{ field string }

func (w whereHelpernull_String) EQ(x null.String) qm.QueryMod {
	return qmhelper.WhereNullEQ(w.field, false, x)
}
func (w whereHelpernull_String) NEQ(x null.String) qm.QueryMod {
	return qmhelper.WhereNullEQ(w.field, true, x)
}
func (w whereHelpernull_String) IsNull() qm.QueryMod    { return qmhelper.WhereIsNull(w.field) }
func (w whereHelpernull_String) IsNotNull() qm.QueryMod { return qmhelper.WhereIsNotNull(w.field) }
func (w whereHelpernull_String) LT(x null.String) qm.QueryMod {
	return qmhelper.Where(w.field, qmhelper.LT, x)
}
func (w whereHelpernull_String) LTE(x null.String) qm.QueryMod {
	return qmhelper.Where(w.field, qmhelper.LTE, x)
}
func (w whereHelpernull_String) GT(x null.String) qm.QueryMod {
	return qmhelper.Where(w.field, qmhelper.GT, x)
}
func (w whereHelpernull_String) GTE(x null.String) qm.QueryMod {
	return qmhelper.Where(w.field, qmhelper.GTE, x)
}

type whereHelpernull_Uint64 struct{ field string }

func (w whereHelpernull_Uint64) EQ(x null.Uint64) qm.QueryMod {
	return qmhelper.WhereNullEQ(w.field, false, x)
}
func (w whereHelpernull_Uint64) NEQ(x null.Uint64) qm.QueryMod {
	return qmhelper.WhereNullEQ(w.field, true, x)
}
func (w whereHelpernull_Uint64) IsNull() qm.QueryMod    { return qmhelper.WhereIsNull(w.field) }
func (w whereHelpernull_Uint64) IsNotNull() qm.QueryMod { return qmhelper.WhereIsNotNull(w.field) }
func (w whereHelpernull_Uint64) LT(x null.Uint64) qm.QueryMod {
	return qmhelper.Where(w.field, qmhelper.LT, x)
}
func (w whereHelpernull_Uint64) LTE(x null.Uint64) qm.QueryMod {
	return qmhelper.Where(w.field, qmhelper.LTE, x)
}
func (w whereHelpernull_Uint64) GT(x null.Uint64) qm.QueryMod {
	return qmhelper.Where(w.field, qmhelper.GT, x)
}
func (w whereHelpernull_Uint64) GTE(x null.Uint64) qm.QueryMod {
	return qmhelper.Where(w.field, qmhelper.GTE, x)
}

type whereHelpertime_Time struct{ field string }

func (w whereHelpertime_Time) EQ(x time.Time) qm.QueryMod {
	return qmhelper.Where(w.field, qmhelper.EQ, x)
}
func (w whereHelpertime_Time) NEQ(x time.Time) qm.QueryMod {
	return qmhelper.Where(w.field, qmhelper.NEQ, x)
}
func (w whereHelpertime_Time) LT(x time.Time) qm.QueryMod {
	return qmhelper.Where(w.field, qmhelper.LT, x)
}
func (w whereHelpertime_Time) LTE(x time.Time) qm.QueryMod {
	return qmhelper.Where(w.field, qmhelper.LTE, x)
}
func (w whereHelpertime_Time) GT(x time.Time) qm.QueryMod {
	return qmhelper.Where(w.field, qmhelper.GT, x)
}
func (w whereHelpertime_Time) GTE(x time.Time) qm.QueryMod {
	return qmhelper.Where(w.field, qmhelper.GTE, x)
}

var AdminuserWhere = struct {
	ID                       whereHelperuint
	Email                    whereHelperstring
	AuthType                 whereHelperstring
	Password                 whereHelpernull_String
	Salt                     whereHelpernull_String
	GoogleOAuth2AccessToken  whereHelpernull_String
	GoogleOAuth2ExpiryDate   whereHelpernull_Uint64
	GoogleOAuth2IdToken      whereHelpernull_String
	GoogleOAuth2RefreshToken whereHelpernull_String
	GoogleOAuth2TokenType    whereHelpernull_String
	CreatedAt                whereHelpertime_Time
	UpdatedAt                whereHelpertime_Time
}{
	ID:                       whereHelperuint{field: "`adminusers`.`id`"},
	Email:                    whereHelperstring{field: "`adminusers`.`email`"},
	AuthType:                 whereHelperstring{field: "`adminusers`.`authType`"},
	Password:                 whereHelpernull_String{field: "`adminusers`.`password`"},
	Salt:                     whereHelpernull_String{field: "`adminusers`.`salt`"},
	GoogleOAuth2AccessToken:  whereHelpernull_String{field: "`adminusers`.`googleOAuth2AccessToken`"},
	GoogleOAuth2ExpiryDate:   whereHelpernull_Uint64{field: "`adminusers`.`googleOAuth2ExpiryDate`"},
	GoogleOAuth2IdToken:      whereHelpernull_String{field: "`adminusers`.`googleOAuth2IdToken`"},
	GoogleOAuth2RefreshToken: whereHelpernull_String{field: "`adminusers`.`googleOAuth2RefreshToken`"},
	GoogleOAuth2TokenType:    whereHelpernull_String{field: "`adminusers`.`googleOAuth2TokenType`"},
	CreatedAt:                whereHelpertime_Time{field: "`adminusers`.`createdAt`"},
	UpdatedAt:                whereHelpertime_Time{field: "`adminusers`.`updatedAt`"},
}

// AdminuserRels is where relationship names are stored.
var AdminuserRels = struct {
}{}

// adminuserR is where relationships are stored.
type adminuserR struct {
}

// NewStruct creates a new relationship struct
func (*adminuserR) NewStruct() *adminuserR {
	return &adminuserR{}
}

// adminuserL is where Load methods for each relationship are stored.
type adminuserL struct{}

var (
	adminuserAllColumns            = []string{"id", "email", "authType", "password", "salt", "googleOAuth2AccessToken", "googleOAuth2ExpiryDate", "googleOAuth2IdToken", "googleOAuth2RefreshToken", "googleOAuth2TokenType", "createdAt", "updatedAt"}
	adminuserColumnsWithoutDefault = []string{"email", "authType", "password", "salt", "googleOAuth2AccessToken", "googleOAuth2ExpiryDate", "googleOAuth2IdToken", "googleOAuth2RefreshToken", "googleOAuth2TokenType", "createdAt", "updatedAt"}
	adminuserColumnsWithDefault    = []string{"id"}
	adminuserPrimaryKeyColumns     = []string{"id"}
)

type (
	// AdminuserSlice is an alias for a slice of pointers to Adminuser.
	// This should almost always be used instead of []Adminuser.
	AdminuserSlice []*Adminuser
	// AdminuserHook is the signature for custom Adminuser hook methods
	AdminuserHook func(context.Context, boil.ContextExecutor, *Adminuser) error

	adminuserQuery struct {
		*queries.Query
	}
)

// Cache for insert, update and upsert
var (
	adminuserType                 = reflect.TypeOf(&Adminuser{})
	adminuserMapping              = queries.MakeStructMapping(adminuserType)
	adminuserPrimaryKeyMapping, _ = queries.BindMapping(adminuserType, adminuserMapping, adminuserPrimaryKeyColumns)
	adminuserInsertCacheMut       sync.RWMutex
	adminuserInsertCache          = make(map[string]insertCache)
	adminuserUpdateCacheMut       sync.RWMutex
	adminuserUpdateCache          = make(map[string]updateCache)
	adminuserUpsertCacheMut       sync.RWMutex
	adminuserUpsertCache          = make(map[string]insertCache)
)

var (
	// Force time package dependency for automated UpdatedAt/CreatedAt.
	_ = time.Second
	// Force qmhelper dependency for where clause generation (which doesn't
	// always happen)
	_ = qmhelper.Where
)

var adminuserBeforeInsertHooks []AdminuserHook
var adminuserBeforeUpdateHooks []AdminuserHook
var adminuserBeforeDeleteHooks []AdminuserHook
var adminuserBeforeUpsertHooks []AdminuserHook

var adminuserAfterInsertHooks []AdminuserHook
var adminuserAfterSelectHooks []AdminuserHook
var adminuserAfterUpdateHooks []AdminuserHook
var adminuserAfterDeleteHooks []AdminuserHook
var adminuserAfterUpsertHooks []AdminuserHook

// doBeforeInsertHooks executes all "before insert" hooks.
func (o *Adminuser) doBeforeInsertHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	if boil.HooksAreSkipped(ctx) {
		return nil
	}

	for _, hook := range adminuserBeforeInsertHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doBeforeUpdateHooks executes all "before Update" hooks.
func (o *Adminuser) doBeforeUpdateHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	if boil.HooksAreSkipped(ctx) {
		return nil
	}

	for _, hook := range adminuserBeforeUpdateHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doBeforeDeleteHooks executes all "before Delete" hooks.
func (o *Adminuser) doBeforeDeleteHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	if boil.HooksAreSkipped(ctx) {
		return nil
	}

	for _, hook := range adminuserBeforeDeleteHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doBeforeUpsertHooks executes all "before Upsert" hooks.
func (o *Adminuser) doBeforeUpsertHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	if boil.HooksAreSkipped(ctx) {
		return nil
	}

	for _, hook := range adminuserBeforeUpsertHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doAfterInsertHooks executes all "after Insert" hooks.
func (o *Adminuser) doAfterInsertHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	if boil.HooksAreSkipped(ctx) {
		return nil
	}

	for _, hook := range adminuserAfterInsertHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doAfterSelectHooks executes all "after Select" hooks.
func (o *Adminuser) doAfterSelectHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	if boil.HooksAreSkipped(ctx) {
		return nil
	}

	for _, hook := range adminuserAfterSelectHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doAfterUpdateHooks executes all "after Update" hooks.
func (o *Adminuser) doAfterUpdateHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	if boil.HooksAreSkipped(ctx) {
		return nil
	}

	for _, hook := range adminuserAfterUpdateHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doAfterDeleteHooks executes all "after Delete" hooks.
func (o *Adminuser) doAfterDeleteHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	if boil.HooksAreSkipped(ctx) {
		return nil
	}

	for _, hook := range adminuserAfterDeleteHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// doAfterUpsertHooks executes all "after Upsert" hooks.
func (o *Adminuser) doAfterUpsertHooks(ctx context.Context, exec boil.ContextExecutor) (err error) {
	if boil.HooksAreSkipped(ctx) {
		return nil
	}

	for _, hook := range adminuserAfterUpsertHooks {
		if err := hook(ctx, exec, o); err != nil {
			return err
		}
	}

	return nil
}

// AddAdminuserHook registers your hook function for all future operations.
func AddAdminuserHook(hookPoint boil.HookPoint, adminuserHook AdminuserHook) {
	switch hookPoint {
	case boil.BeforeInsertHook:
		adminuserBeforeInsertHooks = append(adminuserBeforeInsertHooks, adminuserHook)
	case boil.BeforeUpdateHook:
		adminuserBeforeUpdateHooks = append(adminuserBeforeUpdateHooks, adminuserHook)
	case boil.BeforeDeleteHook:
		adminuserBeforeDeleteHooks = append(adminuserBeforeDeleteHooks, adminuserHook)
	case boil.BeforeUpsertHook:
		adminuserBeforeUpsertHooks = append(adminuserBeforeUpsertHooks, adminuserHook)
	case boil.AfterInsertHook:
		adminuserAfterInsertHooks = append(adminuserAfterInsertHooks, adminuserHook)
	case boil.AfterSelectHook:
		adminuserAfterSelectHooks = append(adminuserAfterSelectHooks, adminuserHook)
	case boil.AfterUpdateHook:
		adminuserAfterUpdateHooks = append(adminuserAfterUpdateHooks, adminuserHook)
	case boil.AfterDeleteHook:
		adminuserAfterDeleteHooks = append(adminuserAfterDeleteHooks, adminuserHook)
	case boil.AfterUpsertHook:
		adminuserAfterUpsertHooks = append(adminuserAfterUpsertHooks, adminuserHook)
	}
}

// One returns a single adminuser record from the query.
func (q adminuserQuery) One(ctx context.Context, exec boil.ContextExecutor) (*Adminuser, error) {
	o := &Adminuser{}

	queries.SetLimit(q.Query, 1)

	err := q.Bind(ctx, exec, o)
	if err != nil {
		if errors.Cause(err) == sql.ErrNoRows {
			return nil, sql.ErrNoRows
		}
		return nil, errors.Wrap(err, "models: failed to execute a one query for adminusers")
	}

	if err := o.doAfterSelectHooks(ctx, exec); err != nil {
		return o, err
	}

	return o, nil
}

// All returns all Adminuser records from the query.
func (q adminuserQuery) All(ctx context.Context, exec boil.ContextExecutor) (AdminuserSlice, error) {
	var o []*Adminuser

	err := q.Bind(ctx, exec, &o)
	if err != nil {
		return nil, errors.Wrap(err, "models: failed to assign all query results to Adminuser slice")
	}

	if len(adminuserAfterSelectHooks) != 0 {
		for _, obj := range o {
			if err := obj.doAfterSelectHooks(ctx, exec); err != nil {
				return o, err
			}
		}
	}

	return o, nil
}

// Count returns the count of all Adminuser records in the query.
func (q adminuserQuery) Count(ctx context.Context, exec boil.ContextExecutor) (int64, error) {
	var count int64

	queries.SetSelect(q.Query, nil)
	queries.SetCount(q.Query)

	err := q.Query.QueryRowContext(ctx, exec).Scan(&count)
	if err != nil {
		return 0, errors.Wrap(err, "models: failed to count adminusers rows")
	}

	return count, nil
}

// Exists checks if the row exists in the table.
func (q adminuserQuery) Exists(ctx context.Context, exec boil.ContextExecutor) (bool, error) {
	var count int64

	queries.SetSelect(q.Query, nil)
	queries.SetCount(q.Query)
	queries.SetLimit(q.Query, 1)

	err := q.Query.QueryRowContext(ctx, exec).Scan(&count)
	if err != nil {
		return false, errors.Wrap(err, "models: failed to check if adminusers exists")
	}

	return count > 0, nil
}

// Adminusers retrieves all the records using an executor.
func Adminusers(mods ...qm.QueryMod) adminuserQuery {
	mods = append(mods, qm.From("`adminusers`"))
	return adminuserQuery{NewQuery(mods...)}
}

// FindAdminuser retrieves a single record by ID with an executor.
// If selectCols is empty Find will return all columns.
func FindAdminuser(ctx context.Context, exec boil.ContextExecutor, iD uint, selectCols ...string) (*Adminuser, error) {
	adminuserObj := &Adminuser{}

	sel := "*"
	if len(selectCols) > 0 {
		sel = strings.Join(strmangle.IdentQuoteSlice(dialect.LQ, dialect.RQ, selectCols), ",")
	}
	query := fmt.Sprintf(
		"select %s from `adminusers` where `id`=?", sel,
	)

	q := queries.Raw(query, iD)

	err := q.Bind(ctx, exec, adminuserObj)
	if err != nil {
		if errors.Cause(err) == sql.ErrNoRows {
			return nil, sql.ErrNoRows
		}
		return nil, errors.Wrap(err, "models: unable to select from adminusers")
	}

	if err = adminuserObj.doAfterSelectHooks(ctx, exec); err != nil {
		return adminuserObj, err
	}

	return adminuserObj, nil
}

// Insert a single record using an executor.
// See boil.Columns.InsertColumnSet documentation to understand column list inference for inserts.
func (o *Adminuser) Insert(ctx context.Context, exec boil.ContextExecutor, columns boil.Columns) error {
	if o == nil {
		return errors.New("models: no adminusers provided for insertion")
	}

	var err error

	if err := o.doBeforeInsertHooks(ctx, exec); err != nil {
		return err
	}

	nzDefaults := queries.NonZeroDefaultSet(adminuserColumnsWithDefault, o)

	key := makeCacheKey(columns, nzDefaults)
	adminuserInsertCacheMut.RLock()
	cache, cached := adminuserInsertCache[key]
	adminuserInsertCacheMut.RUnlock()

	if !cached {
		wl, returnColumns := columns.InsertColumnSet(
			adminuserAllColumns,
			adminuserColumnsWithDefault,
			adminuserColumnsWithoutDefault,
			nzDefaults,
		)

		cache.valueMapping, err = queries.BindMapping(adminuserType, adminuserMapping, wl)
		if err != nil {
			return err
		}
		cache.retMapping, err = queries.BindMapping(adminuserType, adminuserMapping, returnColumns)
		if err != nil {
			return err
		}
		if len(wl) != 0 {
			cache.query = fmt.Sprintf("INSERT INTO `adminusers` (`%s`) %%sVALUES (%s)%%s", strings.Join(wl, "`,`"), strmangle.Placeholders(dialect.UseIndexPlaceholders, len(wl), 1, 1))
		} else {
			cache.query = "INSERT INTO `adminusers` () VALUES ()%s%s"
		}

		var queryOutput, queryReturning string

		if len(cache.retMapping) != 0 {
			cache.retQuery = fmt.Sprintf("SELECT `%s` FROM `adminusers` WHERE %s", strings.Join(returnColumns, "`,`"), strmangle.WhereClause("`", "`", 0, adminuserPrimaryKeyColumns))
		}

		cache.query = fmt.Sprintf(cache.query, queryOutput, queryReturning)
	}

	value := reflect.Indirect(reflect.ValueOf(o))
	vals := queries.ValuesFromMapping(value, cache.valueMapping)

	if boil.IsDebug(ctx) {
		writer := boil.DebugWriterFrom(ctx)
		fmt.Fprintln(writer, cache.query)
		fmt.Fprintln(writer, vals)
	}
	result, err := exec.ExecContext(ctx, cache.query, vals...)

	if err != nil {
		return errors.Wrap(err, "models: unable to insert into adminusers")
	}

	var lastID int64
	var identifierCols []interface{}

	if len(cache.retMapping) == 0 {
		goto CacheNoHooks
	}

	lastID, err = result.LastInsertId()
	if err != nil {
		return ErrSyncFail
	}

	o.ID = uint(lastID)
	if lastID != 0 && len(cache.retMapping) == 1 && cache.retMapping[0] == adminuserMapping["id"] {
		goto CacheNoHooks
	}

	identifierCols = []interface{}{
		o.ID,
	}

	if boil.IsDebug(ctx) {
		writer := boil.DebugWriterFrom(ctx)
		fmt.Fprintln(writer, cache.retQuery)
		fmt.Fprintln(writer, identifierCols...)
	}
	err = exec.QueryRowContext(ctx, cache.retQuery, identifierCols...).Scan(queries.PtrsFromMapping(value, cache.retMapping)...)
	if err != nil {
		return errors.Wrap(err, "models: unable to populate default values for adminusers")
	}

CacheNoHooks:
	if !cached {
		adminuserInsertCacheMut.Lock()
		adminuserInsertCache[key] = cache
		adminuserInsertCacheMut.Unlock()
	}

	return o.doAfterInsertHooks(ctx, exec)
}

// Update uses an executor to update the Adminuser.
// See boil.Columns.UpdateColumnSet documentation to understand column list inference for updates.
// Update does not automatically update the record in case of default values. Use .Reload() to refresh the records.
func (o *Adminuser) Update(ctx context.Context, exec boil.ContextExecutor, columns boil.Columns) (int64, error) {
	var err error
	if err = o.doBeforeUpdateHooks(ctx, exec); err != nil {
		return 0, err
	}
	key := makeCacheKey(columns, nil)
	adminuserUpdateCacheMut.RLock()
	cache, cached := adminuserUpdateCache[key]
	adminuserUpdateCacheMut.RUnlock()

	if !cached {
		wl := columns.UpdateColumnSet(
			adminuserAllColumns,
			adminuserPrimaryKeyColumns,
		)

		if !columns.IsWhitelist() {
			wl = strmangle.SetComplement(wl, []string{"created_at"})
		}
		if len(wl) == 0 {
			return 0, errors.New("models: unable to update adminusers, could not build whitelist")
		}

		cache.query = fmt.Sprintf("UPDATE `adminusers` SET %s WHERE %s",
			strmangle.SetParamNames("`", "`", 0, wl),
			strmangle.WhereClause("`", "`", 0, adminuserPrimaryKeyColumns),
		)
		cache.valueMapping, err = queries.BindMapping(adminuserType, adminuserMapping, append(wl, adminuserPrimaryKeyColumns...))
		if err != nil {
			return 0, err
		}
	}

	values := queries.ValuesFromMapping(reflect.Indirect(reflect.ValueOf(o)), cache.valueMapping)

	if boil.IsDebug(ctx) {
		writer := boil.DebugWriterFrom(ctx)
		fmt.Fprintln(writer, cache.query)
		fmt.Fprintln(writer, values)
	}
	var result sql.Result
	result, err = exec.ExecContext(ctx, cache.query, values...)
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to update adminusers row")
	}

	rowsAff, err := result.RowsAffected()
	if err != nil {
		return 0, errors.Wrap(err, "models: failed to get rows affected by update for adminusers")
	}

	if !cached {
		adminuserUpdateCacheMut.Lock()
		adminuserUpdateCache[key] = cache
		adminuserUpdateCacheMut.Unlock()
	}

	return rowsAff, o.doAfterUpdateHooks(ctx, exec)
}

// UpdateAll updates all rows with the specified column values.
func (q adminuserQuery) UpdateAll(ctx context.Context, exec boil.ContextExecutor, cols M) (int64, error) {
	queries.SetUpdate(q.Query, cols)

	result, err := q.Query.ExecContext(ctx, exec)
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to update all for adminusers")
	}

	rowsAff, err := result.RowsAffected()
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to retrieve rows affected for adminusers")
	}

	return rowsAff, nil
}

// UpdateAll updates all rows with the specified column values, using an executor.
func (o AdminuserSlice) UpdateAll(ctx context.Context, exec boil.ContextExecutor, cols M) (int64, error) {
	ln := int64(len(o))
	if ln == 0 {
		return 0, nil
	}

	if len(cols) == 0 {
		return 0, errors.New("models: update all requires at least one column argument")
	}

	colNames := make([]string, len(cols))
	args := make([]interface{}, len(cols))

	i := 0
	for name, value := range cols {
		colNames[i] = name
		args[i] = value
		i++
	}

	// Append all of the primary key values for each column
	for _, obj := range o {
		pkeyArgs := queries.ValuesFromMapping(reflect.Indirect(reflect.ValueOf(obj)), adminuserPrimaryKeyMapping)
		args = append(args, pkeyArgs...)
	}

	sql := fmt.Sprintf("UPDATE `adminusers` SET %s WHERE %s",
		strmangle.SetParamNames("`", "`", 0, colNames),
		strmangle.WhereClauseRepeated(string(dialect.LQ), string(dialect.RQ), 0, adminuserPrimaryKeyColumns, len(o)))

	if boil.IsDebug(ctx) {
		writer := boil.DebugWriterFrom(ctx)
		fmt.Fprintln(writer, sql)
		fmt.Fprintln(writer, args...)
	}
	result, err := exec.ExecContext(ctx, sql, args...)
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to update all in adminuser slice")
	}

	rowsAff, err := result.RowsAffected()
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to retrieve rows affected all in update all adminuser")
	}
	return rowsAff, nil
}

var mySQLAdminuserUniqueColumns = []string{
	"id",
	"email",
}

// Upsert attempts an insert using an executor, and does an update or ignore on conflict.
// See boil.Columns documentation for how to properly use updateColumns and insertColumns.
func (o *Adminuser) Upsert(ctx context.Context, exec boil.ContextExecutor, updateColumns, insertColumns boil.Columns) error {
	if o == nil {
		return errors.New("models: no adminusers provided for upsert")
	}

	if err := o.doBeforeUpsertHooks(ctx, exec); err != nil {
		return err
	}

	nzDefaults := queries.NonZeroDefaultSet(adminuserColumnsWithDefault, o)
	nzUniques := queries.NonZeroDefaultSet(mySQLAdminuserUniqueColumns, o)

	if len(nzUniques) == 0 {
		return errors.New("cannot upsert with a table that cannot conflict on a unique column")
	}

	// Build cache key in-line uglily - mysql vs psql problems
	buf := strmangle.GetBuffer()
	buf.WriteString(strconv.Itoa(updateColumns.Kind))
	for _, c := range updateColumns.Cols {
		buf.WriteString(c)
	}
	buf.WriteByte('.')
	buf.WriteString(strconv.Itoa(insertColumns.Kind))
	for _, c := range insertColumns.Cols {
		buf.WriteString(c)
	}
	buf.WriteByte('.')
	for _, c := range nzDefaults {
		buf.WriteString(c)
	}
	buf.WriteByte('.')
	for _, c := range nzUniques {
		buf.WriteString(c)
	}
	key := buf.String()
	strmangle.PutBuffer(buf)

	adminuserUpsertCacheMut.RLock()
	cache, cached := adminuserUpsertCache[key]
	adminuserUpsertCacheMut.RUnlock()

	var err error

	if !cached {
		insert, ret := insertColumns.InsertColumnSet(
			adminuserAllColumns,
			adminuserColumnsWithDefault,
			adminuserColumnsWithoutDefault,
			nzDefaults,
		)
		update := updateColumns.UpdateColumnSet(
			adminuserAllColumns,
			adminuserPrimaryKeyColumns,
		)

		if !updateColumns.IsNone() && len(update) == 0 {
			return errors.New("models: unable to upsert adminusers, could not build update column list")
		}

		ret = strmangle.SetComplement(ret, nzUniques)
		cache.query = buildUpsertQueryMySQL(dialect, "`adminusers`", update, insert)
		cache.retQuery = fmt.Sprintf(
			"SELECT %s FROM `adminusers` WHERE %s",
			strings.Join(strmangle.IdentQuoteSlice(dialect.LQ, dialect.RQ, ret), ","),
			strmangle.WhereClause("`", "`", 0, nzUniques),
		)

		cache.valueMapping, err = queries.BindMapping(adminuserType, adminuserMapping, insert)
		if err != nil {
			return err
		}
		if len(ret) != 0 {
			cache.retMapping, err = queries.BindMapping(adminuserType, adminuserMapping, ret)
			if err != nil {
				return err
			}
		}
	}

	value := reflect.Indirect(reflect.ValueOf(o))
	vals := queries.ValuesFromMapping(value, cache.valueMapping)
	var returns []interface{}
	if len(cache.retMapping) != 0 {
		returns = queries.PtrsFromMapping(value, cache.retMapping)
	}

	if boil.IsDebug(ctx) {
		writer := boil.DebugWriterFrom(ctx)
		fmt.Fprintln(writer, cache.query)
		fmt.Fprintln(writer, vals)
	}
	result, err := exec.ExecContext(ctx, cache.query, vals...)

	if err != nil {
		return errors.Wrap(err, "models: unable to upsert for adminusers")
	}

	var lastID int64
	var uniqueMap []uint64
	var nzUniqueCols []interface{}

	if len(cache.retMapping) == 0 {
		goto CacheNoHooks
	}

	lastID, err = result.LastInsertId()
	if err != nil {
		return ErrSyncFail
	}

	o.ID = uint(lastID)
	if lastID != 0 && len(cache.retMapping) == 1 && cache.retMapping[0] == adminuserMapping["id"] {
		goto CacheNoHooks
	}

	uniqueMap, err = queries.BindMapping(adminuserType, adminuserMapping, nzUniques)
	if err != nil {
		return errors.Wrap(err, "models: unable to retrieve unique values for adminusers")
	}
	nzUniqueCols = queries.ValuesFromMapping(reflect.Indirect(reflect.ValueOf(o)), uniqueMap)

	if boil.IsDebug(ctx) {
		writer := boil.DebugWriterFrom(ctx)
		fmt.Fprintln(writer, cache.retQuery)
		fmt.Fprintln(writer, nzUniqueCols...)
	}
	err = exec.QueryRowContext(ctx, cache.retQuery, nzUniqueCols...).Scan(returns...)
	if err != nil {
		return errors.Wrap(err, "models: unable to populate default values for adminusers")
	}

CacheNoHooks:
	if !cached {
		adminuserUpsertCacheMut.Lock()
		adminuserUpsertCache[key] = cache
		adminuserUpsertCacheMut.Unlock()
	}

	return o.doAfterUpsertHooks(ctx, exec)
}

// Delete deletes a single Adminuser record with an executor.
// Delete will match against the primary key column to find the record to delete.
func (o *Adminuser) Delete(ctx context.Context, exec boil.ContextExecutor) (int64, error) {
	if o == nil {
		return 0, errors.New("models: no Adminuser provided for delete")
	}

	if err := o.doBeforeDeleteHooks(ctx, exec); err != nil {
		return 0, err
	}

	args := queries.ValuesFromMapping(reflect.Indirect(reflect.ValueOf(o)), adminuserPrimaryKeyMapping)
	sql := "DELETE FROM `adminusers` WHERE `id`=?"

	if boil.IsDebug(ctx) {
		writer := boil.DebugWriterFrom(ctx)
		fmt.Fprintln(writer, sql)
		fmt.Fprintln(writer, args...)
	}
	result, err := exec.ExecContext(ctx, sql, args...)
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to delete from adminusers")
	}

	rowsAff, err := result.RowsAffected()
	if err != nil {
		return 0, errors.Wrap(err, "models: failed to get rows affected by delete for adminusers")
	}

	if err := o.doAfterDeleteHooks(ctx, exec); err != nil {
		return 0, err
	}

	return rowsAff, nil
}

// DeleteAll deletes all matching rows.
func (q adminuserQuery) DeleteAll(ctx context.Context, exec boil.ContextExecutor) (int64, error) {
	if q.Query == nil {
		return 0, errors.New("models: no adminuserQuery provided for delete all")
	}

	queries.SetDelete(q.Query)

	result, err := q.Query.ExecContext(ctx, exec)
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to delete all from adminusers")
	}

	rowsAff, err := result.RowsAffected()
	if err != nil {
		return 0, errors.Wrap(err, "models: failed to get rows affected by deleteall for adminusers")
	}

	return rowsAff, nil
}

// DeleteAll deletes all rows in the slice, using an executor.
func (o AdminuserSlice) DeleteAll(ctx context.Context, exec boil.ContextExecutor) (int64, error) {
	if len(o) == 0 {
		return 0, nil
	}

	if len(adminuserBeforeDeleteHooks) != 0 {
		for _, obj := range o {
			if err := obj.doBeforeDeleteHooks(ctx, exec); err != nil {
				return 0, err
			}
		}
	}

	var args []interface{}
	for _, obj := range o {
		pkeyArgs := queries.ValuesFromMapping(reflect.Indirect(reflect.ValueOf(obj)), adminuserPrimaryKeyMapping)
		args = append(args, pkeyArgs...)
	}

	sql := "DELETE FROM `adminusers` WHERE " +
		strmangle.WhereClauseRepeated(string(dialect.LQ), string(dialect.RQ), 0, adminuserPrimaryKeyColumns, len(o))

	if boil.IsDebug(ctx) {
		writer := boil.DebugWriterFrom(ctx)
		fmt.Fprintln(writer, sql)
		fmt.Fprintln(writer, args)
	}
	result, err := exec.ExecContext(ctx, sql, args...)
	if err != nil {
		return 0, errors.Wrap(err, "models: unable to delete all from adminuser slice")
	}

	rowsAff, err := result.RowsAffected()
	if err != nil {
		return 0, errors.Wrap(err, "models: failed to get rows affected by deleteall for adminusers")
	}

	if len(adminuserAfterDeleteHooks) != 0 {
		for _, obj := range o {
			if err := obj.doAfterDeleteHooks(ctx, exec); err != nil {
				return 0, err
			}
		}
	}

	return rowsAff, nil
}

// Reload refetches the object from the database
// using the primary keys with an executor.
func (o *Adminuser) Reload(ctx context.Context, exec boil.ContextExecutor) error {
	ret, err := FindAdminuser(ctx, exec, o.ID)
	if err != nil {
		return err
	}

	*o = *ret
	return nil
}

// ReloadAll refetches every row with matching primary key column values
// and overwrites the original object slice with the newly updated slice.
func (o *AdminuserSlice) ReloadAll(ctx context.Context, exec boil.ContextExecutor) error {
	if o == nil || len(*o) == 0 {
		return nil
	}

	slice := AdminuserSlice{}
	var args []interface{}
	for _, obj := range *o {
		pkeyArgs := queries.ValuesFromMapping(reflect.Indirect(reflect.ValueOf(obj)), adminuserPrimaryKeyMapping)
		args = append(args, pkeyArgs...)
	}

	sql := "SELECT `adminusers`.* FROM `adminusers` WHERE " +
		strmangle.WhereClauseRepeated(string(dialect.LQ), string(dialect.RQ), 0, adminuserPrimaryKeyColumns, len(*o))

	q := queries.Raw(sql, args...)

	err := q.Bind(ctx, exec, &slice)
	if err != nil {
		return errors.Wrap(err, "models: unable to reload all in AdminuserSlice")
	}

	*o = slice

	return nil
}

// AdminuserExists checks if the Adminuser row exists.
func AdminuserExists(ctx context.Context, exec boil.ContextExecutor, iD uint) (bool, error) {
	var exists bool
	sql := "select exists(select 1 from `adminusers` where `id`=? limit 1)"

	if boil.IsDebug(ctx) {
		writer := boil.DebugWriterFrom(ctx)
		fmt.Fprintln(writer, sql)
		fmt.Fprintln(writer, iD)
	}
	row := exec.QueryRowContext(ctx, sql, iD)

	err := row.Scan(&exists)
	if err != nil {
		return false, errors.Wrap(err, "models: unable to check if adminusers exists")
	}

	return exists, nil
}

// Package adminusers provides primitives to interact with the openapi HTTP API.
//
// Code generated by github.com/deepmap/oapi-codegen version v1.8.1 DO NOT EDIT.
package adminusers

import (
	"bytes"
	"compress/gzip"
	"context"
	"encoding/base64"
	"fmt"
	"net/http"
	"net/url"
	"path"
	"strings"

	externalRef0 "github.com/cam-inc/viron/packages/golang/routes/components"
	"github.com/deepmap/oapi-codegen/pkg/runtime"
	openapi_types "github.com/deepmap/oapi-codegen/pkg/types"
	"github.com/getkin/kin-openapi/openapi3"
	"github.com/go-chi/chi/v5"
)

const (
	JwtScopes = "jwt.Scopes"
)

// VironAdminUser defines model for VironAdminUser.
type VironAdminUser struct {

	// 認証タイプ
	AuthType string `json:"authType"`

	// 作成日時
	CreatedAt *int64 `json:"createdAt,omitempty"`

	// Eメールアドレス
	Email openapi_types.Email `json:"email"`

	// 管理ユーザーID
	Id string `json:"id"`

	// ロール一覧
	RoleIds *[]string `json:"roleIds,omitempty"`

	// 更新日時
	UpdatedAt *int64 `json:"updatedAt,omitempty"`
}

// VironAdminUserCreatePayload defines model for VironAdminUserCreatePayload.
type VironAdminUserCreatePayload struct {

	// Eメールアドレス
	Email openapi_types.Email `json:"email"`

	// パスワード
	Password string `json:"password"`

	// ロールID
	RoleIds *[]string `json:"roleIds,omitempty"`
}

// VironAdminUserList defines model for VironAdminUserList.
type VironAdminUserList []VironAdminUser

// VironAdminUserListWithPager defines model for VironAdminUserListWithPager.
type VironAdminUserListWithPager struct {
	// Embedded struct due to allOf(./components.yaml#/components/schemas/VironPager)
	externalRef0.VironPager `yaml:",inline"`
	// Embedded fields due to inline allOf schema
	List VironAdminUserList `json:"list"`
}

// VironAdminUserUpdatePayload defines model for VironAdminUserUpdatePayload.
type VironAdminUserUpdatePayload struct {

	// パスワード
	Password *string `json:"password,omitempty"`

	// ロールID
	RoleIds *[]string `json:"roleIds,omitempty"`
}

// ListVironAdminUsersParams defines parameters for ListVironAdminUsers.
type ListVironAdminUsersParams struct {
	Id     *externalRef0.VironIdQueryParam     `json:"id,omitempty"`
	Email  *externalRef0.VironEmailQueryParam  `json:"email,omitempty"`
	RoleId *externalRef0.VironRoleIdQueryParam `json:"roleId,omitempty"`

	// Size of list
	Size *externalRef0.VironPagerSizeQueryParam `json:"size,omitempty"`

	// Page number of list
	Page *externalRef0.VironPagerPageQueryParam `json:"page,omitempty"`

	// Sort specification of list
	Sort *externalRef0.VironSortQueryParam `json:"sort,omitempty"`
}

// CreateVironAdminUserJSONBody defines parameters for CreateVironAdminUser.
type CreateVironAdminUserJSONBody VironAdminUserCreatePayload

// UpdateVironAdminUserJSONBody defines parameters for UpdateVironAdminUser.
type UpdateVironAdminUserJSONBody VironAdminUserUpdatePayload

// CreateVironAdminUserJSONRequestBody defines body for CreateVironAdminUser for application/json ContentType.
type CreateVironAdminUserJSONRequestBody CreateVironAdminUserJSONBody

// UpdateVironAdminUserJSONRequestBody defines body for UpdateVironAdminUser for application/json ContentType.
type UpdateVironAdminUserJSONRequestBody UpdateVironAdminUserJSONBody

// ServerInterface represents all server handlers.
type ServerInterface interface {
	// list admin users
	// (GET /viron/adminusers)
	ListVironAdminUsers(w http.ResponseWriter, r *http.Request, params ListVironAdminUsersParams)
	// create an admin user
	// (POST /viron/adminusers)
	CreateVironAdminUser(w http.ResponseWriter, r *http.Request)
	// remove an admin user
	// (DELETE /viron/adminusers/{id})
	RemoveVironAdminUser(w http.ResponseWriter, r *http.Request, id externalRef0.VironIdPathParam)
	// update an admin user
	// (PUT /viron/adminusers/{id})
	UpdateVironAdminUser(w http.ResponseWriter, r *http.Request, id externalRef0.VironIdPathParam)
}

// ServerInterfaceWrapper converts contexts to parameters.
type ServerInterfaceWrapper struct {
	Handler            ServerInterface
	HandlerMiddlewares []MiddlewareFunc
}

type MiddlewareFunc func(http.HandlerFunc) http.HandlerFunc

// ListVironAdminUsers operation middleware
func (siw *ServerInterfaceWrapper) ListVironAdminUsers(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	ctx = context.WithValue(ctx, JwtScopes, []string{""})

	// Parameter object where we will unmarshal all parameters from the context
	var params ListVironAdminUsersParams

	// ------------- Optional query parameter "id" -------------
	if paramValue := r.URL.Query().Get("id"); paramValue != "" {

	}

	err = runtime.BindQueryParameter("form", true, false, "id", r.URL.Query(), &params.Id)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid format for parameter id: %s", err), http.StatusBadRequest)
		return
	}

	// ------------- Optional query parameter "email" -------------
	if paramValue := r.URL.Query().Get("email"); paramValue != "" {

	}

	err = runtime.BindQueryParameter("form", true, false, "email", r.URL.Query(), &params.Email)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid format for parameter email: %s", err), http.StatusBadRequest)
		return
	}

	// ------------- Optional query parameter "roleId" -------------
	if paramValue := r.URL.Query().Get("roleId"); paramValue != "" {

	}

	err = runtime.BindQueryParameter("form", true, false, "roleId", r.URL.Query(), &params.RoleId)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid format for parameter roleId: %s", err), http.StatusBadRequest)
		return
	}

	// ------------- Optional query parameter "size" -------------
	if paramValue := r.URL.Query().Get("size"); paramValue != "" {

	}

	err = runtime.BindQueryParameter("form", true, false, "size", r.URL.Query(), &params.Size)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid format for parameter size: %s", err), http.StatusBadRequest)
		return
	}

	// ------------- Optional query parameter "page" -------------
	if paramValue := r.URL.Query().Get("page"); paramValue != "" {

	}

	err = runtime.BindQueryParameter("form", true, false, "page", r.URL.Query(), &params.Page)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid format for parameter page: %s", err), http.StatusBadRequest)
		return
	}

	// ------------- Optional query parameter "sort" -------------
	if paramValue := r.URL.Query().Get("sort"); paramValue != "" {

	}

	err = runtime.BindQueryParameter("form", false, false, "sort", r.URL.Query(), &params.Sort)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid format for parameter sort: %s", err), http.StatusBadRequest)
		return
	}

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.ListVironAdminUsers(w, r, params)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// CreateVironAdminUser operation middleware
func (siw *ServerInterfaceWrapper) CreateVironAdminUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	ctx = context.WithValue(ctx, JwtScopes, []string{""})

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.CreateVironAdminUser(w, r)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// RemoveVironAdminUser operation middleware
func (siw *ServerInterfaceWrapper) RemoveVironAdminUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	// ------------- Path parameter "id" -------------
	var id externalRef0.VironIdPathParam

	err = runtime.BindStyledParameter("simple", false, "id", chi.URLParam(r, "id"), &id)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid format for parameter id: %s", err), http.StatusBadRequest)
		return
	}

	ctx = context.WithValue(ctx, JwtScopes, []string{""})

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.RemoveVironAdminUser(w, r, id)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// UpdateVironAdminUser operation middleware
func (siw *ServerInterfaceWrapper) UpdateVironAdminUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	// ------------- Path parameter "id" -------------
	var id externalRef0.VironIdPathParam

	err = runtime.BindStyledParameter("simple", false, "id", chi.URLParam(r, "id"), &id)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid format for parameter id: %s", err), http.StatusBadRequest)
		return
	}

	ctx = context.WithValue(ctx, JwtScopes, []string{""})

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.UpdateVironAdminUser(w, r, id)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// Handler creates http.Handler with routing matching OpenAPI spec.
func Handler(si ServerInterface) http.Handler {
	return HandlerWithOptions(si, ChiServerOptions{})
}

type ChiServerOptions struct {
	BaseURL     string
	BaseRouter  chi.Router
	Middlewares []MiddlewareFunc
}

// HandlerFromMux creates http.Handler with routing matching OpenAPI spec based on the provided mux.
func HandlerFromMux(si ServerInterface, r chi.Router) http.Handler {
	return HandlerWithOptions(si, ChiServerOptions{
		BaseRouter: r,
	})
}

func HandlerFromMuxWithBaseURL(si ServerInterface, r chi.Router, baseURL string) http.Handler {
	return HandlerWithOptions(si, ChiServerOptions{
		BaseURL:    baseURL,
		BaseRouter: r,
	})
}

// HandlerWithOptions creates http.Handler with additional options
func HandlerWithOptions(si ServerInterface, options ChiServerOptions) http.Handler {
	r := options.BaseRouter

	if r == nil {
		r = chi.NewRouter()
	}
	wrapper := ServerInterfaceWrapper{
		Handler:            si,
		HandlerMiddlewares: options.Middlewares,
	}

	r.Group(func(r chi.Router) {
		r.Get(options.BaseURL+"/viron/adminusers", wrapper.ListVironAdminUsers)
	})
	r.Group(func(r chi.Router) {
		r.Post(options.BaseURL+"/viron/adminusers", wrapper.CreateVironAdminUser)
	})
	r.Group(func(r chi.Router) {
		r.Delete(options.BaseURL+"/viron/adminusers/{id}", wrapper.RemoveVironAdminUser)
	})
	r.Group(func(r chi.Router) {
		r.Put(options.BaseURL+"/viron/adminusers/{id}", wrapper.UpdateVironAdminUser)
	})

	return r
}

// Base64 encoded, gzipped, json marshaled Swagger object
var swaggerSpec = []string{

	"H4sIAAAAAAAC/+RXf28URRj+KueAieD29iiEmE1IqcofjSRUEEy8O810973rNPuLmdnicdnE202MxZBg",
	"YyCNmliCYFSqMcZILPJhBq7ttzAzc2zvdu9kgav/8M/d7uzOM+88z/u872wX2YEXBj74nCGri5i9DB5W",
	"l5cIDfx5xyP+RQZUjoQ0CIFyAuo5jvjyB50Q5LUDzKYk5CTwkYV2f7q+++O2SB6J5I5IbyEDcfUeYpwS",
	"v41iA9kUMAdnnhdnP374bf+LG/1bP/Q3EmSgVkA9zJGFiM9PntjHIj6HNlAJBh4mbhHojEg3Rbot0p9F",
	"clukayL9RSQPhiH1xDHhEacIt7O1uXPjc5HelZjJnyLdXnh33FwauLDgsCKASO/rcB7/9dnu3XvIQISD",
	"p14sgAwGMKW4I++j0JnEV/+bP/o3fyvPlwwRLkeEgoOsutyqkRGRadrM5gVLK2BzGcNoQryjFFzEHTfA",
	"TjE7pq9JiBm7ElBnHLFfieSBSH9VyGvDaNkkOZ9zoPL9j9+YO1U9OlfHM1fnZz5qHtG3jYZzZDDUaDiv",
	"zR06/HojqtVmT54++qY584m8Pm6fUn/Q7L5lxC8mvkqassLntHrKTbarZ8t0ljCVM9mKhym0kIUOmfvG",
	"NweuN3OWH5OHRfAPCV9exG1dIbDrnmshq54tUx1aptrBnjt5XQ0SG/lMcgc7KB+42nOeOwVT5KtZ2NRF",
	"ZbWJif2KpmGONjlE/FZQXAFLHisRA8oqOCQVFoJNWsTG8jmTwRLuSqjTq5J20yVLlaE5yECrQJnGqlVr",
	"1WPIQJ/OhLgt6a/LfuVz3a3qXSSFUcALDrKUxKNaSrjLEdBOVuk0MzIRKLAgojaoqaujmZ/tl+MlF1Dc",
	"NJ7ZDHRRF8n63s3f5UXvnuhdF71/RG8DGahNgyjM5u18/ffed7dNfYN0u8mFMMyU2lOluKTO3iAEH4cE",
	"Weh4tVad1Sm2rGQ1NcWKXs2u1UVt4GWaW9akRjk+O5bjEFPsAVcrlDX//hxt3wXnfanUohxWZeCFUM7I",
	"EjkNoPMqUaaBpArbBXIVpgYmf6YBdiGgfBhHuyIMfKZr3WytJv8GllMFPgzdgZfNFSZT5+mZ8flL9H7n",
	"UOVkNCHPvafKDgM7ooR3VFqtXOHIqjdlmCzyPCxtrUyfKyAct2Ue5k0tzRIGjI+ripv6OGLmavjgJNvb",
	"KvpDJOu7jx4+ufa96G2I5MuCUfT56FK+rsiWBIy/HTidA6J29GAWj/ZBTiOICyofO6BQXkpY/YlQwf6Q",
	"uv8lbmwU653ZJU6s9XaBQ5m692Tt2t7GnYKc58ELVotyTqfwLWLphAkWPFGMujSHVEVdnkMDhVGp7iB6",
	"W9lRYuf+mkjW9WfIBDPoM9X/xN5BG2z0gFjKYC+jof70ew4fxNnDLvKxB2POFnEz/jcAAP//QAtEFfoP",
	"AAA=",
}

// GetSwagger returns the content of the embedded swagger specification file
// or error if failed to decode
func decodeSpec() ([]byte, error) {
	zipped, err := base64.StdEncoding.DecodeString(strings.Join(swaggerSpec, ""))
	if err != nil {
		return nil, fmt.Errorf("error base64 decoding spec: %s", err)
	}
	zr, err := gzip.NewReader(bytes.NewReader(zipped))
	if err != nil {
		return nil, fmt.Errorf("error decompressing spec: %s", err)
	}
	var buf bytes.Buffer
	_, err = buf.ReadFrom(zr)
	if err != nil {
		return nil, fmt.Errorf("error decompressing spec: %s", err)
	}

	return buf.Bytes(), nil
}

var rawSpec = decodeSpecCached()

// a naive cached of a decoded swagger spec
func decodeSpecCached() func() ([]byte, error) {
	data, err := decodeSpec()
	return func() ([]byte, error) {
		return data, err
	}
}

// Constructs a synthetic filesystem for resolving external references when loading openapi specifications.
func PathToRawSpec(pathToFile string) map[string]func() ([]byte, error) {
	var res = make(map[string]func() ([]byte, error))
	if len(pathToFile) > 0 {
		res[pathToFile] = rawSpec
	}

	pathPrefix := path.Dir(pathToFile)

	for rawPath, rawFunc := range externalRef0.PathToRawSpec(path.Join(pathPrefix, "./components.yaml")) {
		if _, ok := res[rawPath]; ok {
			// it is not possible to compare functions in golang, so always overwrite the old value
		}
		res[rawPath] = rawFunc
	}
	return res
}

// GetSwagger returns the Swagger specification corresponding to the generated code
// in this file. The external references of Swagger specification are resolved.
// The logic of resolving external references is tightly connected to "import-mapping" feature.
// Externally referenced files must be embedded in the corresponding golang packages.
// Urls can be supported but this task was out of the scope.
func GetSwagger() (swagger *openapi3.T, err error) {
	var resolvePath = PathToRawSpec("")

	loader := openapi3.NewLoader()
	loader.IsExternalRefsAllowed = true
	loader.ReadFromURIFunc = func(loader *openapi3.Loader, url *url.URL) ([]byte, error) {
		var pathToFile = url.String()
		pathToFile = path.Clean(pathToFile)
		getSpec, ok := resolvePath[pathToFile]
		if !ok {
			err1 := fmt.Errorf("path not found: %s", pathToFile)
			return nil, err1
		}
		return getSpec()
	}
	var specData []byte
	specData, err = rawSpec()
	if err != nil {
		return
	}
	swagger, err = loader.LoadFromData(specData)
	if err != nil {
		return
	}
	return
}

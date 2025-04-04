// Package adminroles provides primitives to interact with the openapi HTTP API.
//
// Code generated by github.com/deepmap/oapi-codegen version v1.8.3 DO NOT EDIT.
package adminroles

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
	"github.com/getkin/kin-openapi/openapi3"
	"github.com/go-chi/chi/v5"
)

const (
	JwtScopes = "jwt.Scopes"
)

// Defines values for VironAdminRolePermissionPermission.
const (
	VironAdminRolePermissionPermissionAll VironAdminRolePermissionPermission = "all"

	VironAdminRolePermissionPermissionDeny VironAdminRolePermissionPermission = "deny"

	VironAdminRolePermissionPermissionRead VironAdminRolePermissionPermission = "read"

	VironAdminRolePermissionPermissionWrite VironAdminRolePermissionPermission = "write"
)

// VironAdminRole defines model for VironAdminRole.
type VironAdminRole struct {
	// ロールID
	Id string `json:"id"`

	// 権限
	Permissions []VironAdminRolePermission `json:"permissions"`
}

// VironAdminRoleCreatePayload defines model for VironAdminRoleCreatePayload.
type VironAdminRoleCreatePayload struct {
	// ロールID
	Id string `json:"id"`

	// 権限
	Permissions []VironAdminRolePermission `json:"permissions"`
}

// VironAdminRoleList defines model for VironAdminRoleList.
type VironAdminRoleList []VironAdminRole

// VironAdminRoleListWithPager defines model for VironAdminRoleListWithPager.
type VironAdminRoleListWithPager struct {
	// Embedded struct due to allOf(./components.yaml#/components/schemas/VironPager)
	externalRef0.VironPager `yaml:",inline"`
	// Embedded fields due to inline allOf schema
	List VironAdminRoleList `json:"list"`
}

// VironAdminRolePermission defines model for VironAdminRolePermission.
type VironAdminRolePermission struct {
	Permission VironAdminRolePermissionPermission `json:"permission"`
	ResourceId string                             `json:"resourceId"`
}

// VironAdminRolePermissionPermission defines model for VironAdminRolePermission.Permission.
type VironAdminRolePermissionPermission string

// VironAdminRoleUpdatePayload defines model for VironAdminRoleUpdatePayload.
type VironAdminRoleUpdatePayload struct {
	// 権限
	Permissions []VironAdminRolePermission `json:"permissions"`
}

// ListVironAdminRolesParams defines parameters for ListVironAdminRoles.
type ListVironAdminRolesParams struct {
	// Size of list
	Size *externalRef0.VironPagerSizeQueryParam `json:"size,omitempty"`

	// Page number of list
	Page *externalRef0.VironPagerPageQueryParam `json:"page,omitempty"`
}

// CreateVironAdminRoleJSONBody defines parameters for CreateVironAdminRole.
type CreateVironAdminRoleJSONBody VironAdminRoleCreatePayload

// UpdateVironAdminRoleJSONBody defines parameters for UpdateVironAdminRole.
type UpdateVironAdminRoleJSONBody VironAdminRoleUpdatePayload

// CreateVironAdminRoleJSONRequestBody defines body for CreateVironAdminRole for application/json ContentType.
type CreateVironAdminRoleJSONRequestBody CreateVironAdminRoleJSONBody

// UpdateVironAdminRoleJSONRequestBody defines body for UpdateVironAdminRole for application/json ContentType.
type UpdateVironAdminRoleJSONRequestBody UpdateVironAdminRoleJSONBody

// ServerInterface represents all server handlers.
type ServerInterface interface {
	// list admin roles
	// (GET /viron/adminroles)
	ListVironAdminRoles(w http.ResponseWriter, r *http.Request, params ListVironAdminRolesParams)
	// create an admin role
	// (POST /viron/adminroles)
	CreateVironAdminRole(w http.ResponseWriter, r *http.Request)
	// delete an admin role
	// (DELETE /viron/adminroles/{id})
	RemoveVironAdminRole(w http.ResponseWriter, r *http.Request, id externalRef0.VironIdPathParam)
	// update an admin role
	// (PUT /viron/adminroles/{id})
	UpdateVironAdminRole(w http.ResponseWriter, r *http.Request, id externalRef0.VironIdPathParam)
}

// ServerInterfaceWrapper converts contexts to parameters.
type ServerInterfaceWrapper struct {
	Handler            ServerInterface
	HandlerMiddlewares []MiddlewareFunc
}

type MiddlewareFunc func(http.HandlerFunc) http.HandlerFunc

// ListVironAdminRoles operation middleware
func (siw *ServerInterfaceWrapper) ListVironAdminRoles(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	ctx = context.WithValue(ctx, JwtScopes, []string{""})

	// Parameter object where we will unmarshal all parameters from the context
	var params ListVironAdminRolesParams

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

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.ListVironAdminRoles(w, r, params)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// CreateVironAdminRole operation middleware
func (siw *ServerInterfaceWrapper) CreateVironAdminRole(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	ctx = context.WithValue(ctx, JwtScopes, []string{""})

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.CreateVironAdminRole(w, r)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// RemoveVironAdminRole operation middleware
func (siw *ServerInterfaceWrapper) RemoveVironAdminRole(w http.ResponseWriter, r *http.Request) {
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
		siw.Handler.RemoveVironAdminRole(w, r, id)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// UpdateVironAdminRole operation middleware
func (siw *ServerInterfaceWrapper) UpdateVironAdminRole(w http.ResponseWriter, r *http.Request) {
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
		siw.Handler.UpdateVironAdminRole(w, r, id)
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
		r.Get(options.BaseURL+"/viron/adminroles", wrapper.ListVironAdminRoles)
	})
	r.Group(func(r chi.Router) {
		r.Post(options.BaseURL+"/viron/adminroles", wrapper.CreateVironAdminRole)
	})
	r.Group(func(r chi.Router) {
		r.Delete(options.BaseURL+"/viron/adminroles/{id}", wrapper.RemoveVironAdminRole)
	})
	r.Group(func(r chi.Router) {
		r.Put(options.BaseURL+"/viron/adminroles/{id}", wrapper.UpdateVironAdminRole)
	})

	return r
}

// Base64 encoded, gzipped, json marshaled Swagger object
var swaggerSpec = []string{

	"H4sIAAAAAAAC/+RW3WsTSxT/V8K593Fvkvbep326Xy/lFppbsT6EPEx3T9IpuzPjzGzqGhaMBVFBKD4U",
	"ir4IYhVRRHzwQf1noqn9L2RmQrIf/UitFcGXNHR2zvmd38fZDCDgseAMmVbgD0AFGxgT+3WNSs7+CmPK",
	"VnmE5j9CcoFSU7TnNDSfIapAUqEpZ+DDaPvFaPvdaPv50r/ggU4Fgg9KS8p6kHkgUMZUKcqZqt4dP312",
	"uLcDHlCNsT3/VWIXfPilMcPYmABsFNG1poVNm0lfIiVJIcs8kHg1oRJD8NsGdhFIZ3qBr29ioE2FYvV/",
	"JBKNLZJGnIQ/MxHLVGk78dmBVeEcVfwK1Rst0kNpipMoWumC3562qefa1FMSR8f3dUUyr6xVNJlgfuB2",
	"5jJ3tkyVr05lqJweFd+IwhmyJDalJRIjzJakGsGDEFkKnuEi129mJImKJzLAJevB0nEJdO7ZvPBz6H5Z",
	"hCcF4Edw88lGNk9T1uVVeMT0qkkeoaoRQWtKYEC7NCDalvJAU222H/zZN9AaEV2v5e6AB32UTkNo1pv1",
	"BfDg2m+C9Aw1bbNemXbLtT0AQ5otbOSyJirOa8oJ0qOMOHRaJljUGPrFVE0n1WTdhKzjleY7ePnoYOfW",
	"dB19fHvj85P90c37h7uvzZfh/mh4bzT8MBrugQc9yRMBvlPf3TTCVfvmibEP10p9XBa4QEYEBR9+rzfr",
	"i3Y6vWFN0HB0Wiodk/4AeqirCh05AXglMpePIVOSGDVKNf8emd3JrZJL9Dr+n6BMW+bULpavL2Y+8sU6",
	"VmPBmXI0LDab5s/EOnYVChFNPNnYVG5huMicfZnNdqyNRZHslf9sshQGiaQ6taxtbmnw2x0DUyVxTGQ6",
	"MW8pCJr0DM1lixojCK7mUPb9w/HtnYqy7u27Vva9CT8q/TcP0wsiq/jaz4obx0Qzq+i2cEFQziVVYOeo",
	"EZbT6yS5Mq+azsaAhplTMEKNp2r56c7dw73HFS1XMeb9qpbfIqZLYYsYYx+TqD+qkOcm0M08P4EeiOR0",
	"u48fvBnvvqpQ5N6134mii45Q8YfDXBE6j1CJbXcGp2fTwwEwEuMRL7qsk30JAAD//3s9NCYlDQAA",
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

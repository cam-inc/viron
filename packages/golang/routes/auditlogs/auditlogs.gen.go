// Package auditlogs provides primitives to interact with the openapi HTTP API.
//
// Code generated by github.com/deepmap/oapi-codegen version v1.8.1 DO NOT EDIT.
package auditlogs

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
	"time"

	externalRef0 "github.com/cam-inc/viron/packages/golang/routes/components"
	"github.com/deepmap/oapi-codegen/pkg/runtime"
	"github.com/getkin/kin-openapi/openapi3"
	"github.com/go-chi/chi/v5"
)

const (
	JwtScopes = "jwt.Scopes"
)

// VironAuditLog defines model for VironAuditLog.
type VironAuditLog struct {

	// 日時
	CreatedAt *time.Time `json:"createdAt,omitempty"`

	// リクエストボディ
	RequestBody *string `json:"requestBody,omitempty"`

	// リクエストメソッド
	RequestMethod *string `json:"requestMethod,omitempty"`

	// リクエストURI
	RequestUri *string `json:"requestUri,omitempty"`

	// ソースIP
	SourceIp *string `json:"sourceIp,omitempty"`

	// ステータスコード
	StatusCode *int `json:"statusCode,omitempty"`

	// ユーザーID
	UserId *string `json:"userId,omitempty"`
}

// VironAuditLogList defines model for VironAuditLogList.
type VironAuditLogList []VironAuditLog

// VironAuditLogListWithPager defines model for VironAuditLogListWithPager.
type VironAuditLogListWithPager struct {
	// Embedded struct due to allOf(./components.yaml#/components/schemas/VironPager)
	externalRef0.VironPager `yaml:",inline"`
	// Embedded fields due to inline allOf schema
	List VironAuditLogList `json:"list"`
}

// VironRequestMethodQueryParam defines model for VironRequestMethodQueryParam.
type VironRequestMethodQueryParam string

// VironRequestUriQueryParam defines model for VironRequestUriQueryParam.
type VironRequestUriQueryParam string

// VironSourceIpQueryParam defines model for VironSourceIpQueryParam.
type VironSourceIpQueryParam string

// VironStatusCodeQueryParam defines model for VironStatusCodeQueryParam.
type VironStatusCodeQueryParam int32

// VironUserIdQueryParam defines model for VironUserIdQueryParam.
type VironUserIdQueryParam string

// ListVironAuditlogsParams defines parameters for ListVironAuditlogs.
type ListVironAuditlogsParams struct {
	UserId        *VironUserIdQueryParam        `json:"userId,omitempty"`
	RequestUri    *VironRequestUriQueryParam    `json:"requestUri,omitempty"`
	RequestMethod *VironRequestMethodQueryParam `json:"requestMethod,omitempty"`
	SourceIp      *VironSourceIpQueryParam      `json:"sourceIp,omitempty"`
	StatusCode    *VironStatusCodeQueryParam    `json:"statusCode,omitempty"`

	// Size of list
	Size *externalRef0.VironPagerSizeQueryParam `json:"size,omitempty"`

	// Page number of list
	Page *externalRef0.VironPagerPageQueryParam `json:"page,omitempty"`

	// Sort specification of list
	Sort *externalRef0.VironSortQueryParam `json:"sort,omitempty"`
}

// ServerInterface represents all server handlers.
type ServerInterface interface {
	// list audit logs
	// (GET /viron/auditlogs)
	ListVironAuditlogs(w http.ResponseWriter, r *http.Request, params ListVironAuditlogsParams)
}

// ServerInterfaceWrapper converts contexts to parameters.
type ServerInterfaceWrapper struct {
	Handler            ServerInterface
	HandlerMiddlewares []MiddlewareFunc
}

type MiddlewareFunc func(http.HandlerFunc) http.HandlerFunc

// ListVironAuditlogs operation middleware
func (siw *ServerInterfaceWrapper) ListVironAuditlogs(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	ctx = context.WithValue(ctx, JwtScopes, []string{""})

	// Parameter object where we will unmarshal all parameters from the context
	var params ListVironAuditlogsParams

	// ------------- Optional query parameter "userId" -------------
	if paramValue := r.URL.Query().Get("userId"); paramValue != "" {

	}

	err = runtime.BindQueryParameter("form", true, false, "userId", r.URL.Query(), &params.UserId)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid format for parameter userId: %s", err), http.StatusBadRequest)
		return
	}

	// ------------- Optional query parameter "requestUri" -------------
	if paramValue := r.URL.Query().Get("requestUri"); paramValue != "" {

	}

	err = runtime.BindQueryParameter("form", true, false, "requestUri", r.URL.Query(), &params.RequestUri)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid format for parameter requestUri: %s", err), http.StatusBadRequest)
		return
	}

	// ------------- Optional query parameter "requestMethod" -------------
	if paramValue := r.URL.Query().Get("requestMethod"); paramValue != "" {

	}

	err = runtime.BindQueryParameter("form", true, false, "requestMethod", r.URL.Query(), &params.RequestMethod)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid format for parameter requestMethod: %s", err), http.StatusBadRequest)
		return
	}

	// ------------- Optional query parameter "sourceIp" -------------
	if paramValue := r.URL.Query().Get("sourceIp"); paramValue != "" {

	}

	err = runtime.BindQueryParameter("form", true, false, "sourceIp", r.URL.Query(), &params.SourceIp)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid format for parameter sourceIp: %s", err), http.StatusBadRequest)
		return
	}

	// ------------- Optional query parameter "statusCode" -------------
	if paramValue := r.URL.Query().Get("statusCode"); paramValue != "" {

	}

	err = runtime.BindQueryParameter("form", true, false, "statusCode", r.URL.Query(), &params.StatusCode)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid format for parameter statusCode: %s", err), http.StatusBadRequest)
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
		siw.Handler.ListVironAuditlogs(w, r, params)
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
		r.Get(options.BaseURL+"/viron/auditlogs", wrapper.ListVironAuditlogs)
	})

	return r
}

// Base64 encoded, gzipped, json marshaled Swagger object
var swaggerSpec = []string{

	"H4sIAAAAAAAC/6xWQW/jRBT+K9GD42wSujefWOASUbRlq8IhymHqTNKpbI93ZlwIkSViSwsckFaAQCtA",
	"aFnRIiQKAoGodoEfM6jd/Rfoje2Mk3hbr9RLFHve+957833zjefgizAWEYu0Am8OMZU0ZJpJ+/QOlyK6",
	"w+4mTOm3mD4Q47cTJmc7GITrPAIP7uIrIBDRkIEHsh4OBJR/wEKK0XoWY4DSkkdTSFOygr8neWvwPcnb",
	"IO+KRPpsEF+Nq8rIVqia6kS9LsasBe4ydgV5ImRINXjAI31zC0hVikeaTZl0tfYUk4MWm57YuEu7T6tF",
	"x+ytZMz1tpha4qWImdSc2WVfMqrZ+JbGhzFTvuSx5gIrn3/1w/mDDIgbYkw1u6F5yNwgVVVSMfaaGM82",
	"sUz+k8l+MdmPJjsz+ccm/8bkH5ns0SVApa6uhnposr9Nnpv8k0vQUEhXQe3dGTQhLCWzmY+Fn5jsbLDT",
	"mOg00ZB6ZvJ7Nvtf/J/9jv/rIywlQirSG/o/tgh/mvzJ4I3NFtLlG7F/yHwNldoqPWxzZYnnmoVWDi9L",
	"NgEPXuo5s+iVYuqtKslhUynprBH6Xa4PdigO4c2BBsHtCXjDZZFurUh3RsPg+VULkJSsqzco+2/dth04",
	"LWXBJRuDNyxQRht7NbJHiUcTsbnzFPECMVUdGvOOipnPJ9ynuKqQB64DhHr1CIv3Ar7fWWYAgSMmVYHT",
	"7/a7rwCB92/EdIozDdGnI1249HAOOK2FRf5tp26eEi2mUx7RojEtE0ZKz/CGzi1qp2CET6WmEfNohVaU",
	"u9SYu27vq47sbNQ5Ut0Cna+4jdV0P2CQjsi6jBefm8Wpnctkf9hzcN8sTi++fnT+3WOT/2yyX0322bMv",
	"f3t6fGIWJ2bxqVn8YxYPgMBUiiQGDy5OH17cv3fxxeNn337fKx6AAG+ar+LG1uvUiyDlBHc8ojEHD252",
	"+90tu8H6wMqtV9DpqPTmMGUN1llH/e+vD58enwBZo3K7mUp3KQ+bZe1Ces0XB56SNomNt/ELJm98KrTN",
	"b7iwW6c23cq15MttZR3NOssu/+D6wPDnOsB2hdR1nOLcxiJShfdt9fv2Ai/cwjpsHAelCfUOFQpxXvtM",
	"eCGPdM5tTXBV3bfftBaqmJ9IrmdWqofvoWmMsEuVhCFF/7F2VRhfpxS4pnhqhmuHsnDacm1efeqsxqSj",
	"9P8AAAD//6CFhfbDCgAA",
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
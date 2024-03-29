// Package adminaccounts provides primitives to interact with the openapi HTTP API.
//
// Code generated by github.com/deepmap/oapi-codegen version v1.8.3 DO NOT EDIT.
package adminaccounts

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

	externalRef0 "github.com/cam-inc/viron/packages/golang/routes/adminusers"
	externalRef1 "github.com/cam-inc/viron/packages/golang/routes/components"
	"github.com/deepmap/oapi-codegen/pkg/runtime"
	"github.com/getkin/kin-openapi/openapi3"
	"github.com/go-chi/chi/v5"
)

const (
	JwtScopes = "jwt.Scopes"
)

// VironAdminAccountUpdatePayload defines model for VironAdminAccountUpdatePayload.
type VironAdminAccountUpdatePayload struct {
	// パスワード
	Password string `json:"password"`
}

// UpdateVironAdminAccountJSONBody defines parameters for UpdateVironAdminAccount.
type UpdateVironAdminAccountJSONBody VironAdminAccountUpdatePayload

// UpdateVironAdminAccountJSONRequestBody defines body for UpdateVironAdminAccount for application/json ContentType.
type UpdateVironAdminAccountJSONRequestBody UpdateVironAdminAccountJSONBody

// ServerInterface represents all server handlers.
type ServerInterface interface {
	// list admin account
	// (GET /viron/adminaccounts)
	ListVironAdminAccounts(w http.ResponseWriter, r *http.Request)
	// update an admin account
	// (PUT /viron/adminaccounts/{id})
	UpdateVironAdminAccount(w http.ResponseWriter, r *http.Request, id externalRef1.VironIdPathParam)
}

// ServerInterfaceWrapper converts contexts to parameters.
type ServerInterfaceWrapper struct {
	Handler            ServerInterface
	HandlerMiddlewares []MiddlewareFunc
}

type MiddlewareFunc func(http.HandlerFunc) http.HandlerFunc

// ListVironAdminAccounts operation middleware
func (siw *ServerInterfaceWrapper) ListVironAdminAccounts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	ctx = context.WithValue(ctx, JwtScopes, []string{""})

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.ListVironAdminAccounts(w, r)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// UpdateVironAdminAccount operation middleware
func (siw *ServerInterfaceWrapper) UpdateVironAdminAccount(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	// ------------- Path parameter "id" -------------
	var id externalRef1.VironIdPathParam

	err = runtime.BindStyledParameter("simple", false, "id", chi.URLParam(r, "id"), &id)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid format for parameter id: %s", err), http.StatusBadRequest)
		return
	}

	ctx = context.WithValue(ctx, JwtScopes, []string{""})

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.UpdateVironAdminAccount(w, r, id)
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
		r.Get(options.BaseURL+"/viron/adminaccounts", wrapper.ListVironAdminAccounts)
	})
	r.Group(func(r chi.Router) {
		r.Put(options.BaseURL+"/viron/adminaccounts/{id}", wrapper.UpdateVironAdminAccount)
	})

	return r
}

// Base64 encoded, gzipped, json marshaled Swagger object
var swaggerSpec = []string{

	"H4sIAAAAAAAC/5yUXWsTTRTHv0qe0z43dZONrYgsSFvvioK9aQXTKNPdSTolOzPOzLbGsBfZRVFE0CKF",
	"KoL2ohXE+oogil9m6Nu3kJlJG5pNsXqTnTDnzDnz+//PdCBkMWcUUyUh6IAMl3CM7HKeCEano5jQ6TBk",
	"CVVzPEIKz6J2i6HIRHDBOBaKYBvPkZSrTNidCMtQEK4IoxCAzp/p7LvOP+j8p84fgQcNJmKkIOgnecCR",
	"UliY+FuVsckaKt+bLt9cWIj+mxwZ/X8hqVbHL06NnfPLt816IrxsP7jeueSl4IFqcwwBSCUIbUKaeiDw",
	"nYQIHEFQ65epH0eyxWUcKkhNKKENVmwbmbuXEolFCTkCJcRJSXIckgYJkQmTpjRRLXPi1Ioh5rfIYsml",
	"9rLAgxUspDu0WqlWzoMHd8scNQ24mpGAKidArQMGqT16JoIAWkSqghDS0moSilynSiTY3FeyRITY5q0M",
	"5vQRKbTYwpDWvUGVsk2dvdPZls6/6Pzhwdv3uzsvdLZ2uP75YGtbd7d194nu/tLdDfCgKVjCIYD9nTf7",
	"Tx/sP/9x+GrTd3/AA3JqCz1U9kqloRUhraeeoUARJxDARKVaGXf2WLI+8x1mixgdAQk60MSqqKFrSedb",
	"xnrZN/t7oih4A8SvnUZcYMkZlc7s49Wq+fSUM0vEeatnCn9ZmuJH02RWowI3IICKa9t4SlbaKG6N+P35",
	"83vD5/fLz0ksTEM3iFqaRU0snF9P3vH6Vet3icNEENW2LlpeVRDU6kZlmcQxEu2emQrWVKhpjDdErro5",
	"dRhtv0Oi1I58cjbk3Z0B6nv5/d3Xn3S2tvfy6976R93d0NnjghTuwZkf4iOOBIqxwsLNzDHdPswi3X6O",
	"AzwTzSJDVaDYToN5L7BUV1jU/hdp/6Dk0Dc0PflOmTlOC0a7UER8ZsUTW66E6N/Jnh7vd4CiGA+bZmkG",
	"9XcAAAD//4zhERc/BgAA",
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

	for rawPath, rawFunc := range externalRef0.PathToRawSpec(path.Join(pathPrefix, "./adminusers.yaml")) {
		if _, ok := res[rawPath]; ok {
			// it is not possible to compare functions in golang, so always overwrite the old value
		}
		res[rawPath] = rawFunc
	}
	for rawPath, rawFunc := range externalRef1.PathToRawSpec(path.Join(pathPrefix, "./components.yaml")) {
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

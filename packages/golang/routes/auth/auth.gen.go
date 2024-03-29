// Package auth provides primitives to interact with the openapi HTTP API.
//
// Code generated by github.com/deepmap/oapi-codegen version v1.8.3 DO NOT EDIT.
package auth

import (
	"bytes"
	"compress/gzip"
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

// OAuth2GoogleCallbackPayload defines model for OAuth2GoogleCallbackPayload.
type OAuth2GoogleCallbackPayload struct {
	// Googleが発行した認可コード
	Code string `json:"code"`

	// GoogleOAuth2コールバックURI
	RedirectUri string `json:"redirectUri"`

	// CSRF対策用のステートパラメータ
	State string `json:"state"`
}

// SigninEmailPayload defines model for SigninEmailPayload.
type SigninEmailPayload struct {
	// Eメールアドレス
	Email openapi_types.Email `json:"email"`

	// パスワード
	Password string `json:"password"`
}

// RedirectUriQueryParam defines model for RedirectUriQueryParam.
type RedirectUriQueryParam string

// SigninEmailJSONBody defines parameters for SigninEmail.
type SigninEmailJSONBody SigninEmailPayload

// Oauth2GoogleAuthorizationParams defines parameters for Oauth2GoogleAuthorization.
type Oauth2GoogleAuthorizationParams struct {
	RedirectUri RedirectUriQueryParam `json:"redirectUri"`
}

// Oauth2GoogleCallbackJSONBody defines parameters for Oauth2GoogleCallback.
type Oauth2GoogleCallbackJSONBody OAuth2GoogleCallbackPayload

// SigninEmailJSONRequestBody defines body for SigninEmail for application/json ContentType.
type SigninEmailJSONRequestBody SigninEmailJSONBody

// Oauth2GoogleCallbackJSONRequestBody defines body for Oauth2GoogleCallback for application/json ContentType.
type Oauth2GoogleCallbackJSONRequestBody Oauth2GoogleCallbackJSONBody

// ServerInterface represents all server handlers.
type ServerInterface interface {
	// signin to viron with email/password
	// (POST /email/signin)
	SigninEmail(w http.ResponseWriter, r *http.Request)
	// redirect to google oauth
	// (GET /oauth2/google/authorization)
	Oauth2GoogleAuthorization(w http.ResponseWriter, r *http.Request, params Oauth2GoogleAuthorizationParams)
	// callback from google oauth
	// (POST /oauth2/google/callback)
	Oauth2GoogleCallback(w http.ResponseWriter, r *http.Request)
	// signout of viron
	// (POST /signout)
	Signout(w http.ResponseWriter, r *http.Request)
}

// ServerInterfaceWrapper converts contexts to parameters.
type ServerInterfaceWrapper struct {
	Handler            ServerInterface
	HandlerMiddlewares []MiddlewareFunc
}

type MiddlewareFunc func(http.HandlerFunc) http.HandlerFunc

// SigninEmail operation middleware
func (siw *ServerInterfaceWrapper) SigninEmail(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.SigninEmail(w, r)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// Oauth2GoogleAuthorization operation middleware
func (siw *ServerInterfaceWrapper) Oauth2GoogleAuthorization(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	// Parameter object where we will unmarshal all parameters from the context
	var params Oauth2GoogleAuthorizationParams

	// ------------- Required query parameter "redirectUri" -------------
	if paramValue := r.URL.Query().Get("redirectUri"); paramValue != "" {

	} else {
		http.Error(w, "Query argument redirectUri is required, but not found", http.StatusBadRequest)
		return
	}

	err = runtime.BindQueryParameter("form", true, true, "redirectUri", r.URL.Query(), &params.RedirectUri)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid format for parameter redirectUri: %s", err), http.StatusBadRequest)
		return
	}

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.Oauth2GoogleAuthorization(w, r, params)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// Oauth2GoogleCallback operation middleware
func (siw *ServerInterfaceWrapper) Oauth2GoogleCallback(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.Oauth2GoogleCallback(w, r)
	}

	for _, middleware := range siw.HandlerMiddlewares {
		handler = middleware(handler)
	}

	handler(w, r.WithContext(ctx))
}

// Signout operation middleware
func (siw *ServerInterfaceWrapper) Signout(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var handler = func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.Signout(w, r)
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
		r.Post(options.BaseURL+"/email/signin", wrapper.SigninEmail)
	})
	r.Group(func(r chi.Router) {
		r.Get(options.BaseURL+"/oauth2/google/authorization", wrapper.Oauth2GoogleAuthorization)
	})
	r.Group(func(r chi.Router) {
		r.Post(options.BaseURL+"/oauth2/google/callback", wrapper.Oauth2GoogleCallback)
	})
	r.Group(func(r chi.Router) {
		r.Post(options.BaseURL+"/signout", wrapper.Signout)
	})

	return r
}

// Base64 encoded, gzipped, json marshaled Swagger object
var swaggerSpec = []string{

	"H4sIAAAAAAAC/7RWXW/cRBT9K2YaXsruertBCK2E2hAVFFGRslF4IFnQxJ7dnWJ73PG4ZbuyhG0JETWI",
	"D1WgPiDUgqrStF2kCony0f6YS5TyL9Cd8X57SwTiJWt77r1z7jlzz2RAHOGHImCBikhzQEIqqc8Uk/qt",
	"xVwumaO2JX8nZrJ/EVdxgQekSS7jJ1IhAfUZaRI5CSYVItnlmEvmkqaSMauQyOkxn2JuR0ifKtIksQ5U",
	"/RCzIyV50CVJkoxiNYLNtVj1Gm8K0fXYOvW8Pep8eJH2PUFdDVeKkEnFmQ52hMvw12WRI3mouECYJhnS",
	"g+Obvz67dQDpN5B+9+zeZ0efDyF7BPnvkO8v4qjM9LOkqEE3qnII+ReQ55ANt1sbZRUjRVUJwPWt1htH",
	"wyfHD74+vnEX0oeQPYb8E13yU8i/hPxHyG/ha/a0hK9pqncMBaOdZntoj3PF3iXmKES0xbsBD877lHtL",
	"WWW4uoj6fAEqP4TsNuT7kN+H7DGpTPQ1iSU8hDSKrgrpLhbFdrH74ViWcbVxEuYrxSTGv187fXaHVq+t",
	"Vd/b3XVfOHtq5cXduF5vvHLu9Et29QN8XnVe0z+sPXi1kvwjgSPQ4+0WacMUHnTEInwaq55FQ25FIXN4",
	"hzsUFyLclCsPa5y7wqUIbI/vWRhMKuQKk5HJrtfqtTPIjwhZQENOmmS1Vq81TMc9LYat8dmR1k1rJSJV",
	"Ig5GTesC6d05biH76s8/nkL6PaR33kVQkB5C9jNkP0D+qPib3oTsOtGApG5lwyXN6UNTDDqL1OvC7ZsZ",
	"DBQLNCQahl5BgX0pEhruxAZWJOuQJjllTwzILgbfLjmWyaxQaCr6QxSKIDIHtVF/eZGJt4W1XkDS1hL7",
	"PpV91F/vYSlhaUmsq1z1LMPu1FFTtBvhsdBitbGCLfC5YXe1A9j4IiS/Rs1+A9JlarkHPdSOYczn+MZv",
	"f317G9JfIL8H+cea8vuQDXHqy4nfpBMzXJvZtzJj3Dvl7E5C7HJjT9pzjK7Wzyz2MspF6gwWS3dlbbcu",
	"1OZIllOxhjBLFOd+ltkK+aiKT44IOrxbdVmHxp6qzl5HM45MVga61LiV1kZiTsmcQk5xbSyfFtOFUeXo",
	"yYG24EVLv/BcPUaX0/80Ec+7B//7aMzLNqLM6kjh/yvh5jg4qXI4lCJWy6UqnOo6ZPuQP4DsJzS57M7y",
	"mdkqKp6EkM23SjxCxMoSHWMSJYaQjD8NRv8I6aWknfwdAAD//6xKAz1cCQAA",
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

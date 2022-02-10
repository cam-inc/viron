// Package components provides primitives to interact with the openapi HTTP API.
//
// Code generated by github.com/deepmap/oapi-codegen version v1.8.3 DO NOT EDIT.
package components

import (
	"bytes"
	"compress/gzip"
	"encoding/base64"
	"fmt"
	"net/url"
	"path"
	"strings"
	"time"

	"github.com/getkin/kin-openapi/openapi3"
)

// 作成日時
type VironCreatedAt time.Time

// VironPager defines model for VironPager.
type VironPager struct {
	CurrentPage int `json:"currentPage"`
	MaxPage     int `json:"maxPage"`
}

// 更新日時
type VironUpdatedAt time.Time

// VironEmailQueryParam defines model for VironEmailQueryParam.
type VironEmailQueryParam string

// VironIdPathParam defines model for VironIdPathParam.
type VironIdPathParam string

// VironIdQueryParam defines model for VironIdQueryParam.
type VironIdQueryParam string

// VironPagerPageQueryParam defines model for VironPagerPageQueryParam.
type VironPagerPageQueryParam int

// VironPagerSizeQueryParam defines model for VironPagerSizeQueryParam.
type VironPagerSizeQueryParam int

// VironRoleIdQueryParam defines model for VironRoleIdQueryParam.
type VironRoleIdQueryParam string

// VironSortQueryParam defines model for VironSortQueryParam.
type VironSortQueryParam []string

// Base64 encoded, gzipped, json marshaled Swagger object
var swaggerSpec = []string{

	"H4sIAAAAAAAC/5RUO4/TThD/KtboX/wRiwnQuQGEKOgCJ2gQSBt7nAzyPm52fLrckYaKkgqEoKWnoOXb",
	"IH8ONBuUx5FcQmNp5zf+PWYfl1AHF4NHLwmqS4iWrUNBzqsXxME/dpa6pz3yfKyg1slDBadaAgPeOoQK",
	"UNvAQKpn6Kx2yTwqkITJT2GxMEu+J83YymybK1qZramoAQOMpz0xNlAJ93gU72GTmfkg09hOkfWzTdhg",
	"qpmiUFBmxQvfuwlyEdqioyRgdopGO8VdsuQFp8hXdE/o4lpdxQ8IJro4TvBZ6PCYsXHuO2Z0J4HlWveB",
	"pUgRa2qptlrcyILnsQsNQtXaLuGebIFlywgJuj9HVwRZf3ld3rxf/W9T/VbFb/wH5qrdVcEy27muk8w7",
	"LbSBXY6zVFhfg0eMVrB5KH+H+vXz6/D+w/Dp2/D5HZhMYQUqaKzgLSGHuwysdzyb5xCRhTAL1j0zelF0",
	"1/YZcPZ8H7jYvDovV51mi/TVylCYvMFaVoaex2ZfyuHLj+Hj939KqWbItyH7JMkDfnCmOrc7mhQbT4+B",
	"M+S0FBqVo/KOOgoRvY0EFdwrR+VdMPmdSFD5vusWvwMAAP//9gvcg7sEAAA=",
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

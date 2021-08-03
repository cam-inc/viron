package oas

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/cam-inc/viron/packages/golang/constant"

	"github.com/getkin/kin-openapi/openapi3"
)

type oas struct{}

func (o *oas) GetOas(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	oas := ctx.Value(constant.CTX_KEY_API_DEFINITION)

	// DEBUG
	if v := ctx.Value(JwtScopes); v == nil {
		fmt.Println("jwtScopes is nil")
	} else {
		fmt.Println(v)
	}
	// DEBUG

	b, _ := json.Marshal(oas)
	w.WriteHeader(http.StatusOK)
	w.Write(b)
}

func (o *oas) LoadOas() *openapi3.T {
	oas, _ := GetSwagger()
	return oas
}

func New() ServerInterface {
	return &oas{}
}

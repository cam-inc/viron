package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/cam-inc/viron/packages/golang/constant"

	"github.com/getkin/kin-openapi/openapi3"

	"github.com/cam-inc/viron/example/golang/pkg/config"
	"github.com/cam-inc/viron/example/golang/pkg/store"
	"github.com/cam-inc/viron/packages/golang/routes/auth"
	"github.com/cam-inc/viron/packages/golang/routes/oas"
	"github.com/go-chi/chi/v5"
	"github.com/imdario/mergo"
)

type (
	apiDefinition struct {
		name string
		oas  *openapi3.T
	}
)

var (
	apiDocs []*apiDefinition
)

func New() http.Handler {

	mysqlConfig := config.New().StoreMySQL
	fmt.Printf("msyql: %v\n", mysqlConfig)
	store.SetupMySQL(mysqlConfig)

	apiDocs = []*apiDefinition{}

	definition := &openapi3.T{}

	root := chi.NewRouter()
	oasImpl := oas.New()
	oas.HandlerWithOptions(oasImpl, oas.ChiServerOptions{
		BaseRouter: root,
		Middlewares: []oas.MiddlewareFunc{
			func(handlerFunc http.HandlerFunc) http.HandlerFunc {
				fn := func(w http.ResponseWriter, r *http.Request) {
					ctx := r.Context()
					ctx = context.WithValue(ctx, constant.CTX_KEY_API_DEFINITION, apiDocs)
					handlerFunc.ServeHTTP(w, r.WithContext(ctx))
				}
				return fn

			},
		},
	})
	oasDoc, _ := oas.GetSwagger()

	if err := mergo.Merge(definition, oasDoc); err != nil {
		fmt.Printf("merge failed %v\n", err)
	}

	apiDocs = append(apiDocs, &apiDefinition{
		name: "oas",
		oas:  oasDoc,
	})

	authImpl := auth.New()
	auth.HandlerFromMux(authImpl, root)
	authDoc, _ := auth.GetSwagger()

	if err := mergo.Merge(definition, authDoc); err != nil {
		fmt.Printf("merge failed %v\n", err)
	}

	apiDocs = append(apiDocs, &apiDefinition{
		name: "auth",
		oas:  authDoc,
	})

	root.Get("/ping", func(writer http.ResponseWriter, request *http.Request) {
		writer.WriteHeader(http.StatusOK)
		fmt.Fprint(writer, "pong")
	})

	b, _ := json.Marshal(oasDoc)
	fmt.Println(string(b))

	bb, _ := json.Marshal(authDoc)
	fmt.Println(string(bb))

	bbb, _ := json.Marshal(apiDocs)
	fmt.Println(string(bbb))

	bbbb, _ := json.Marshal(definition)
	fmt.Println(string(bbbb))

	return root
}

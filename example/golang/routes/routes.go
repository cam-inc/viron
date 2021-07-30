package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/cam-inc/viron/example/golang/pkg/domains"

	"github.com/cam-inc/viron/example/golang/routes/root"

	"github.com/cam-inc/viron/example/golang/routes/components"
	"github.com/cam-inc/viron/packages/golang/routes/adminroles"
	"github.com/cam-inc/viron/packages/golang/routes/adminusers"
	"github.com/cam-inc/viron/packages/golang/routes/auditlogs"
	"github.com/cam-inc/viron/packages/golang/routes/authconfigs"

	packageComponents "github.com/cam-inc/viron/packages/golang/routes/components"

	"github.com/cam-inc/viron/packages/golang/constant"

	"github.com/getkin/kin-openapi/openapi3"

	"github.com/cam-inc/viron/example/golang/pkg/config"
	"github.com/cam-inc/viron/example/golang/pkg/store"
	domainAuth "github.com/cam-inc/viron/packages/golang/domains/auth"
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

	cfg := config.New()
	mysqlConfig := cfg.StoreMySQL
	fmt.Printf("msyql: %v\n", mysqlConfig)
	store.SetupMySQL(mysqlConfig)
	domains.SetUpMySQL(store.GetMySQLConnection())

	apiDocs = []*apiDefinition{}

	definition := &openapi3.T{
		ExtensionProps: openapi3.ExtensionProps{
			Extensions: map[string]interface{}{},
		},
		Info: &openapi3.Info{
			ExtensionProps: openapi3.ExtensionProps{
				Extensions: map[string]interface{}{},
			},
		},
		ExternalDocs: &openapi3.ExternalDocs{
			ExtensionProps: openapi3.ExtensionProps{
				Extensions: map[string]interface{}{},
			},
		},
	}

	routeRoot := chi.NewRouter()
	oasImpl := oas.New()
	oas.HandlerWithOptions(oasImpl, oas.ChiServerOptions{
		BaseRouter: routeRoot,
		Middlewares: []oas.MiddlewareFunc{
			func(handlerFunc http.HandlerFunc) http.HandlerFunc {
				fn := func(w http.ResponseWriter, r *http.Request) {
					ctx := r.Context()
					ctx = context.WithValue(ctx, constant.CTX_KEY_API_DEFINITION, definition)
					handlerFunc.ServeHTTP(w, r.WithContext(ctx))
				}
				return fn

			},
		},
	})
	oasDoc, _ := oas.GetSwagger()

	apiDocs = append(apiDocs, &apiDefinition{
		name: "oas",
		oas:  oasDoc,
	})

	domainAuth.SetUp(cfg.Auth.JWT.Secret, cfg.Auth.JWT.Provider, cfg.Auth.JWT.ExpirationSec)
	authImpl := auth.New()
	auth.HandlerFromMux(authImpl, routeRoot)
	authDoc, _ := auth.GetSwagger()

	apiDocs = append(apiDocs, &apiDefinition{
		name: "auth",
		oas:  authDoc,
	})

	routeRoot.Get("/ping", func(writer http.ResponseWriter, request *http.Request) {
		writer.WriteHeader(http.StatusOK)
		fmt.Fprint(writer, "pong")
	})

	rootDoc, _ := root.GetSwagger()
	definition.OpenAPI = rootDoc.OpenAPI
	definition.Servers = rootDoc.Servers
	if err := mergo.Merge(definition.Info, *rootDoc.Info); err != nil {
		panic(err)
	}
	if err := merge(definition, rootDoc); err != nil {
		panic(err)
	}
	componentsDoc, _ := components.GetSwagger()
	if err := merge(definition, componentsDoc); err != nil {
		panic(err)
	}

	packageComponentsDoc, _ := packageComponents.GetSwagger()
	if err := merge(definition, packageComponentsDoc); err != nil {
		panic(err)
	}

	b, _ := json.Marshal(definition)
	fmt.Println(string(b))

	authconfigsDoc, _ := authconfigs.GetSwagger()
	if err := merge(definition, authconfigsDoc); err != nil {
		panic(err)
	}
	bb, _ := json.Marshal(definition)
	fmt.Println(string(bb))

	adminusersDoc, _ := adminusers.GetSwagger()
	if err := merge(definition, adminusersDoc); err != nil {
		panic(err)
	}

	bbb, _ := json.Marshal(definition)
	fmt.Println(string(bbb))

	adminrolesDoc, _ := adminroles.GetSwagger()
	if err := merge(definition, adminrolesDoc); err != nil {
		panic(err)
	}
	bbbb, _ := json.Marshal(definition)
	fmt.Println(string(bbbb))

	auditlogsDoc, _ := auditlogs.GetSwagger()
	if err := merge(definition, auditlogsDoc); err != nil {
		panic(err)
	}
	bbbbb, _ := json.Marshal(definition)
	fmt.Println(string(bbbbb))

	if err := merge(definition, oasDoc); err != nil {
		panic(err)
	}
	bbbbbb, _ := json.Marshal(definition)
	fmt.Println(string(bbbbbb))

	if err := merge(definition, authDoc); err != nil {
		panic(err)
	}
	bbbbbbb, _ := json.Marshal(definition)
	fmt.Println(string(bbbbbbb))

	/*
		b, _ := json.Marshal(oasDoc.Info)
		fmt.Println(string(b))
		bb, _ := json.Marshal(authDoc.Info)
		fmt.Println(string(bb))
	*/

	/*
		bbb, _ := json.Marshal(apiDocs)
		fmt.Println(string(bbb))


	*/
	return routeRoot
}

func merge(dist *openapi3.T, src *openapi3.T) error {

	fmt.Println("--")
	if err := mergo.Merge(&dist.Security, src.Security); err != nil {
		fmt.Printf("merge failed %v\n", err)
	}
	fmt.Println("--")
	fmt.Printf("dist tags%+v, src tags%+v\n", dist.Tags, src.Tags)
	dist.Tags = append(dist.Tags, src.Tags...)
	//if err := mergo.Merge(&dist.Tags, src.Tags); err != nil {
	//	fmt.Printf("merge failed %v\n", err)
	//}
	fmt.Println("--")
	if err := mergo.Merge(&dist.Components.Headers, src.Components.Headers); err != nil {
		fmt.Printf("merge failed %v\n", err)
	}

	fmt.Println("--")
	if err := mergo.Merge(&dist.Components.Parameters, src.Components.Parameters); err != nil {
		fmt.Printf("merge failed %v\n", err)
	}

	fmt.Println("--")
	if err := mergo.Merge(&dist.Components.Responses, src.Components.Responses); err != nil {
		fmt.Printf("merge failed %v\n", err)
	}

	fmt.Println("--")
	if err := mergo.Merge(&dist.Components.SecuritySchemes, src.Components.SecuritySchemes); err != nil {
		fmt.Printf("merge failed %v\n", err)
	}

	fmt.Println("--")
	if err := mergo.Merge(&dist.Components.Links, src.Components.Links); err != nil {
		fmt.Printf("merge failed %v\n", err)
	}

	fmt.Println("--")
	if err := mergo.Merge(&dist.Components.Callbacks, src.Components.Callbacks); err != nil {
		fmt.Printf("merge failed %v\n", err)
	}
	fmt.Println("--")
	if err := mergo.Merge(&dist.Components.Examples, src.Components.Examples); err != nil {
		fmt.Printf("merge failed %v\n", err)
	}

	fmt.Println("--")
	if err := mergo.Merge(&dist.Paths, src.Paths); err != nil {
		fmt.Printf("merge failed %v\n", err)
	}

	fmt.Println("--")
	if err := mergo.Merge(&dist.Info.Extensions, src.Info.Extensions); err != nil {
		fmt.Printf("merge failed %v\n", err)
	}

	fmt.Println("--")
	return nil
}

package routes

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/cam-inc/viron/packages/golang/helpers"

	"github.com/cam-inc/viron/example/golang/pkg/domains"

	"github.com/cam-inc/viron/example/golang/routes/root"

	"github.com/cam-inc/viron/example/golang/routes/components"
	"github.com/cam-inc/viron/packages/golang/routes/adminroles"
	"github.com/cam-inc/viron/packages/golang/routes/adminusers"
	"github.com/cam-inc/viron/packages/golang/routes/auditlogs"
	"github.com/cam-inc/viron/packages/golang/routes/authconfigs"

	packageComponents "github.com/cam-inc/viron/packages/golang/routes/components"

	"github.com/getkin/kin-openapi/openapi3"

	"github.com/cam-inc/viron/example/golang/pkg/config"
	"github.com/cam-inc/viron/example/golang/pkg/store"
	domainAuth "github.com/cam-inc/viron/packages/golang/domains/auth"
	"github.com/cam-inc/viron/packages/golang/routes/auth"
	"github.com/cam-inc/viron/packages/golang/routes/oas"
	"github.com/go-chi/chi/v5"
	"github.com/imdario/mergo"
)

func New() http.Handler {

	cfg := config.New()
	mysqlConfig := cfg.StoreMySQL
	fmt.Printf("msyql: %v\n", mysqlConfig)
	store.SetupMySQL(mysqlConfig)
	domains.SetUpMySQL(store.GetMySQLConnection())

	definition := &openapi3.T{
		ExtensionProps: openapi3.ExtensionProps{
			Extensions: map[string]interface{}{},
		},
		Info: &openapi3.Info{
			ExtensionProps: openapi3.ExtensionProps{
				Extensions: map[string]interface{}{},
			},
		},
	}

	routeRoot := chi.NewRouter()
	routeRoot.Use(Cors(cfg.Cors))

	oasImpl := oas.New()
	oas.HandlerWithOptions(oasImpl, oas.ChiServerOptions{
		BaseRouter: routeRoot,
		Middlewares: []oas.MiddlewareFunc{
			InjectAPIDefinition(definition),
		},
	})
	oasDoc, _ := oas.GetSwagger()

	domainAuth.SetUp(cfg.Auth.JWT.Secret, cfg.Auth.JWT.Provider, cfg.Auth.JWT.ExpirationSec)
	authImpl := auth.New()
	auth.HandlerFromMux(authImpl, routeRoot)

	authconfigImp := authconfigs.New()
	authconfigs.HandlerWithOptions(authconfigImp, authconfigs.ChiServerOptions{
		BaseRouter: routeRoot,
		Middlewares: []authconfigs.MiddlewareFunc{
			InjectAPIDefinition(definition),
		},
	})

	authDoc, _ := auth.GetSwagger()

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
	//helpers.Ref(authconfigsDoc, "./components.yaml", "")

	if err := merge(definition, authconfigsDoc); err != nil {
		panic(err)
	}

	adminusersDoc, _ := adminusers.GetSwagger()
	//helpers.Ref(adminusersDoc, "./components.yaml", "")
	if err := merge(definition, adminusersDoc); err != nil {
		panic(err)
	}

	adminrolesDoc, _ := adminroles.GetSwagger()
	//helpers.Ref(adminrolesDoc, "./components.yaml", "")
	if err := merge(definition, adminrolesDoc); err != nil {
		panic(err)
	}

	auditlogsDoc, _ := auditlogs.GetSwagger()
	//helpers.Ref(auditlogsDoc, "./components.yaml", "")
	if err := merge(definition, auditlogsDoc); err != nil {
		panic(err)
	}

	if err := merge(definition, oasDoc); err != nil {
		panic(err)
	}

	if err := merge(definition, authDoc); err != nil {
		panic(err)
	}

	helpers.Ref(definition, "./components.yaml", "")

	return routeRoot
}

func convertP(src *openapi3.Operation) error {

	if src.OperationID != "" {
		first := src.OperationID[:1]
		lower := strings.ToLower(first)
		src.OperationID = strings.Replace(src.OperationID, first, lower, 1)
	}

	if src.RequestBody != nil {
		if src.RequestBody.Ref != "" && strings.Contains(src.RequestBody.Ref, "./") {
			src.RequestBody.Ref = strings.Replace(src.RequestBody.Ref, "./", "https://local-api.viron.work:3000/", -1)
			fmt.Printf("req:%s\n", src.RequestBody.Ref)
		}
	}
	for _, res := range src.Responses {
		if res.Ref != "" && strings.Contains(res.Ref, "./") {
			res.Ref = strings.Replace(res.Ref, "./", "httress://local-aresi.viron.work:3000/", -1)
			fmt.Printf("res:%s\n", res.Ref)
		}
	}
	for _, p := range src.Parameters {
		if p.Ref != "" && strings.Contains(p.Ref, "./") {
			p.Ref = strings.Replace(p.Ref, "./", "https://local-api.viron.work:3000/", -1)
			fmt.Printf("p:%s\n", p.Ref)
		}
	}
	return nil
}

func convertT(src *openapi3.T) error {

	for _, pathItem := range src.Paths {
		if pathItem.Ref != "" && strings.Contains(pathItem.Ref, "./") {
			pathItem.Ref = strings.Replace(pathItem.Ref, "./", "https://local-api.viron.work:3000/", -1)
			fmt.Printf("%s\n", pathItem.Ref)
		}
		if pathItem.Get != nil {
			convertP(pathItem.Get)
		}
		if pathItem.Post != nil {
			convertP(pathItem.Post)
		}
		if pathItem.Put != nil {
			convertP(pathItem.Put)
		}
		if pathItem.Delete != nil {
			convertP(pathItem.Delete)
		}
	}
	return nil
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
	if err := mergo.Merge(&dist.Components.Schemas, src.Components.Schemas); err != nil {
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

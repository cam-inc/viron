package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

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
	packageDomains "github.com/cam-inc/viron/packages/golang/domains"
	domainAuth "github.com/cam-inc/viron/packages/golang/domains/auth"
	"github.com/cam-inc/viron/packages/golang/routes/auth"
	"github.com/cam-inc/viron/packages/golang/routes/oas"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/imdario/mergo"
)

func New() http.Handler {

	cfg := config.New()
	mysqlConfig := cfg.StoreMySQL
	fmt.Printf("msyql: %v\n", mysqlConfig)
	store.SetupMySQL(mysqlConfig)
	domains.SetUpMySQL(store.GetMySQLConnection())
	if err := packageDomains.NewMySQL(store.GetMySQLConnection()); err != nil {
		panic(err)
	}
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
	routeRoot.Use(InjectConfig(cfg))
	routeRoot.Use(middleware.Logger)
	//routeRoot.Use(JWTSecurityHandler(cfg.Auth))

	oasImpl := oas.New()
	oas.HandlerWithOptions(oasImpl, oas.ChiServerOptions{
		BaseRouter: routeRoot,
		Middlewares: []oas.MiddlewareFunc{
			InjectAPIDefinition(definition),
			JWTSecurityHandler(cfg.Auth),
		},
	})
	oasDoc, _ := oas.GetSwagger()

	adminUserImpl := adminusers.New()
	adminusers.HandlerWithOptions(adminUserImpl, adminusers.ChiServerOptions{
		BaseRouter: routeRoot,
		Middlewares: []adminusers.MiddlewareFunc{
			InjectAPIDefinition(definition),
			JWTSecurityHandler(cfg.Auth),
		},
	})

	adminRoleImpl := adminroles.New()
	adminroles.HandlerWithOptions(adminRoleImpl, adminroles.ChiServerOptions{
		BaseRouter: routeRoot,
		Middlewares: []adminroles.MiddlewareFunc{
			InjectAPIDefinition(definition),
			JWTSecurityHandler(cfg.Auth),
		},
	})

	domainAuth.SetUp(cfg.Auth.JWT.Secret, cfg.Auth.JWT.Provider, cfg.Auth.JWT.ExpirationSec)
	authImpl := auth.New()
	auth.HandlerFromMux(authImpl, routeRoot)

	authconfigImp := authconfigs.New()
	authconfigs.HandlerWithOptions(authconfigImp, authconfigs.ChiServerOptions{
		BaseRouter: routeRoot,
		Middlewares: []authconfigs.MiddlewareFunc{
			InjectAPIDefinition(definition),
			JWTSecurityHandler(cfg.Auth),
		},
	})

	authDoc, _ := auth.GetSwagger()

	routeRoot.Get("/ping", func(writer http.ResponseWriter, request *http.Request) {
		writer.WriteHeader(http.StatusOK)
		fmt.Fprint(writer, "pong")
	})

	rootImpl := root.New()
	root.HandlerWithOptions(rootImpl, root.ChiServerOptions{
		BaseRouter:  routeRoot,
		Middlewares: []root.MiddlewareFunc{},
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
	/*
		https://example.com/logo.png
						if err := helpers.OasMerge(apiDef, &openapi3.T{Info: &openapi3.Info{ExtensionProps: openapi3.ExtensionProps{
							Extensions: cfg.Oas.InfoExtensions,
						}}})
	*/
	if err := merge(definition, &openapi3.T{Info: &openapi3.Info{ExtensionProps: openapi3.ExtensionProps{
		Extensions: cfg.Oas.InfoExtensions,
	}}}); err != nil {
		panic(err)
	}

	helpers.Ref(definition, "./components.yaml", "")
	// TODO: デバッグ中
	//routeRoot.Use(OpenAPI3Validator(definition, &openapi3filter.Options{}))

	return routeRoot
}

type (
	/*
		   - id: user
						      group: 管理画面/ユーザー
						      title: ユーザー情報
						      description: ユーザー情報を閲覧/管理します
						      contents:
	*/

	XPage struct {
		ID          string        `json:"id"`
		Group       string        `json:"group"`
		Title       string        `json:"title"`
		Description string        `json:"description"`
		Contents    []interface{} `json:"contents"`
	}
	XTable struct {
		ResponseListKey string      `json:"responseListKey"`
		Pager           interface{} `json:"pager"`
		Sort            interface{} `json:"sort"`
	}
	XAutoComplete struct {
		ResponseLabelKey string `json:"responseLabelKey"`
		ResponseValueKey string `json:"responseValueKey"`
	}
	Extensions struct {
		XPages     []*XPage       `json:"x-pages"`
		XTable     *XTable        `json:"x-table"`
		XComplete  *XAutoComplete `json:"x-autocomplete"`
		XTheme     string         `json:"x-theme"`
		XThumbnail string         `json:"x-thumbnail"`
		XTags      []string       `json:"x-tags"`
	}
)

func merge(dist *openapi3.T, src *openapi3.T) error {
	return helpers.OasMerge(dist, src)
}

func mergeold(dist *openapi3.T, src *openapi3.T) error {

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

	fmt.Println("--Extensions")
	if len(src.Info.Extensions) > 0 {

		srcEx := &Extensions{
			XPages:    []*XPage{},
			XComplete: &XAutoComplete{},
			XTable:    &XTable{},
		}

		srcJSONEx, _ := json.Marshal(src.Info.Extensions)
		fmt.Printf("src info extensions %s\n", string(srcJSONEx))
		fmt.Printf("srcEx %v, %v, %v\n", srcEx.XPages, srcEx.XTable, srcEx.XComplete)
		fmt.Printf("xPages %d\n", len(srcEx.XPages))

		if err := json.Unmarshal(srcJSONEx, srcEx); err != nil {
			fmt.Printf("unmarshal err %v\n", err)
		} else {
			fmt.Println("unmarshal success")
			fmt.Printf("srcEx %v, %v, %v\n", srcEx.XPages, srcEx.XTable, srcEx.XComplete)

			distEx := &Extensions{
				XPages:    []*XPage{},
				XComplete: &XAutoComplete{},
				XTable:    &XTable{},
			}

			if len(dist.Info.Extensions) > 0 {
				distJSONEx, _ := json.Marshal(dist.Info.Extensions)
				if err := json.Unmarshal(distJSONEx, distEx); err != nil {
					fmt.Printf("dist json ex unmarshal err %v\n", err)
				}
			}

			if distEx.XComplete == nil || distEx.XComplete.ResponseLabelKey == "" {
				distEx.XComplete = srcEx.XComplete
			}
			if distEx.XTable == nil || distEx.XTable.ResponseListKey == "" {
				distEx.XTable = srcEx.XTable
			}
			if len(srcEx.XPages) > 0 {
				distEx.XPages = append(distEx.XPages, srcEx.XPages...)
			}
			if len(srcEx.XTags) > 0 {
				distEx.XTags = append(distEx.XTags, srcEx.XTags...)
			}
			if distEx.XTheme == "" && srcEx.XTheme != "" {
				distEx.XTheme = srcEx.XTheme
			}
			if distEx.XThumbnail == "" && srcEx.XThumbnail != "" {
				distEx.XThumbnail = srcEx.XThumbnail
			}

			if distJSONExFixies, err := json.Marshal(distEx); err == nil {
				distExtensions := map[string]interface{}{}
				if err := json.Unmarshal(distJSONExFixies, &distExtensions); err != nil {
					fmt.Printf("unmarshal failed%v\n", err)
				} else {
					dist.Info.Extensions = distExtensions
				}
			}

			fmt.Printf("dist.info.extensions %+v\n", dist.Info.Extensions)
		}
	}

	debugJ, _ := json.Marshal(dist)
	fmt.Printf("debugJ %s\n", string(debugJ))

	fmt.Println("--")
	return nil
}

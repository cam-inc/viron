package routes

import (
	"net/http"

	"github.com/cam-inc/viron/example/golang/pkg/migrate"

	"github.com/getkin/kin-openapi/openapi3filter"

	"github.com/cam-inc/viron/example/golang/pkg/constant"
	"github.com/cam-inc/viron/packages/golang/logging"

	"github.com/cam-inc/viron/packages/golang/routes/adminaccounts"

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

	log := logging.GetLogger(constant.LOG_NAME, logging.DebugLevel)

	cfg := config.New()

	if cfg.StoreMode == config.StoreModeMySQL {
		mysqlConfig := cfg.StoreMySQL
		store.SetupMySQL(mysqlConfig)
		if err := domains.SetUpMySQL(store.GetMySQLConnection()); err != nil {
			panic(err)
		}
		if err := packageDomains.NewMySQL(store.GetMySQLConnection()); err != nil {
			panic(err)
		}
		if err := migrate.InitMySQL(store.GetMySQLConnection(), cfg.StoreMySQL.DBName, "file:///viron/example/golang/pkg/migrate/sql"); err != nil {
			panic(err)
		}
	} else {
		store.SetupMongo(cfg.StoreMongo)
		conn := store.GetMongoCollection()
		if err := domains.SetUpMongo(conn.Client, cfg.StoreMongo.VironDB); err != nil {
			panic(err)
		}
		if err := packageDomains.NewMongo(conn.Options, cfg.StoreMongo.VironDB, cfg.StoreMongo.CasbinCollectionName); err != nil {
			panic(err)
		}
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

	authconfigsDoc, _ := authconfigs.GetSwagger()
	if err := merge(definition, authconfigsDoc); err != nil {
		panic(err)
	}

	adminusersDoc, _ := adminusers.GetSwagger()
	if err := merge(definition, adminusersDoc); err != nil {
		panic(err)
	}
	adminaccountsDoc, err := adminaccounts.GetSwagger()
	log.Debugf("accounts %+v err %+v", adminaccountsDoc, err)
	if err := merge(definition, adminaccountsDoc); err != nil {
		panic(err)
	}

	adminrolesDoc, _ := adminroles.GetSwagger()
	if err := merge(definition, adminrolesDoc); err != nil {
		panic(err)
	}

	auditlogsDoc, _ := auditlogs.GetSwagger()
	if err := merge(definition, auditlogsDoc); err != nil {
		panic(err)
	}

	oasDoc, _ := oas.GetSwagger()
	if err := merge(definition, oasDoc); err != nil {
		panic(err)
	}

	authDoc, _ := auth.GetSwagger()
	if err := merge(definition, authDoc); err != nil {
		panic(err)
	}
	if err := merge(definition, &openapi3.T{Info: &openapi3.Info{ExtensionProps: openapi3.ExtensionProps{
		Extensions: cfg.Oas.InfoExtensions,
	}}}); err != nil {
		panic(err)
	}

	// $refの置換
	helpers.Ref(definition, "./components.yaml", "")
	helpers.Ref(definition, "./adminusers.yaml", "")

	routeRoot := chi.NewRouter()
	routeRoot.Use(Cors(cfg.Cors))
	routeRoot.Use(InjectConfig(cfg))
	routeRoot.Use(middleware.Logger)
	routeRoot.Use(middleware.Recoverer)
	routeRoot.Use(InjectLogger())
	routeRoot.Use(InjectAuditLog)

	oasImpl := oas.New()
	oas.HandlerWithOptions(oasImpl, oas.ChiServerOptions{
		BaseRouter: routeRoot,
		Middlewares: []oas.MiddlewareFunc{
			InjectAPIDefinition(definition),
			JWTAuthHandlerFunc(),
			OpenAPI3ValidatorHandlerFunc(definition, &openapi3filter.Options{
				AuthenticationFunc: AuthenticationFunc,
			}),
			JWTSecurityHandlerFunc(cfg.Auth),
		},
	})

	adminUserImpl := adminusers.New()
	adminusers.HandlerWithOptions(adminUserImpl, adminusers.ChiServerOptions{
		BaseRouter: routeRoot,
		Middlewares: []adminusers.MiddlewareFunc{
			InjectAPIDefinition(definition),
			JWTSecurityHandlerFunc(cfg.Auth),
			OpenAPI3ValidatorHandlerFunc(definition, &openapi3filter.Options{
				AuthenticationFunc: AuthenticationFunc,
			}),
			JWTSecurityHandlerFunc(cfg.Auth),
		},
	})

	adminAccountImpl := adminaccounts.New()
	adminaccounts.HandlerWithOptions(adminAccountImpl, adminaccounts.ChiServerOptions{
		BaseRouter: routeRoot,
		Middlewares: []adminaccounts.MiddlewareFunc{
			InjectAPIDefinition(definition),
			JWTSecurityHandlerFunc(cfg.Auth),
			OpenAPI3ValidatorHandlerFunc(definition, &openapi3filter.Options{
				AuthenticationFunc: AuthenticationFunc,
			}),
			JWTSecurityHandlerFunc(cfg.Auth),
		},
	})

	adminRoleImpl := adminroles.New()
	adminroles.HandlerWithOptions(adminRoleImpl, adminroles.ChiServerOptions{
		BaseRouter: routeRoot,
		Middlewares: []adminroles.MiddlewareFunc{
			InjectAPIDefinition(definition),
			JWTSecurityHandlerFunc(cfg.Auth),
			OpenAPI3ValidatorHandlerFunc(definition, &openapi3filter.Options{
				AuthenticationFunc: AuthenticationFunc,
			}),
			JWTSecurityHandlerFunc(cfg.Auth),
		},
	})

	if err := domainAuth.SetUp(cfg.Auth.JWT.Secret, cfg.Auth.JWT.Provider, cfg.Auth.JWT.ExpirationSec); err != nil {
		panic(err)
	}
	authImpl := auth.New()
	auth.HandlerFromMux(authImpl, routeRoot)

	authconfigImp := authconfigs.New()
	authconfigs.HandlerWithOptions(authconfigImp, authconfigs.ChiServerOptions{
		BaseRouter: routeRoot,
		Middlewares: []authconfigs.MiddlewareFunc{
			InjectAPIDefinition(definition),
			JWTSecurityHandlerFunc(cfg.Auth),
		},
	})

	auditlogImp := auditlogs.New()
	auditlogs.HandlerWithOptions(auditlogImp, auditlogs.ChiServerOptions{
		BaseRouter: routeRoot,
		Middlewares: []auditlogs.MiddlewareFunc{
			InjectAPIDefinition(definition),
			JWTSecurityHandlerFunc(cfg.Auth),
		},
	})

	routeRoot.Get("/ping", func(w http.ResponseWriter, request *http.Request) {
		helpers.Send(w, http.StatusOK, "pong")
	})

	rootImpl := root.New()
	root.HandlerWithOptions(rootImpl, root.ChiServerOptions{
		BaseRouter:  routeRoot,
		Middlewares: []root.MiddlewareFunc{},
	})

	return routeRoot
}

func merge(dist *openapi3.T, src *openapi3.T) error {
	return helpers.OasMerge(dist, src)
}

package routes

import (
	"net/http"

	"github.com/cam-inc/viron/example/golang/pkg/migrate"

	"github.com/getkin/kin-openapi/openapi3filter"

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
	packageDomainAuth "github.com/cam-inc/viron/packages/golang/domains/auth"
	"github.com/cam-inc/viron/packages/golang/routes/auth"
	"github.com/cam-inc/viron/packages/golang/routes/oas"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/imdario/mergo"
)

func New() http.Handler {

	cfg := config.New()

	domainAuth := packageDomainAuth.New(cfg.Auth.MultipleAuthUser, cfg.Auth.GoogleOAuth2, cfg.Auth.OIDC, nil)

	if cfg.StoreMode == config.StoreModeMySQL {
		mysqlConfig := cfg.StoreMySQL
		store.SetupMySQL(mysqlConfig)
		if err := domains.SetUpMySQL(store.GetMySQLConnection()); err != nil {
			panic(err)
		}
		if err := packageDomains.NewMySQL(store.GetMySQLConnection()); err != nil {
			panic(err)
		}
		if cfg.StoreMySQL.CasbinLoadIntervalSec != nil {
			packageDomains.SetLoadPolicyInterval(*cfg.StoreMySQL.CasbinLoadIntervalSec)
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
		if cfg.StoreMySQL.CasbinLoadIntervalSec != nil {
			packageDomains.SetLoadPolicyInterval(*cfg.StoreMySQL.CasbinLoadIntervalSec)
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
	rootDoc, err := root.GetSwagger()
	if err != nil {
		panic(err)
	}
	definition.OpenAPI = rootDoc.OpenAPI
	definition.Servers = rootDoc.Servers
	if err := mergo.Merge(definition.Info, *rootDoc.Info); err != nil {
		panic(err)
	}
	if err := merge(definition, rootDoc); err != nil {
		panic(err)
	}
	componentsDoc, err := components.GetSwagger()
	if err != nil {
		panic(err)
	}
	if err := merge(definition, componentsDoc); err != nil {
		panic(err)
	}

	packageComponentsDoc, err := packageComponents.GetSwagger()
	if err != nil {
		panic(err)
	}
	if err := merge(definition, packageComponentsDoc); err != nil {
		panic(err)
	}

	authconfigsDoc, err := authconfigs.GetSwagger()
	if err != nil {
		panic(err)
	}
	if err := merge(definition, authconfigsDoc); err != nil {
		panic(err)
	}

	adminusersDoc, err := adminusers.GetSwagger()
	if err != nil {
		panic(err)
	}
	if err := merge(definition, adminusersDoc); err != nil {
		panic(err)
	}
	adminaccountsDoc, err := adminaccounts.GetSwagger()
	if err != nil {
		panic(err)
	}
	if err := merge(definition, adminaccountsDoc); err != nil {
		panic(err)
	}

	adminrolesDoc, err := adminroles.GetSwagger()
	if err != nil {
		panic(err)
	}
	if err := merge(definition, adminrolesDoc); err != nil {
		panic(err)
	}

	auditlogsDoc, err := auditlogs.GetSwagger()
	if err != nil {
		panic(err)
	}
	if err := merge(definition, auditlogsDoc); err != nil {
		panic(err)
	}

	oasDoc, err := oas.GetSwagger()
	if err != nil {
		panic(err)
	}
	if err := merge(definition, oasDoc); err != nil {
		panic(err)
	}

	authDoc, err := auth.GetSwagger()
	if err != nil {
		panic(err)
	}
	if err := merge(definition, authDoc); err != nil {
		panic(err)
	}
	if err := merge(definition, &openapi3.T{Info: &openapi3.Info{ExtensionProps: openapi3.ExtensionProps{
		Extensions: cfg.Oas.InfoExtensions,
	}}}); err != nil {
		panic(err)
	}

	// $refの置換
	if err := helpers.Ref(definition, "./components.yaml", ""); err != nil {
		panic(err)
	}
	if err := helpers.Ref(definition, "./adminusers.yaml", ""); err != nil {
		panic(err)
	}

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
			JWTSecurityHandlerFunc(domainAuth),
		},
	})

	adminUserImpl := adminusers.New()
	adminusers.HandlerWithOptions(adminUserImpl, adminusers.ChiServerOptions{
		BaseRouter: routeRoot,
		Middlewares: []adminusers.MiddlewareFunc{
			InjectAPIACL(definition),
			JWTSecurityHandlerFunc(domainAuth),
			OpenAPI3ValidatorHandlerFunc(definition, &openapi3filter.Options{
				AuthenticationFunc: AuthenticationFunc,
			}),
			JWTAuthHandlerFunc(),
			InjectAPIDefinition(definition),
		},
	})

	adminAccountImpl := adminaccounts.New()
	adminaccounts.HandlerWithOptions(adminAccountImpl, adminaccounts.ChiServerOptions{
		BaseRouter: routeRoot,
		Middlewares: []adminaccounts.MiddlewareFunc{
			InjectAPIACL(definition),
			JWTSecurityHandlerFunc(domainAuth),
			OpenAPI3ValidatorHandlerFunc(definition, &openapi3filter.Options{
				AuthenticationFunc: AuthenticationFunc,
			}),
			JWTAuthHandlerFunc(),
			InjectAPIDefinition(definition),
		},
	})

	adminRoleImpl := adminroles.New()
	adminroles.HandlerWithOptions(adminRoleImpl, adminroles.ChiServerOptions{
		BaseRouter: routeRoot,
		Middlewares: []adminroles.MiddlewareFunc{
			InjectAPIACL(definition),
			JWTSecurityHandlerFunc(domainAuth),
			OpenAPI3ValidatorHandlerFunc(definition, &openapi3filter.Options{
				AuthenticationFunc: AuthenticationFunc,
			}),
			JWTAuthHandlerFunc(),
			InjectAPIDefinition(definition),
		},
	})

	if err := packageDomainAuth.SetUpJWT(cfg.Auth.JWT.Secret, cfg.Auth.JWT.Provider, cfg.Auth.JWT.ExpirationSec); err != nil {
		panic(err)
	}
	authImpl := auth.New(domainAuth)
	auth.HandlerFromMux(authImpl, routeRoot)

	authconfigImp := authconfigs.New(cfg.Auth.GoogleOAuth2, cfg.Auth.OIDC)
	authconfigs.HandlerWithOptions(authconfigImp, authconfigs.ChiServerOptions{
		BaseRouter: routeRoot,
		Middlewares: []authconfigs.MiddlewareFunc{
			InjectAPIDefinition(definition),
			JWTSecurityHandlerFunc(domainAuth),
		},
	})

	auditlogImp := auditlogs.New()
	auditlogs.HandlerWithOptions(auditlogImp, auditlogs.ChiServerOptions{
		BaseRouter: routeRoot,
		Middlewares: []auditlogs.MiddlewareFunc{
			InjectAPIACL(definition),
			JWTSecurityHandlerFunc(domainAuth),
			InjectAPIDefinition(definition),
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

module github.com/cam-inc/viron/example/golang

go 1.16

require (
	github.com/cam-inc/viron/packages/golang v0.0.0-00010101000000-000000000000
	github.com/getkin/kin-openapi v0.66.0
	github.com/go-chi/chi v1.5.1
	github.com/go-chi/chi/v5 v5.0.3
	github.com/go-chi/cors v1.2.0
	github.com/go-sql-driver/mysql v1.6.0
	github.com/golang-migrate/migrate/v4 v4.14.1
	github.com/imdario/mergo v0.3.12
	github.com/spf13/cobra v1.2.1
	go.uber.org/automaxprocs v1.4.0
)

replace github.com/cam-inc/viron/packages/golang => ../../packages/golang

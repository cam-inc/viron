module github.com/viron/example/golang

go 1.16

require (
	github.com/go-chi/chi/v5 v5.0.3
	github.com/go-sql-driver/mysql v1.6.0
	github.com/spf13/cobra v1.2.1
	github.com/viron/packages/golang v0.0.0-00010101000000-000000000000
	go.uber.org/automaxprocs v1.4.0
)

replace github.com/viron/packages/golang => ../../packages/golang

package routes

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/viron/example/golang/pkg/config"
	"github.com/viron/example/golang/pkg/store"
	"github.com/viron/packages/golang/routes/auth"
	"github.com/viron/packages/golang/routes/oas"
)

func New() http.Handler {

	mysqlConfig := config.New().StoreMySQL
	fmt.Printf("msyql: %v\n", mysqlConfig)
	store.SetupMySQL(mysqlConfig)

	root := chi.NewRouter()
	oasImpl := oas.New()
	oas.HandlerFromMux(oasImpl, root)

	authImpl := auth.New()
	auth.HandlerFromMux(authImpl, root)

	root.Get("/ping", func(writer http.ResponseWriter, request *http.Request) {
		writer.WriteHeader(http.StatusOK)
		fmt.Fprint(writer, "pong")
	})

	return root
}

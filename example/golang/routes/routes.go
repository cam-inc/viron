package routes

import (
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/viron/packages/golang/packages/golang/routes/auth"
	"github.com/viron/packages/golang/packages/golang/routes/oas"
	"net/http"
)

func New() http.Handler {
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

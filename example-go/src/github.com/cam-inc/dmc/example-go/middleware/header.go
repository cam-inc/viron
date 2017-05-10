package middleware

import (
	"net/http"

	"context"

	"github.com/goadesign/goa"
)

// SetHeader add response header
func SetHeader() goa.Middleware {
	setHeader := func(nextHandler goa.Handler) goa.Handler {
		return func(ctx context.Context, rw http.ResponseWriter, req *http.Request) error {
			rw.Header().Set("Access-Control-Expose-Headers", "Authorization, X-Pagination-Limit, X-Pagination-Total-Pages, X-Pagination-Current-Page")
			return nextHandler(ctx, rw, req)
		}
	}

	fm, _ := goa.NewMiddleware(setHeader)
	return fm
}

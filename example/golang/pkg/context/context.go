package context

import (
	"context"
	"net/http"

	"github.com/cam-inc/viron/example/golang/pkg/constant"
	pkgConstant "github.com/cam-inc/viron/packages/golang/constant"

	"github.com/cam-inc/viron/packages/golang/logging"
)

func Log(ctx context.Context) logging.Logger {
	var log logging.Logger
	if l := ctx.Value(constant.LOG_NAME); l != nil {
		if logConv, exits := l.(logging.Logger); exits {
			log = logConv
		}
	}
	return log
}

func SetLogger(r *http.Request, level logging.Level) *http.Request {
	log := logging.GetLogger(constant.LOG_NAME, level)
	ctx := r.Context()
	ctx = context.WithValue(ctx, constant.LOG_NAME, log)
	return r.WithContext(ctx)
}

func SetUserID(r *http.Request, user string) *http.Request {
	ctx := r.Context()
	ctx = context.WithValue(ctx, pkgConstant.CTX_KEY_ADMINUSER, user)
	return r.WithContext(ctx)
}

func GetUserID(r *http.Request) string {
	ctx := r.Context()
	var user string
	if l := ctx.Value(pkgConstant.CTX_KEY_ADMINUSER_ID); l != nil {
		if u, exits := l.(string); exits {
			user = u
		}
	}
	return user
}

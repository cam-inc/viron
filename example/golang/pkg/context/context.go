package context

import (
	"context"
	"net/http"

	"github.com/cam-inc/viron/example/golang/pkg/constant"

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

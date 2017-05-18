package middleware

import (
	"context"
	"encoding/json"
	"math"
	"net/http"

	"net"
	"strings"

	"github.com/cam-inc/dmc/example-go/bridge"
	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	genModels "github.com/cam-inc/dmc/example-go/gen/models"
	"github.com/cam-inc/dmc/example-go/models"
	jwtgo "github.com/dgrijalva/jwt-go"
	"github.com/goadesign/goa"
	"go.uber.org/zap"
	"golang.org/x/blog/content/context/userip"
)

func getIpAddress(req *http.Request) string {
	for _, h := range []string{"x-forwarded-for", "x-real-ip"} {
		addresses := strings.Split(req.Header.Get(h), ",")
		for i := len(addresses) - 1; i >= 0; i-- {
			ip := strings.TrimSpace(addresses[i])
			realIP := net.ParseIP(ip)
			if !realIP.IsGlobalUnicast() {
				continue
			}
			return ip
		}
	}
	if ip, err := userip.FromRequest(req); err != nil {
		return req.RemoteAddr
	} else {
		return ip.String()
	}
}

// AuditLog writes a audit log
func AuditLog() goa.Middleware {
	fm, _ := goa.NewMiddleware(AuditLogHandler)
	return fm
}

// AuditLogHandler returns a handler for audit log
func AuditLogHandler(nextHandler goa.Handler) goa.Handler {
	logger := common.GetLogger("default")

	return func(ctx context.Context, rw http.ResponseWriter, req *http.Request) error {
		if req.Method == "OPTIONS" {
			return nil
		}

		userID := "unknown"
		requestBody := ""
		payload := goa.ContextRequest(ctx).Payload

		cl := ctx.Value(bridge.JwtClaims)
		if cl != nil {
			claims := cl.(jwtgo.MapClaims)
			userID = claims["sub"].(string)
			jsonBytes, _ := json.Marshal(payload)
			requestBody = string(jsonBytes)
		} else if req.Method == "POST" && req.RequestURI == "/signin" {
			// `/signin` の場合はrequestBodyからuserIDを取り出す
			// passwordをログ出力したくないのでrequestBodyは出さない
			if payload != nil {
				_payload := payload.(*app.SigninAuthPayload)
				userID = *_payload.Email
			}
		} else {
			// 非認証API
			if payload != nil {
				jsonBytes, _ := json.Marshal(payload)
				requestBody = string(jsonBytes)
			}
		}

		res := goa.ContextResponse(ctx)
		auditLogTable := genModels.NewAuditLogDB(models.DB)
		m := genModels.AuditLog{}
		m.UserID = userID
		m.RequestURI = req.RequestURI[0:int(math.Min(float64(len(req.RequestURI)), float64(2048)))]
		m.RequestMethod = req.Method
		m.SourceIP = getIpAddress(req)
		m.RequestBody = requestBody
		m.StatusCode = res.Status

		if err := auditLogTable.Add(ctx, &m); err != nil {
			logger.Error("AuditLog save failure.",
				zap.String("method", req.Method),
				zap.String("uri", req.RequestURI),
				zap.String("userID", userID),
				zap.Error(err))
		}
		return nextHandler(ctx, rw, req)
	}
}

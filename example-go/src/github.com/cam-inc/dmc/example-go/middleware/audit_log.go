package middleware

import (
	"context"
	"encoding/json"
	"net/http"

	"net"
	"strings"

	"github.com/cam-inc/dmc/example-go/bridge"
	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/cam-inc/dmc/example-go/gen/models"
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
	logger := common.GetLogger("default")
	logging := func(nextHandler goa.Handler) goa.Handler {
		return func(ctx context.Context, rw http.ResponseWriter, req *http.Request) error {
			defer func() {
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
					_payload := payload.(*app.SigninAuthPayload)
					userID = *_payload.LoginID
				} else {
					// 非認証API
					jsonBytes, _ := json.Marshal(payload)
					requestBody = string(jsonBytes)
				}

				res := goa.ContextResponse(ctx)
				auditLogTable := models.NewAuditLogDB(common.DB)
				m := models.AuditLog{}
				m.UserID = userID
				m.RequestURI = req.RequestURI
				m.ReuquestMethod = req.Method
				m.SourceIP = getIpAddress(req)
				m.RequestBody = requestBody
				m.StatusCode = res.Status

				err := auditLogTable.Add(ctx, &m)
				if err != nil {
					logger.Error("AuditLog save failure.",
						zap.String("method", req.Method),
						zap.String("uri", req.RequestURI),
						zap.String("userID", userID),
						zap.Error(err))
				}
			}()
			return nextHandler(ctx, rw, req)
		}
	}

	fm, _ := goa.NewMiddleware(logging)
	return fm
}

package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// AuditLogMediaType of media type.
var AuditLogMediaType = MediaType("application/vnd.audit_log+json", func() {
	Description("A Audit Log")

	Attributes(func() {
		Attribute("request_method", String, "http request method")
		Attribute("request_uri", String, "request uri")
		Attribute("source_ip", String, "source ip address")
		Attribute("user_id", String, "user id")
		Attribute("request_body", String, "request body")
		Attribute("status", String, "http status code")
		Attribute("created_at", DateTime, "created time")
	})

	View("default", func() {
		Attribute("request_method")
		Attribute("request_uri")
		Attribute("source_ip")
		Attribute("user_id")
		Attribute("request_body")
		Attribute("status")
		Attribute("created_at")

	})

	View("tiny", func() {
		Attribute("request_method")
		Attribute("request_uri")
		Attribute("user_id")
		Attribute("created_at")
	})
})

var _ = Resource("audit_log", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/auditlog")
	DefaultMedia(AuditLogMediaType)

	// TODO: ログイン画面できるまでは外しておく
	//Security(JWT, func() {
	//	Scope("api:access")
	//})

	Action("list", func() {
		Description("get admin roles")
		Routing(GET(""))
		Response(OK, func() {
			Media(CollectionOf(AuditLogMediaType, func() {
				View("default")
				View("tiny")
			}))
		})
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})

})

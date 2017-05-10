package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// AuditLogMediaType of media type.
var AuditLogMediaType = MediaType("application/vnd.audit_log+json", func() {
	Description("A Audit Log")
	ContentType("application/json")

	Attributes(func() {
		Attribute("request_method", String, "http request method")
		Attribute("request_uri", String, "request uri")
		Attribute("source_ip", String, "source ip address")
		Attribute("user_id", String, "user id")
		Attribute("request_body", String, "request body")
		Attribute("status", String, "http status code")
		Attribute("created_at", DateTime, "created time")
	})

	largeView := func() {
		Attribute("request_method")
		Attribute("request_uri")
		Attribute("source_ip")
		Attribute("user_id")
		Attribute("request_body")
		Attribute("status")
		Attribute("created_at")

	}

	View("default", largeView)
	View("large", largeView)
	View("medium", func() {
		Attribute("request_method")
		Attribute("request_uri")
		Attribute("user_id")
		Attribute("created_at")
	})
	View("small", func() {
		Attribute("request_method")
		Attribute("request_uri")
		Attribute("user_id")
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
		Params(func() {
			Param("limit", Integer, "number of items per page")
			Param("offset", Integer, "offset number of page")
		})
		Response(OK, func() {
			Media(CollectionOf(AuditLogMediaType, func() {
				ContentType("application/json")
				View("default")
				View("large")
				View("medium")
				View("small")
			}))
		})
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})
})

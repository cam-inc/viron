package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// Resource jwt uses the JWTSecurity security scheme.
var _ = Resource("file", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/file")

	Action("upload", func() {
		Description("file upload")
		Routing(POST(""))
		Payload(func() {
			Member("data", String, "base64 encoded binary data")
			Member("path", String, "file path")
		})
		Response(NoContent)
		Response(InternalServerError)
		Response(BadRequest, ErrorMedia)
	})

	Action("download", func() {
		Description("file download")
		Routing(GET("*path"))
		Response(OK, func() {
			Headers(func() {
				Header("Content-Length", String, "content size")
				Header("Content-Disposition", String, "content disposition")
			})
		})
		Response(InternalServerError)
		Response(BadRequest, ErrorMedia)
	})
})

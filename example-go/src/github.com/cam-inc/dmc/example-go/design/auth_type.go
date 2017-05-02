package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// AuthTypeMediaType of media type.
var AuthTypeMediaType = MediaType("application/vnd.auth_type+json", func() {
	Description("A Auth Type")

	Attributes(func() {
		Attribute("type", String, "auth type")
		Attribute("url", String, "request url")
		Attribute("method", String, "request method")
		Attribute("provider", String, "auth provider")

		Required("type", "url", "method", "provider")
	})

	View("default", func() {
		Attribute("type")
		Attribute("url")
		Attribute("method")
		Attribute("provider")
	})
})

var _ = Resource("auth_type", func() {
	Origin(OriginURL, OriginAllowAll)

	Action("list", func() {
		Routing(GET("/dmc_authtype"))
		Description("get auth types")
		Response(OK, func() {
			Media(CollectionOf(AuthTypeMediaType, func() {
				View("default")
			}))
		})
	})
})

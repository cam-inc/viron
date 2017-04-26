package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// AuthTypeMediaType of media type.
var AuthTypeMediaType = MediaType("application/vnd.auth_type+json", func() {
	Description("A Auth Type")

	Attributes(func() {
		Attribute("auth_types", ArrayOf(String), "list of auth_type")
		Required("auth_types")
	})

	View("default", func() {
		Attribute("auth_types")
	})
})

var _ = Resource("auth_type", func() {
	Origin(OriginURL, OriginAllowAll)

	Action("list", func() {
		Routing(GET("/authtypes"))
		Description("get auth types")
		Response(OK, func() { Media(AuthTypeMediaType) })
	})
})

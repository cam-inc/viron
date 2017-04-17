package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// QuickViewMediaType of media type.
var QuickViewMediaType = MediaType("application/vnd.quickview+json", func() {
	Description("A QuickView page data")

	Attributes(func() {
		Attribute("name", String, "Name of QickView")
		Attribute("componets", ArrayOf(ComponentType), "A Componets format")
		Required("name", "componets")
	})

	View("default", func() {
		Attribute("name")
		Attribute("componets")
	})
})

var _ = Resource("quickview", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/quickview")
	DefaultMedia(QuickViewMediaType)
	Action("show", func() {
		Routing(GET(""))
		Description("Quick view")
		Response(OK, func() { Media(QuickViewMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})
})

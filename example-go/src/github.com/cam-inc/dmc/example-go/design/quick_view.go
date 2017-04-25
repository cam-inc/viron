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
		Attribute("components", ArrayOf(ComponentType), "A components format")
		Required("name", "components")
	})

	View("default", func() {
		Attribute("name")
		Attribute("components")
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

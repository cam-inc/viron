package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// OverviewMediaType of media type.
var OverviewMediaType = MediaType("application/vnd.overview+json", func() {
	Description("A Overview page data")

	Attributes(func() {
		Attribute("name", NameType, "Name pattern")
		Attribute("componets", ArrayOf(ComponentType), "A Componets format")
		Required("name", "componets")
	})

	View("default", func() {
		Attribute("name")
		Attribute("componets")
	})
})

var _ = Resource("overview", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/overview")
	DefaultMedia(OverviewMediaType)
	Action("show", func() {
		Routing(GET(""))
		// Metadata("swagger:tag:dmc_show")
		Description("dmc setting data")
		Response(OK, func() { Media(OverviewMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})
})

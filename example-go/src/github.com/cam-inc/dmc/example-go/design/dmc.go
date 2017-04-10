package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// DMCMediaType of media type.
var DMCMediaType = MediaType("application/vnd.dmc+json", func() {
	Description("A DMC settings data")

	Attributes(func() {
		Attribute("name", NameType, "Name pattern")
		Attribute("pages", ArrayOf(PageType), "A Pages format")
		Attribute("pagination", PaginationType, "Pagination definition")
		Required("name", "pages", "pagination")
	})

	View("default", func() {
		Attribute("name")
		Attribute("pages")
		Attribute("pagination")
	})
})

var _ = Resource("dmc", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/dmc")
	DefaultMedia(DMCMediaType)
	Action("show", func() {
		Routing(GET(""))
		// Metadata("swagger:tag:dmc_show")
		Description("dmc setting data")
		Response(OK, func() { Media(DMCMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})
})

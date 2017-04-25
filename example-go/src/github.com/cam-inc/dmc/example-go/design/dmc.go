package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// DMCMediaType of media type.
var DMCMediaType = MediaType("application/vnd.dmc+json", func() {
	Description("A DMC settings data")

	Attributes(func() {
		Attribute("name", String, "Name pattern")
		Attribute("theme", Theme)
		Attribute("thumbnail", String, "thumbnail of endpoint")
		Attribute("tags", ArrayOf(String), "tags")
		Attribute("pages", ArrayOf(PageType), "A Pages format")
		Required("name", "theme", "thumbnail", "tags", "pages")
	})

	View("default", func() {
		Attribute("name")
		Attribute("theme")
		Attribute("thumbnail")
		Attribute("tags")
		Attribute("pages")
	})
})

var _ = Resource("dmc", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/dmc")
	DefaultMedia(DMCMediaType)
	Action("show", func() {
		Routing(GET(""))
		Description("dmc settings")
		Response(OK, func() { Media(DMCMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})
})

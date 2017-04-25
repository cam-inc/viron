package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// StatsDAUMediaType of media type.
var StatsDAUMediaType = MediaType("application/vnd.statsdau+json", func() {
	Description("A DAU data")

	Attributes(func() {
		Attribute("value", Number, "DAU of Stats")
		Required("value")
	})

	View("default", func() {
		Attribute("value")
	})
})

// StatsMAUMediaType of media type.
var StatsMAUMediaType = MediaType("application/vnd.statsmau+json", func() {
	Description("A MAU data")

	Attributes(func() {
		Attribute("value", Number, "MAU of Stats")
		Required("value")
	})

	View("default", func() {
		Attribute("value")
	})
})

var _ = Resource("stats_dau", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/stats/dau")
	DefaultMedia(StatsDAUMediaType)
	Action("show", func() {
		Routing(GET(""))
		Description("Service Daily Activity User")
		Response(OK, func() {
			Media(StatsDAUMediaType)
		})
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})
})

var _ = Resource("stats_mau", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/stats/mau")
	DefaultMedia(StatsMAUMediaType)
	Action("show", func() {
		Routing(GET(""))
		Description("Service Monthly Activity User")
		Response(OK, func() {
			Media(StatsMAUMediaType)
		})
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})
})

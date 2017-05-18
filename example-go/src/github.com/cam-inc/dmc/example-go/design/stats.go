package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// StatsDAUMediaType of media type.
var StatsDAUMediaType = MediaType("application/vnd.statsdau+json", func() {
	Description("A DAU data")
	ContentType("application/json")

	Attributes(func() {
		Attribute("value", Integer, "DAU of Stats")
		Required("value")
	})

	View("default", func() {
		Attribute("value")
	})
})

// StatsMAUMediaType of media type.
var StatsMAUMediaType = MediaType("application/vnd.statsmau+json", func() {
	Description("A MAU data")
	ContentType("application/json")

	Attributes(func() {
		Attribute("value", Integer, "MAU of Stats")
		Required("value")
	})

	View("default", func() {
		Attribute("value")
	})
})

// StatsPlanetMediaType of media type.
var StatsPlanetMediaType = MediaType("application/vnd.statsplanet+json", func() {
	Description("Planets data")
	ContentType("application/json")

	Attributes(func() {
		Attribute("data", ArrayOf(HashOf(String, Any)), "グラフデータ")
		Attribute("x", String, "X軸に使用するkey")
		Attribute("y", String, "Y軸に使用するkey")
		Attribute("size", String, "ドットの大きさに使用するkey")
		Attribute("color", String, "ドットの色分けに使用するkey")
		Attribute("guide", GuideType)
		Required("data", "x", "y", "size", "color", "guide")
	})

	View("default", func() {
		Attribute("data")
		Attribute("x")
		Attribute("y")
		Attribute("size")
		Attribute("color")
		Attribute("guide")
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

var _ = Resource("stats_planet", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/stats/planet")
	DefaultMedia(StatsPlanetMediaType)
	Action("bar", func() {
		Routing(GET("/bar"))
		Description("Planets Information")
		Response(OK, func() {
			Media(StatsPlanetMediaType)
		})
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})
	Action("scatterplot", func() {
		Routing(GET("/scatterplot"))
		Description("Planets Information")
		Response(OK, func() {
			Media(StatsPlanetMediaType)
		})
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})
	Action("line", func() {
		Routing(GET("/line"))
		Description("Planets Information")
		Response(OK, func() {
			Media(StatsPlanetMediaType)
		})
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})
	Action("horizontal-bar", func() {
		Routing(GET("/horizontal-bar"))
		Description("Planets Information")
		Response(OK, func() {
			Media(StatsPlanetMediaType)
		})
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})
	Action("stacked-bar", func() {
		Routing(GET("/stacked-bar"))
		Description("Planets Information")
		Response(OK, func() {
			Media(StatsPlanetMediaType)
		})
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})
	Action("horizontal-stacked-bar", func() {
		Routing(GET("/horizontal-stacked-bar"))
		Description("Planets Information")
		Response(OK, func() {
			Media(StatsPlanetMediaType)
		})
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})
	Action("stacked-area", func() {
		Routing(GET("/stacked-area"))
		Description("Planets Information")
		Response(OK, func() {
			Media(StatsPlanetMediaType)
		})
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})
})

var GuideType = Type("StatsGuideType", func() {
	Member("x", LabelType)
	Member("y", LabelType)
})

var LabelType = Type("StatsLabelType", func() {
	Member("label", String)
	Required("label")
})

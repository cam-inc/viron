package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// BlogDesignMediaType of media type.
var BlogDesignMediaType = MediaType("application/vnd.blog_design+json", func() {
	Description("A BlogDesign Master")
	ContentType("application/json")

	Reference(BlogDesignPayload)

	Attributes(func() {
		Attribute("id", String, "blog design id")
		Attribute("name", String, "blog design name")
		Attribute("base_color", String, "base color of blog design")
		Attribute("background_image", String, "background image of blog design")
		Attribute("created_at", DateTime, "created time")
		Attribute("updated_at", DateTime, "updated time")
	})

	largeView := func() {
		Attribute("id")
		Attribute("name")
		Attribute("base_color")
		Attribute("background_image")
		Attribute("created_at")
		Attribute("updated_at")
	}

	View("default", largeView)
	View("large", largeView)
	View("medium", func() {
		Attribute("id")
		Attribute("name")
		Attribute("base_color")
		Attribute("background_image")
	})
	View("small", func() {
		Attribute("id")
		Attribute("name")
	})
})

var _ = Resource("blog_design", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/blogdesign")
	DefaultMedia(BlogDesignMediaType)
	Security(JWT, func() {
		Scope("api:access")
	})

	Action("list", func() {
		Description("get blog designs")
		Routing(GET("", func() {
			Metadata("swagger:extension:x-ref", `["/blogdesign/{id}"]`)
		}))
		Params(func() {
			Param("limit", Integer, "number of items per page")
			Param("offset", Integer, "offset number of page")
		})
		Response(OK, func() {
			Media(CollectionOf(BlogDesignMediaType, func() {
				ContentType("application/json")
				View("default")
				View("large")
				View("medium")
				View("small")
			}))
		})
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("show", func() {
		Description("get the blog design")
		Routing(GET("/:id"))
		Params(func() {
			Param("id", String, "id")
		})
		Response(OK, func() { Media(BlogDesignMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("create", func() {
		Description("create a blog design")
		Routing(POST(""))
		Payload(BlogDesignPayload)
		Response(OK, func() { Media(BlogDesignMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("update", func() {
		Description("update the blog design")
		Routing(PUT("/:id"))
		Params(func() {
			Param("id", String, "id")
		})
		Payload(BlogDesignPayload)
		Response(OK, func() { Media(BlogDesignMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("delete", func() {
		Description("delete the blog design")
		Routing(DELETE("/:id"))
		Params(func() {
			Param("id", String, "id")
		})
		Response(NoContent)
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})
})

var BlogDesignPayload = Type("BlogDesignPayload", func() {
	Member("id", String, func() {})
	Member("name", String, func() {})
	Member("base_color", String, func() {})
	Member("background_image", String, func() {})
	Required("id", "name", "base_color")
})

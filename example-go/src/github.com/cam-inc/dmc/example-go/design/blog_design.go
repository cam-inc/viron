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
		Attribute("id", String)
		Attribute("name", String)
		Attribute("base_color", String)
		Attribute("background_image", String)
		Attribute("created_at", DateTime, "作成日時")
		Attribute("updated_at", DateTime, "更新日時")
	})

	View("default", func() {
		Attribute("id")
		Attribute("name")
		Attribute("base_color")
		Attribute("background_image")
		Attribute("created_at")
		Attribute("updated_at")
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
	Member("id", String, func() {
		Description("デザインID")
		Example("des_001")
	})
	Member("name", String, func() {
		Description("名前")
		Example("design name")
	})
	Member("base_color", String, func() {
		Description("ベースカラー")
		Example("blue")
	})
	Member("background_image", String, func() {
		Description("背景画像")
		Example("http://hoge.com/a.png")
	})
	Required("id", "name", "base_color")
})

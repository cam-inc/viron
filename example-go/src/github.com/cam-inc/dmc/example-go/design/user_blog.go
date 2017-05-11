package design

import (
	"github.com/cam-inc/dmc/example-go/bridge"
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// UserBlogMediaType of media type.
var UserBlogMediaType = MediaType("application/vnd.user_blog+json", func() {
	Description("A User Blog")
	ContentType("application/json")

	Attributes(func() {
		Attribute("id", Integer, "user blog id")
		Attribute("user_id", Integer, "user id")
		Attribute("title", String, "blog title")
		Attribute("sub_title", String, "blog sub title")
		Attribute("genre", String, "blog genre")
		Attribute("design_id", String, "blog design id")
		Attribute("created_at", DateTime, "user created date-time")
		Attribute("updated_at", DateTime, "user updated date-time")
		Required("id", "user_id", "title", "design_id")
	})

	largeView := func() {
		Attribute("id")
		Attribute("user_id")
		Attribute("title")
		Attribute("sub_title")
		Attribute("genre")
		Attribute("design_id")
		Attribute("created_at")
		Attribute("updated_at")
	}
	View("default", largeView)
	View("large", largeView)
	View("medium", func() {
		Attribute("id")
		Attribute("user_id")
		Attribute("title")
		Attribute("created_at")
		Attribute("updated_at")
	})
	View("small", func() {
		Attribute("id")
		Attribute("title")
	})
})

var _ = Resource("user_blog", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/userblog")
	DefaultMedia(UserBlogMediaType)
	Security(JWT, func() {
		Scope("api:access")
	})

	Action("list", func() {
		Description("get user blogs")
		Routing(GET(""))
		Params(func() {
			Param("limit", Integer, "number of items per page")
			Param("offset", Integer, "offset number of page")
		})
		Response(OK, func() {
			Media(CollectionOf(UserBlogMediaType, func() {
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
		Description("get the user blog")
		Routing(GET("/:id"))
		Params(func() {
			Param("id", Integer, "id")
		})
		Response(OK, func() { Media(UserBlogMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("create", func() {
		Description("create a user blog")
		Routing(POST(""))
		Payload(UserBlogPayload)
		Response(OK, func() { Media(UserBlogMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("update", func() {
		Description("update the user blog")
		Routing(PUT("/:id"))
		Params(func() {
			Param("id", Integer, "id")
		})
		Payload(UserBlogPayload)
		Response(OK, func() { Media(UserBlogMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("delete", func() {
		Description("delete the user blog")
		Routing(DELETE("/:id"))
		Params(func() {
			Param("id", Integer, "id")
		})
		Response(NoContent)
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})
})

var UserBlogPayload = Type("UserBlogPayload", func() {
	Member("user_id", Integer)
	Member("title", String, func() {})
	Member("sub_title", String, func() {})
	Member("genre", String, func() {})
	Member("design_id", String, func() {
		Example(bridge.BlogDesignSimple)
		Enum(
			bridge.BlogDesignSimple,
			bridge.BlogDesignTile,
			bridge.BlogDesign2Column,
			bridge.BlogDesign3Column,
		)
	})
})

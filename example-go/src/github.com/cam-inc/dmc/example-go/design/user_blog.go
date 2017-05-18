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

	Reference(UserBlogPayload)

	Attributes(func() {
		Attribute("id", Integer, "ユーザーブログID")
		Attribute("user_id", Integer)
		Attribute("title", String)
		Attribute("sub_title", String)
		Attribute("genre", String)
		Attribute("design_id", String)
		Attribute("created_at", DateTime, "作成日時")
		Attribute("updated_at", DateTime, "更新日時")
		Required("id", "user_id", "title", "design_id")
	})

	View("default", func() {
		Attribute("id")
		Attribute("user_id")
		Attribute("title")
		Attribute("sub_title")
		Attribute("genre")
		Attribute("design_id")
		Attribute("created_at")
		Attribute("updated_at")
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
		Routing(GET("", func() {
			Metadata("swagger:extension:x-ref", `["/userblog/{id}"]`)
		}))
		Params(func() {
			Param("limit", Integer, "number of items per page")
			Param("offset", Integer, "offset number of page")
		})
		Response(OK, func() {
			Media(CollectionOf(UserBlogMediaType, func() {
				ContentType("application/json")
				View("default")
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

	Action("autocomplete", func() {
		Description("autocomplete user data")
		Routing(GET("/autocomplete/:field"))
		Params(func() {
			Param("field", String, "field name in userblog model")
			Param("search", String, "search query string")
		})
		Response(OK, "application/json")
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})
})

var UserBlogPayload = Type("UserBlogPayload", func() {
	Member("user_id", Integer, func() {
		Description("ユーザーID")
	})
	Member("title", String, func() {
		Description("タイトル")
		Example("user's blog")
	})
	Member("sub_title", String, func() {
		Description("サブタイトル")
		Example("diary")
	})
	Member("genre", String, func() {
		Description("ジャンル")
		Example("game")
	})
	Member("design_id", String, func() {
		Description("デザインID")
		Example(bridge.BlogDesignSimple)
		Enum(
			bridge.BlogDesignSimple,
			bridge.BlogDesignTile,
			bridge.BlogDesign2Column,
			bridge.BlogDesign3Column,
		)
	})
})

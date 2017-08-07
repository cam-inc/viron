package design

import (
	"encoding/json"

	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// UserBlogEntryMediaType of media type.
var UserBlogEntryMediaType = MediaType("application/vnd.user_blog_entry+json", func() {
	Description("A User Blog Entry")
	ContentType("application/json")

	Reference(UserBlogEntryPayload)

	Attributes(func() {
		Attribute("id", Integer, "ユーザーブログ記事ID")
		Attribute("user_blog_id", Integer)
		Attribute("title", String)
		Attribute("content", String)
		Attribute("theme", String)
		Attribute("created_at", DateTime, "作成日時")
		Attribute("updated_at", DateTime, "更新日時")
		Required("id", "user_blog_id", "title", "content")
	})

	View("default", func() {
		Attribute("id")
		Attribute("user_blog_id")
		Attribute("title")
		Attribute("content")
		Attribute("theme")
		Attribute("created_at")
		Attribute("updated_at")
	})
})

var _ = Resource("user_blog_entry", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/userblogentry")
	DefaultMedia(UserBlogEntryMediaType)
	Security(JWT, func() {
		Scope("api:access")
	})

	Action("list", func() {
		Description("get user blog entries")
		Routing(GET("", func() {
			xref, _ := json.Marshal([]*XRef{
				{
					Path:     "/userblogentry/{id}",
					Method:   "put",
					AppendTo: "row",
				},
				{
					Path:     "/userblogentry/{id}",
					Method:   "delete",
					AppendTo: "row",
				},
			})
			Metadata("swagger:extension:x-ref", string(xref))
		}))
		Params(func() {
			Param("limit", Integer, "number of items per page", func() {
				Metadata("swagger:extension:x-param-for", "pagination_limit")
			})
			Param("offset", Integer, "offset number of page", func() {
				Metadata("swagger:extension:x-param-for", "pagination_offset")
			})
		})
		Response(OK, func() {
			Media(CollectionOf(UserBlogEntryMediaType, func() {
				ContentType("application/json")
				View("default")
			}))
		})
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("show", func() {
		Description("get the user blog entry")
		Routing(GET("/:id"))
		Params(func() {
			Param("id", Integer, "id")
		})
		Response(OK, func() { Media(UserBlogEntryMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("create", func() {
		Description("create a user blog entry")
		Routing(POST(""))
		Payload(UserBlogEntryPayload)
		Response(OK, func() { Media(UserBlogEntryMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("update", func() {
		Description("update the user blog entry")
		Routing(PUT("/:id"))
		Params(func() {
			Param("id", Integer, "id")
		})
		Payload(UserBlogEntryPayload)
		Response(OK, func() { Media(UserBlogEntryMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("delete", func() {
		Description("delete the user blog entry")
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

var UserBlogEntryPayload = Type("UserBlogEntryPayload", func() {
	Member("user_blog_id", Integer, func() {
		Description("ユーザーブログID")
	})
	Member("title", String, func() {
		Description("タイトル")
		Example("今日の日記")
	})
	Member("content", String, func() {
		Description("内容")
	})
	Member("theme", String, func() {
		Description("テーマ")
		Example("diary")
	})
})

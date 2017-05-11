package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// UserBlogEntryMediaType of media type.
var UserBlogEntryMediaType = MediaType("application/vnd.user_blog_entry+json", func() {
	Description("A User Blog Entry")
	ContentType("application/json")

	Attributes(func() {
		Attribute("id", Integer, "user blog id")
		Attribute("user_blog_id", Integer, "user blog id")
		Attribute("title", String, "blog title")
		Attribute("content", String, "blog content")
		Attribute("theme", String, "blog theme")
		Attribute("created_at", DateTime, "user created date-time")
		Attribute("updated_at", DateTime, "user updated date-time")
		Required("id", "user_blog_id", "title", "content")
	})

	largeView := func() {
		Attribute("id")
		Attribute("user_blog_id")
		Attribute("title")
		Attribute("content")
		Attribute("theme")
		Attribute("created_at")
		Attribute("updated_at")
	}
	View("default", largeView)
	View("large", largeView)
	View("medium", func() {
		Attribute("id")
		Attribute("user_blog_id")
		Attribute("title")
		Attribute("created_at")
		Attribute("updated_at")
	})
	View("small", func() {
		Attribute("id")
		Attribute("title")
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
			Metadata("swagger:extension:x-ref", "/userblogentry/{id}")
		}))
		Params(func() {
			Param("limit", Integer, "number of items per page")
			Param("offset", Integer, "offset number of page")
		})
		Response(OK, func() {
			Media(CollectionOf(UserBlogEntryMediaType, func() {
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
	Member("user_blog_id", Integer)
	Member("title", String, func() {})
	Member("content", String, func() {})
	Member("theme", String, func() {})
})

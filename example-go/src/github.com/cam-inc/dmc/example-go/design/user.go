package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// UserMediaType of media type.
var UserMediaType = MediaType("application/vnd.user+json", func() {
	Description("A User")

	Attributes(func() {
		Attribute("id", Integer, "id")
		Attribute("name", String, "user name")
		//Attribute("createdAt", DateTime, "user created date-time")
		//Attribute("updatedAt", DateTime, "user updated date-time")
		Required("id")
		Required("name")
	})

	View("default", func() {
		Attribute("id")
		Attribute("name")
		//Attribute("createdAt")
		//Attribute("updatedAt")
	})
	View("tiny", func() {
		Attribute("id")
		Attribute("name")
	})
})

var _ = Resource("user", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/user")
	DefaultMedia(UserMediaType)

	Action("list", func() {
		Description("get users")
		Routing(GET(""))
		Response(OK, func() {
			Media(CollectionOf(UserMediaType, func() {
				View("default")
				View("tiny")
			}))
		})
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})

	Action("show", func() {
		Description("get the user")
		Routing(GET("/:id"))
		Params(func() {
			Param("id", Integer, "id")
		})
		Response(OK, func() { Media(UserMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})

	Action("create", func() {
		Description("create a user")
		Routing(POST(""))
		Payload(func() {
			Member("name", String)
		})
		Response(OK, func() { Media(UserMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})

	Action("update", func() {
		Description("update the user")
		Routing(PUT("/:id"))
		Params(func() {
			Param("id", Integer, "id")
		})
		Payload(func() {
			Member("name", String)
		})
		Response(OK, func() { Media(UserMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})

	Action("delete", func() {
		Description("delete the user")
		Routing(DELETE("/:id"))
		Params(func() {
			Param("id", Integer, "id")
		})
		Response(NoContent)
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})
})

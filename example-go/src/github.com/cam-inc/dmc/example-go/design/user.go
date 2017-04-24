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
		Attribute("sex", String, "male or female")
		Attribute("birthday", DateTime, "user birthday")
		Attribute("blood_type", String, "blood type")
		Attribute("job", String, "job")
		Attribute("home_town", String, "homeTown")
		Attribute("living_region", String, "living region")
		Attribute("married", Boolean, "is married")
		Attribute("appear_area", String, "appear area")
		Attribute("school", String, "school")
		Attribute("homepage", String, "homepage")
		//Attribute("createdAt", DateTime, "user created date-time")
		//Attribute("updatedAt", DateTime, "user updated date-time")
		Required("id", "name")
	})

	View("default", func() {
		Attribute("id")
		Attribute("name")
		Attribute("sex")
		Attribute("birthday")
		Attribute("blood_type")
		Attribute("job")
		Attribute("home_town")
		Attribute("living_region")
		Attribute("married")
		Attribute("appear_area")
		Attribute("school")
		Attribute("homepage")
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

	// TODO: ログイン画面できるまでは外しておく
	//Security(JWT, func() {
	//	Scope("api:access")
	//})

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
		Payload(UserPayload)
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
		Payload(UserPayload)
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

var UserPayload = Type("UserPayload", func() {
	Member("name", String)
	Member("sex", String, func() {
		Enum("male", "female")
	})
	Member("blood_type", String, func() {
		Enum("A", "B", "O", "AB")
	})
	Member("birthday", DateTime)
	Member("job", String)
	Member("home_town", String)
	Member("living_region", String)
	Member("married", Boolean)
	Member("appear_area", String)
	Member("school", String)
	Member("homepage", String)
})

package design

import (
	"github.com/cam-inc/dmc/example-go/bridge"
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// UserMediaType of media type.
var UserMediaType = MediaType("application/vnd.user+json", func() {
	Description("A User")
	ContentType("application/json")

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
		Attribute("created_at", DateTime, "user created date-time")
		Attribute("updated_at", DateTime, "user updated date-time")
		Required("id", "name")
	})

	largeView := func() {
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
		Attribute("created_at")
		Attribute("updated_at")
	}
	View("default", largeView)
	View("large", largeView)
	View("medium", func() {
		Attribute("id")
		Attribute("name")
		Attribute("created_at")
		Attribute("updated_at")
	})
	View("small", func() {
		Attribute("id")
		Attribute("name")
	})
})

var _ = Resource("user", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/user")
	DefaultMedia(UserMediaType)
	Security(JWT, func() {
		Scope("api:access")
	})

	Metadata("swagger:tag:user#delete")
	Metadata("swagger:tag:user#put")

	Action("list", func() {
		Description("get users")
		Routing(GET(""))
		Params(func() {
			Param("name", String)
		})
		Response(OK, func() {
			Media(CollectionOf(UserMediaType, func() {
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
		Description("get the user")
		Routing(GET("/:id"))
		Params(func() {
			Param("id", Integer, "id")
		})
		Response(OK, func() { Media(UserMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("create", func() {
		Description("create a user")
		Routing(POST(""))
		Payload(UserPayload)
		Response(OK, func() { Media(UserMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
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
		Response(InternalServerError)
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
		Response(InternalServerError)
	})
})

var UserPayload = Type("UserPayload", func() {
	Member("name", String)
	Member("sex", String, func() {
		Enum(
			bridge.UserMale,
			bridge.UserFemale,
		)
	})
	Member("blood_type", String, func() {
		Enum(
			bridge.UserBloodTypeA,
			bridge.UserBloodTypeB,
			bridge.UserBloodTypeO,
			bridge.UserBloodTypeAB,
		)
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

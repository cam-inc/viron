package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// AdminUserMediaType of media type.
var AdminUserMediaType = MediaType("application/vnd.admin_user+json", func() {
	Description("A Admin User")
	ContentType("application/json")

	Attributes(func() {
		Attribute("id", Integer, "unique id")
		Attribute("email", String, "login id")
		Attribute("role_id", String, "role id")

		Required("id", "email")
	})

	View("default", func() {
		Attribute("id")
		Attribute("email")
		Attribute("role_id")
	})
})

var _ = Resource("admin_user", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/adminuser")
	DefaultMedia(AdminUserMediaType)

	Security(JWT, func() {
		Scope("api:access")
	})

	Action("list", func() {
		Description("get admin users")
		Routing(GET("", func() {
			Metadata("swagger:extension:x-ref", `["/adminuser/{id}"]`)
		}))
		Response(OK, func() {
			Media(CollectionOf(AdminUserMediaType, func() {
				ContentType("application/json")
				View("default")
			}))
		})
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("show", func() {
		Description("get the admin user")
		Routing(GET("/:id"))
		Params(func() {
			Param("id", Integer, "id")
		})
		Response(OK, func() { Media(AdminUserMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("create", func() {
		Description("create a admin user")
		Routing(POST(""))
		Payload(func() {
			Member("email", String, func() {
				Description("login user mail address")
				Example("user@sample.com")
			})
			Member("password", String, func() {
				Description("password for email auth")
				Example("XXXXXXXXXXXXXXXX")
			})
			Required("email", "password")
		})
		Response(OK, func() { Media(AdminUserMediaType) })
		Response(NotFound)
		Response(InternalServerError)
		Response(BadRequest, ErrorMedia)
	})

	Action("update", func() {
		Description("update the admin user")
		Routing(PUT("/:id"))
		Params(func() {
			Param("id", Integer, "id")
		})
		Payload(func() {
			Member("password", String, func() {
				Description("password for email auth")
				Example("XXXXXXXXXXXXXXXX")
			})
			Member("role_id", String, func() {
				Description("admin role id")
				Example("viewer")
			})
			Required("role_id")
		})
		Response(OK, func() { Media(AdminUserMediaType) })
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

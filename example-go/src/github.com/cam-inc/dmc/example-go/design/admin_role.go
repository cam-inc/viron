package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// AdminRoleMediaType of media type.
var AdminRoleMediaType = MediaType("application/vnd.admin_role+json", func() {
	Description("A Admin Role")
	ContentType("application/json")

	Attributes(func() {
		Attribute("role_id", String, "role id")
		Attribute("paths", ArrayOf(AdminRolePathType), "target path")
		Required("role_id", "paths")
	})

	largeView := func() {
		Attribute("role_id")
		Attribute("paths")
	}

	View("default", largeView)
	View("large", largeView)
	View("medium", func() {
		Attribute("role_id")
	})
	View("small", func() {
		Attribute("role_id")
	})
})

var _ = Resource("admin_role", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/adminrole")
	DefaultMedia(AdminRoleMediaType)
	Security(JWT, func() {
		Scope("api:access")
	})

	Action("list", func() {
		Description("get admin roles")
		Routing(GET(""))
		Params(func() {
			Param("limit", Integer, "number of items per page")
			Param("offset", Integer, "offset number of page")
		})
		Response(OK, func() {
			Media(CollectionOf(AdminRoleMediaType, func() {
				ContentType("application/json")
				View("large")
				View("medium")
				View("small")
				View("default")
			}))
		})
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})

	Action("show", func() {
		Description("get the admin role")
		Routing(GET("/:role_id"))
		Params(func() {
			Param("role_id", String, "role id")
		})
		Response(OK, func() { Media(AdminRoleMediaType) })
		Response(NotFound)
		Response(InternalServerError)
		Response(BadRequest, ErrorMedia)
	})

	Action("create", func() {
		Description("create a admin role")
		Routing(POST(""))
		Payload(func() {
			Member("role_id", String)
			Member("paths", ArrayOf(AdminRolePathType))
		})
		Response(OK, func() { Media(AdminRoleMediaType) })
		Response(NotFound)
		Response(InternalServerError)
		Response(BadRequest, ErrorMedia)
	})

	Action("update", func() {
		Description("update the admin user")
		Routing(PUT("/:role_id"))
		Params(func() {
			Param("role_id", String, "role id")
		})
		Payload(func() {
			Member("paths", ArrayOf(AdminRolePathType))
		})
		Response(OK, func() { Media(AdminRoleMediaType) })
		Response(NotFound)
		Response(InternalServerError)
		Response(BadRequest, ErrorMedia)
	})

	Action("delete", func() {
		Description("delete the user")
		Routing(DELETE("/:role_id"))
		Params(func() {
			Param("role_id", String, "role id")
		})
		Response(NoContent)
		Response(NotFound)
		Response(InternalServerError)
		Response(BadRequest, ErrorMedia)
	})
})

var AdminRolePathType = Type("adminrolepath", func() {
	Attribute("path", String, "path", func() {
		Example("GET:/user")
	})
	Attribute("allow", Boolean, "allow the path", func() {
		Example(true)
	})
	Required("path", "allow")
})

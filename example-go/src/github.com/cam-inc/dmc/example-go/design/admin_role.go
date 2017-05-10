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
		Attribute("id", Integer, "unique id")
		Attribute("role_id", String, "role id")
		Attribute("method", String, "http method")
		Attribute("resource", String, "resource name")

		Required("id", "role_id")
	})

	largeView := func() {
		Attribute("id")
		Attribute("role_id")
		Attribute("method")
		Attribute("resource")
	}

	View("default", largeView)
	View("large", largeView)
	View("medium", func() {
		Attribute("id")
		Attribute("role_id")
		Attribute("method")
	})
	View("small", func() {
		Attribute("id")
		Attribute("role_id")
	})
})

var _ = Resource("admin_role", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/adminrole")
	DefaultMedia(AdminRoleMediaType)

	// TODO: ログイン画面できるまでは外しておく
	//Security(JWT, func() {
	//	Scope("api:access")
	//})

	Action("list", func() {
		Description("get admin roles")
		Routing(GET(""))
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
		Routing(GET("/:id"))
		Params(func() {
			Param("id", Integer, "id")
		})
		Response(OK, func() { Media(AdminRoleMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})

	Action("create", func() {
		Description("create a admin role")
		Routing(POST(""))
		Payload(func() {
			Member("role_id", String)
			Member("method", String)
			Member("resource", String)
		})
		Response(OK, func() { Media(AdminRoleMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
	})

	Action("update", func() {
		Description("update the admin user")
		Routing(PUT("/:id"))
		Params(func() {
			Param("id", Integer, "id")
		})
		Payload(func() {
			Member("role_id", String)
			Member("method", String)
			Member("resource", String)
		})
		Response(OK, func() { Media(AdminRoleMediaType) })
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

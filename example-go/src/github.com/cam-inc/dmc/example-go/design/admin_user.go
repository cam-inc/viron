package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// AdminUserMediaType of media type.
var AdminUserMediaType = MediaType("application/vnd.admin_user+json", func() {
	Description("A Admin User")

	Attributes(func() {
		Attribute("id", Integer, "unique id")
		Attribute("login_id", String, "login id")
		Attribute("password", String, "password")
		Attribute("role_id", String, "role id")
		Attribute("salt", String, "password salt")

		Required("id", "login_id", "password")
	})

	View("default", func() {
		Attribute("id")
		Attribute("login_id")
		Attribute("role_id")
	})

	View("tiny", func() {
		Attribute("login_id")
		Attribute("role_id")
	})
})

var _ = Resource("admin_user", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/adminuser")
	DefaultMedia(AdminUserMediaType)

	// TODO: ログイン画面できるまでは外しておく
	//Security(JWT, func() {
	//	Scope("api:access")
	//})

	Action("list", func() {
		Description("get admin users")
		Routing(GET(""))
		Response(OK, func() {
			Media(CollectionOf(AdminUserMediaType, func() {
				View("default")
				View("tiny")
			}))
		})
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
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
	})

	Action("create", func() {
		Description("create a admin user")
		Routing(POST(""))
		Payload(func() {
			Member("login_id", String)
			Member("password", String)
		})
		Response(OK, func() { Media(AdminUserMediaType) })
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
			Member("password", String)
			Member("role_id", String)
		})
		Response(OK, func() { Media(AdminUserMediaType) })
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

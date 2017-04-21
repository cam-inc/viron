package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// JWT defines a security scheme using JWT.  The scheme uses the "Authorization" header to lookup
// the token.  It also defines then scope "api".
var JWT = JWTSecurity("jwt", func() {
	Header("Authorization")
	Scope("api:access", "API access") // Define "api:access" scope
})

// BasicAut defines a security scheme using basic authentication. The scheme protects the "signin"
// action used to create JWTs.
//var SigninBasicAuth = BasicAuthSecurity("SigninBasicAuth")

// SecuritySuccessMediaType of media type.
var SecuritySuccessMediaType = MediaType("application/vnd.security.success", func() {
	Description("The common media type to all request responses for this example")
	TypeName("Success")
	Attributes(func() {
		Attribute("ok", Boolean, "Always true")
		Required("ok")
	})
	View("default", func() {
		Attribute("ok")
	})
})

// Resource jwt uses the JWTSecurity security scheme.
var _ = Resource("auth", func() {
	Origin(OriginURL, OriginAllowAll)
	DefaultMedia(SecuritySuccessMediaType)

	Action("signin", func() {
		Description("signin with JWT")
		//Security(SigninBasicAuth)
		Routing(POST("/signin"))
		Payload(func() {
			Member("login_id")
			Member("password")
		})
		Response(NoContent, func() {
			Headers(func() {
				Header("Authorization", String, "Generated JWT")
			})
		})
		Response(Unauthorized)
		Response(NotFound)
	})

	Action("signout", func() {
		Description("signout")
		Routing(POST("/signout"))
		Response(NoContent)
	})
})

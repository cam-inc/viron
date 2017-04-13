package design

import (
	. "github.com/goadesign/goa/design/apidsl"
)

var _ = Resource("swagger", func() {
	Origin(OriginURL, OriginAllowAll)
	// TODO: ログイン画面できるまでは外しておく
	//Security(JWT, func() {
	//	Scope("api:access")
	//})
	Files("/swagger.json", "gen/swagger/swagger.json")
})

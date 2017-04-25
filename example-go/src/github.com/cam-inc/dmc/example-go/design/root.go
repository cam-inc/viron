package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

var _ = Resource("root", func() {
	Origin(OriginURL, OriginAllowAll)

	Action("show", func() {
		Routing(GET("/"))
		Description("get root")
		Response(MovedPermanently)
	})
})

package design

import (
	. "github.com/goadesign/goa/design/apidsl"
)

var _ = Resource("swagger", func() {
	Origin(OriginURL, OriginAllowAll)
	Files("/swagger.json", "public/swagger/swagger.json")
})

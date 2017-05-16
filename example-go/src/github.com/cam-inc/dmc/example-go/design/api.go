package design

import (
	. "github.com/goadesign/goa/design/apidsl"
)

var _ = API("example-go", func() {
	Version("0.0.1")
	Title("The virtual wine example-go")
	Description("A simple goa service")
	Scheme("http", "https")
	Host("localhost:3000")
})

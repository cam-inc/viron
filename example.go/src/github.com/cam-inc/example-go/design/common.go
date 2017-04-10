package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

var OriginURL = "*"
var OriginAllowAll = func() {
	Methods("GET", "OPTIONS", "PUT", "POST", "DELETE") // Allow all origins to retrieve the Swagger JSON (CORS)
}

// Display of enum
var Display = func() {
	Example("Layout of display")
	Default("table")
	Enum("table", "list", "card")
}

// SearchField of enum
var SearchField = func() {
	Example("Field")
	Default("default")
	Enum("default", // definition
		"date",     // yyyy mm dd - yyyy mm dd
		"time",     // hh mm - hh mm
		"datetime", // yyyy mm dd hh mm - yyyy mm dd hh mm
	)
}

// NameType of type
var NameType = Type("name", func() {
	Description("A Name format")
	Attribute("long", String, "Long name", func() {
		Example("Design-based Management Console")
	})
	Attribute("short", String, "Short name", func() {
		Example("DMC")
	})
	Required("short")
})

// SearchType of type
var SearchType = Type("search", func() {
	Description("A Search format")
	Attribute("path", String, "path")
	Attribute("field", String, "field", SearchField)
	Required("path", "field")
})

// ComponentType of type
var ComponentType = Type("component", func() {
	Description("A Component type")
	Attribute("api", String, "Swagger api key", func() {
		Example("post")
	})
	Attribute("operation", String, "Swagger api.operation key", func() {
		Example("post_list")
	})
	Attribute("name", NameType, "Title of page")
	Attribute("display", String, "Layout of display", Display)
	Attribute("url", String, "href of component", func() {
		Example("/#/overview")
	})
	Required("api", "operation", "name", "display")
})

// PageType of type
var PageType = Type("page", func() {
	Description("A page type")
	Attribute("api", String, "Swagger api key", func() {
		Example("post")
	})
	Attribute("operation", String, "Swagger api.operation key", func() {
		Example("post_list")
	})
	Attribute("name", NameType, "Title of page")
	Attribute("primary", String, "recode primary key")
	Attribute("display", String, "Layout of display", Display)
	Attribute("drawer", Boolean, "Displayed in the drawer")
	Attribute("search", ArrayOf(SearchType), "Search of page")
	Required("api", "operation", "name", "primary", "display", "drawer")
})

var PaginationType = Type("pagination", func() {
	Description("A Pagination definition")
	Attribute("X-Pagination-Total", Integer, func() {
		Minimum(0)
	})
	Attribute("X-Pagination-Page", Integer, func() {
		Minimum(0)
	})
	Attribute("X-Pagination-Limit", Integer, func() {
		Minimum(1)
	})
	Attribute("X-Pagination-Next", String)
	Attribute("X-Pagination-Prev", String)
})

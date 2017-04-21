package design

import (
	"github.com/cam-inc/dmc/example-go/bridge"
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// OriginURL response header
var OriginURL = "*"

// OriginAllowAll response header
var OriginAllowAll = func() {
	Methods("GET", "OPTIONS", "PUT", "POST", "DELETE") // Allow all origins to retrieve the Swagger JSON (CORS)
}

// Layout of enum
// 表示レイアウト
var Layout = func() {
	Example("Layout of display")
	Default(bridge.LayoutTable)
	Enum(
		bridge.LayoutTable,
		bridge.LayoutCard,
	)
}

// Style of enum
var Style = func() {
	Example("Style of Web Component")
	Default(bridge.StyleNumber)
	Enum(
		bridge.StyleNumber,
		bridge.StyleList,
		bridge.StyleTable,
	)
}

// PageSection of enum
// ページのセクジョン
var PageSection = func() {
	Example("Section of page")
	Default(bridge.SectionManage)
	Enum(
		bridge.SectionManage,
		bridge.SectionDashboard,
	)
}

// PageGroup of enum
// ページのグループ
var PageGroup = func() {
	Example("Group of page")
	Enum(
		bridge.GroupEmpty,
		bridge.GroupKPI,
		bridge.GroupUser,
		bridge.GroupBlog,
		bridge.GroupAdmin,
	)
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

//// NameType of type
//var NameType = Type("name", func() {
//	Description("A Name format")
//	Attribute("long", String, "Long name", func() {
//		Example("Design-based Management Console")
//	})
//	Attribute("short", String, "Short name", func() {
//		Example("DMC")
//	})
//	Required("short")
//})

// SearchType of type
var SearchType = Type("search", func() {
	Description("A Search format")
	Attribute("path", String, "path")
	Attribute("field", String, "field", SearchField)
	Required("path", "field")
})

// APIType of type
// クライアントが使用する、アクセス情報
var APIType = Type("api", func() {
	Description("Accessing api information type")
	Attribute("id", String, "Access apis[id] of swagger.json", func() {
		Example("user")
	})
	Attribute("operation", String, "Access api[id].operation of swagger.json", func() {
		Example("user#list")
	})
	Required("id", "operation")
})

// OptionType of type
var OptionType = Type("option", func() {
	Attribute("key", String, "Key", func() {
		Example("key")
	})
	Attribute("value", String, "Value", func() {
		Example("value")
	})
	Required("key", "value")
})

// ComponentType of type
var ComponentType = Type("component", func() {
	Description("A Component type")
	Attribute("api", APIType, "Access api of page")
	Attribute("name", String, "Title of page")
	Attribute("style", Style)                                  // Web Component style
	Attribute("options", ArrayOf(OptionType), "style options") // Web Component Style options
	Required("api", "name", "style")
})

// PageType of type
var PageType = Type("page", func() {
	Description("A page type")
	Attribute("api", APIType, "Access api of page")
	Attribute("name", String, "Title of page")
	Attribute("section", PageSection)
	Attribute("group", PageGroup)
	Attribute("primary", String, "recode primary key")      // TODO 主キー
	Attribute("layout", Layout)                             // ページの表示スタイル
	Attribute("drawer", Boolean, "Displayed in the drawer") // Drowerに表示するか
	//Attribute("search", ArrayOf(SearchType), "Search of page") // 検索があるか
	Required("api", "name", "section", "group", "primary", "layout", "drawer")
})

// PaginationType of type
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

package design

import (
	"encoding/json"

	"github.com/cam-inc/dmc/example-go/bridge"
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

// UserMediaType of media type.
var UserMediaType = MediaType("application/vnd.user+json", func() {
	Description("A User")
	ContentType("application/json")

	Reference(UserPayload)

	Attributes(func() {
		Attribute("id", Integer, "ユーザーID")
		Attribute("name", String)
		Attribute("sex", String)
		Attribute("birthday", DateTime)
		Attribute("blood_type", String)
		Attribute("job", String)
		Attribute("home_town", String)
		Attribute("living_region", String)
		Attribute("married", Boolean)
		Attribute("appear_area", String)
		Attribute("school", String)
		Attribute("homepage", String)
		Attribute("created_at", DateTime, "作成日時")
		Attribute("updated_at", DateTime, "更新日時")
		Required("id", "name")
	})

	View("default", func() {
		Attribute("id")
		Attribute("name")
		Attribute("sex")
		Attribute("birthday")
		Attribute("blood_type")
		Attribute("job")
		Attribute("home_town")
		Attribute("living_region")
		Attribute("married")
		Attribute("appear_area")
		Attribute("school")
		Attribute("homepage")
		Attribute("created_at")
		Attribute("updated_at")
	})
})

var _ = Resource("user", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/user")
	DefaultMedia(UserMediaType)
	Security(JWT, func() {
		Scope("api:access")
	})

	Action("list", func() {
		Description("get users")
		Routing(GET("", func() {
			xref, _ := json.Marshal([]*XRef{
				{
					Path:     "/user/{id}",
					Method:   "put",
					AppendTo: "row",
				},
				{
					Path:     "/user/{id}",
					Method:   "delete",
					AppendTo: "row",
				},
			})
			Metadata("swagger:extension:x-ref", string(xref))
		}))
		Params(func() {
			Param("name", String)
			Param("limit", Integer, "number of items per page", func() {
				Metadata("swagger:extension:x-param-for", "pagination_limit")
			})
			Param("offset", Integer, "offset number of page", func() {
				Metadata("swagger:extension:x-param-for", "pagination_offset")
			})
		})
		Response(OK, func() {
			Media(CollectionOf(UserMediaType, func() {
				ContentType("application/json")
				View("default")
			}))
		})
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("show", func() {
		Description("get the user")
		Routing(GET("/:id"))
		Params(func() {
			Param("id", Integer, "id")
		})
		Response(OK, func() { Media(UserMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("create", func() {
		Description("create a user")
		Routing(POST(""))
		Payload(UserPayload)
		Response(OK, func() { Media(UserMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("update", func() {
		Description("update the user")
		Routing(PUT("/:id"))
		Params(func() {
			Param("id", Integer, "id")
		})
		Payload(UserPayload)
		Response(OK, func() { Media(UserMediaType) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
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
		Response(InternalServerError)
	})
})

var UserPayload = Type("UserPayload", func() {
	Member("name", String, func() {
		Description("名前")
		Example("山田 太郎")
	})
	Member("sex", String, func() {
		Description("性別")
		Example(bridge.UserMale)
		Enum(
			bridge.UserMale,
			bridge.UserFemale,
		)
	})
	Member("blood_type", String, func() {
		Description("血液型")
		Example(bridge.UserBloodTypeA)
		Enum(
			bridge.UserBloodTypeA,
			bridge.UserBloodTypeB,
			bridge.UserBloodTypeO,
			bridge.UserBloodTypeAB,
		)
	})
	Member("birthday", DateTime, func() {
		Description("誕生日")
		Example("1995-05-12T09:45:56Z")
	})
	Member("job", String, func() {
		Description("職業")
		Example("大学生")
	})
	Member("home_town", String, func() {
		Description("出身地")
		Example("静岡県")
	})
	Member("living_region", String, func() {
		Description("地域")
		Example("渋谷")
	})
	Member("married", Boolean, func() {
		Description("未既婚")
		Example(false)
	})
	Member("appear_area", String, func() {
		Description("出没地")
		Example("東京")
	})
	Member("school", String, func() {
		Description("出身校")
		Example("東京○○大学")
	})
	Member("homepage", String, func() {
		Description("ホームページURL")
		Example("http://test.com/index.html")
	})

	Required("name")
})

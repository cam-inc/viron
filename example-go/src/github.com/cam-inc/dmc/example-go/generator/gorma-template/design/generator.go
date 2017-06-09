package gorma_template

import (
	"text/template"
	"fmt"
	"strings"
	"bytes"
	"github.com/goadesign/gorma"
	"github.com/goadesign/goa/design"
	"github.com/goadesign/goa/goagen/utils"
)

// Generator is the application code generator.
type Generator struct {
	genfiles   []string // Generated files
}

// Generate is the generator entry point called by the meta generator.
func Generate() (files []string, err error) {

	g := &Generator{}

	return g.Generate(design.Design)
}

// Generate the application code, implement codegen.Generator.
func (g *Generator) Generate(api *design.APIDefinition) (_ []string, err error) {
	if api == nil {
		return nil, fmt.Errorf("missing API definition, make sure design.Design is properly initialized")
	}
	go utils.Catch(nil, func() { g.Cleanup() })
	defer func() {
		if err != nil {
			g.Cleanup()
		}
	}()

	if err := g.generateDesignTemplate(api); err != nil {
		return g.genfiles, err
	}

	return g.genfiles, nil
}

// Cleanup removes the entire "app" directory if it was created by this generator.
func (g *Generator) Cleanup() {
	if len(g.genfiles) == 0 {
		return
	}
	//os.RemoveAll(ModelOutputDir())
	g.genfiles = nil
}

func (g *Generator) generateDesignTemplate(api *design.APIDefinition) error {
	str := ""
	var models []string

	modelTmpl := `
package design

import (
	. "github.com/goadesign/goa/design"
	. "github.com/goadesign/goa/design/apidsl"
)

var {{.mediaType}} = MediaType("application/vnd.{{.tableName}}+json", func() {
	Description("")
	ContentType("application/json")

	Reference({{.payload}})

	Attributes(func() {
{{.attribute}}
		// add your required columns
		Required("{{.primaryKeyName}}")
	})

	View("default", func() {
{{.view}}
	})
})

var _ = Resource("{{.tableName}}", func() {
	Origin(OriginURL, OriginAllowAll)
	BasePath("/{{.tableName}}")
	DefaultMedia({{.mediaType}})
	Security(JWT, func() {
		Scope("api:access")
	})


	Action("list", func() {
		Description("get {{.tableName}}")
		Routing(GET("", func() {
			Metadata("swagger:extension:x-ref", "[\"/{{.tableName}}/{{.primaryKeyName}}\"]")
		}))
		Response(OK, func() {
			Media(CollectionOf({{.mediaType}}, func() {
				ContentType("application/json")
				View("default")
			}))
		})
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("show", func() {
		Description("get the {{.tableName}}")
		Routing(GET("/:{{.primaryKeyName}}"))
		Params(func() {
			Param("{{.primaryKeyName}}", {{.primaryKeyType}}, "{{.primaryKeyName}}")
		})
		Response(OK, func() { Media({{.mediaType}}) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("create", func() {
		Description("create a {{.tableName}}")
		Routing(POST(""))
		Payload({{.payload}})
		Response(OK, func() { Media({{.mediaType}}) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("update", func() {
		Description("update the {{.tableName}}")
		Routing(PUT("/:{{.primaryKeyName}}"))
		Params(func() {
			Param("{{.primaryKeyName}}", {{.primaryKeyType}}, "{{.primaryKeyName}}")
		})
		Payload({{.payload}})
		Response(OK, func() { Media({{.mediaType}}) })
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})

	Action("delete", func() {
		Description("delete the {{.tableName}}")
		Routing(DELETE("/:{{.primaryKeyName}}"))
		Params(func() {
			Param("{{.primaryKeyName}}", {{.primaryKeyType}}, "{{.primaryKeyName}}")
		})
		Response(NoContent)
		Response(NotFound)
		Response(BadRequest, ErrorMedia)
		Response(InternalServerError)
	})
})

var {{.payload}} = Type("{{.payload}}", func() {
{{.member}}
		//add user required member
})
`
	attributeTmpl := `		Attribute("{{.fieldName}}", {{.fieldType}})`
	type T struct{ Name string }
	memberTmpl := `	Member("{{.fieldName}}", {{.fieldType}}, func() {
		Description("")
		Example("")
	})`

	t := template.New("t")
	template.Must(t.Parse(modelTmpl))

	at := template.New("at")
	template.Must(at.Parse(attributeTmpl))

	m := template.New("m")
	template.Must(m.Parse(memberTmpl))

	err := gorma.GormaDesign.IterateStores(func(store *gorma.RelationalStoreDefinition) error {
		err := store.IterateModels(func(model *gorma.RelationalModelDefinition) error {

			var views []string
			var attributes []string
			var members []string
			primaryKey := map[string]string{}
			_ = model.IterateFields(func(field *gorma.RelationalFieldDefinition) error {

				// attribute
				adest := new(bytes.Buffer)
				at.Execute(adest, map[string]string{
					"fieldName": field.DatabaseFieldName,
					"fieldType": GormaTypeToDesignType(field),
				})
				attributes = append(attributes, adest.String())

				// member
				mdest := new(bytes.Buffer)
				m.Execute(mdest, map[string]string{
					"fieldName": field.DatabaseFieldName,
					"fieldType": GormaTypeToDesignType(field),
				})
				members = append(members, mdest.String())

				// view
				views = append(views, `		Attribute("`+ field.DatabaseFieldName +`")`)

				// primary key
				if field.PrimaryKey {
					primaryKey["name"] = field.DatabaseFieldName
					primaryKey["type"] = GormaTypeToDesignType(field)
				}
				return nil
			})

			var tableNameList []string
			tableNameSprit := strings.Split(model.TableName(), "")
			for i := 0; i<len(tableNameSprit)-1; i++ {
				tableNameList = append(tableNameList, tableNameSprit[i])
			}
			tableNameJoin := strings.Join(tableNameList, "")

			dest := new(bytes.Buffer)
			t.Execute(dest, map[string]string{
				"mediaType":      model.ModelName + "MediaType",
				"tableName":      tableNameJoin,
				"payload":        model.ModelName + "Payload",
				"attribute":      strings.Join(attributes, "\n"),
				"view":           strings.Join(views, "\n"),
				"primaryKeyName": primaryKey["name"],
				"primaryKeyType": primaryKey["type"],
				"member":         strings.Join(members, "\n"),
			})
			models = append(models, dest.String())
			return nil
		})
		return err
	})

	if err != nil {
		return err
	}

	str = str + strings.Join(models, "\n")
	fmt.Println(str)
	return nil
}

func GormaTypeToDesignType(field *gorma.RelationalFieldDefinition) (datatype string) {

	switch field.Datatype {
	case gorma.Boolean:
		return "Boolean"
	case gorma.Integer:
		return "Integer"
	case gorma.String:
		return "String"
	case gorma.Timestamp:
		return "DateTime"
	case gorma.NullableTimestamp:
		return "DateTime"
	default:
		return ""
	}
}

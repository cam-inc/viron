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
	if err := g.generateControllerCreateTemplate(api); err != nil {
		return g.genfiles, err
	}
	if err := g.generateControllerDeleteTemplate(api); err != nil {
		return g.genfiles, err
	}
	if err := g.generateControllerListTemplate(api); err != nil {
		return g.genfiles, err
	}
	if err := g.generateControllerShowTemplate(api); err != nil {
		return g.genfiles, err
	}
	if err := g.generateControllerUpdateTemplate(api); err != nil {
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

func (g *Generator) generateControllerCreateTemplate(api *design.APIDefinition) error {

	str := "------ create action\n\n"
	var models []string

	modelTmpl := `
	{{.tableName}} := models.{{.newDbName}}(models.DB)
	m := genModels.{{.modelName}}{}
	{{.fieldData}}

	if err := {{.tableName}}.Add(ctx.Context, &m); err != nil {
		return ctx.InternalServerError()
	}
	`

	models, err := generateTemplate(modelTmpl)
	if err != nil {
		return err
	}

	str = str + strings.Join(models, "\n")
	fmt.Println(str)
	return nil
}

func (g *Generator) generateControllerDeleteTemplate(api *design.APIDefinition) error {

	str := "------ delete action\n\n"
	var models []string

	modelTmpl := `
	{{.tableName}} := models.{{.newDbName}}(models.DB)
	if err := {{.tableName}}.Delete(ctx.Context, ctx.ID); err != nil {
		return ctx.InternalServerError()
	}
	`

	models, err := generateTemplate(modelTmpl)
	if err != nil {
		return err
	}

	str = str + strings.Join(models, "\n")
	fmt.Println(str)
	return nil
}

func (g *Generator) generateControllerListTemplate(api *design.APIDefinition) error {

	str := "------ list action\n\n"
	var models []string

	modelTmpl := `
	{{.tableName}} := models.{{.newDbName}}(models.DB)
	list := {{.tableName}}.List{{.modelName}}(ctx.Context, ctx.Params)
	`

	models, err := generateTemplate(modelTmpl)
	if err != nil {
		return err
	}

	str = str + strings.Join(models, "\n")
	fmt.Println(str)
	return nil
}

func (g *Generator) generateControllerShowTemplate(api *design.APIDefinition) error {

	str := "------ show action\n\n"
	var models []string

	modelTmpl := `
	{{.tableName}} := models.{{.newDbName}}(models.DB)
	if m, err := {{.tableName}}.One{{.modelName}}(ctx.Context, ctx.ID); err == gorm.ErrRecordNotFound {
		return ctx.NotFound()
	} else if err != nil {
		return ctx.InternalServerError()
	}
	`

	models, err := generateTemplate(modelTmpl)
	if err != nil {
		return err
	}

	str = str + strings.Join(models, "\n")
	fmt.Println(str)
	return nil
}

func (g *Generator) generateControllerUpdateTemplate(api *design.APIDefinition) error {

	str := "------ update action\n\n"

	modelTmpl := `
	{{.tableName}} := models.{{.newDbName}}(models.DB)
	if m, err := {{.tableName}}.Get(ctx.Context, ctx.ID); err == gorm.ErrRecordNotFound {
		return ctx.NotFound()
	} else if err != nil {
		return ctx.InternalServerError()
	} else {
{{.fieldData}}

		if err = {{.tableName}}.Update(ctx.Context, m); err != nil {
			return ctx.InternalServerError()
		}
	}
	`
	models, err := generateTemplate(modelTmpl)
	if err != nil {
		return err
	}

	str = str + strings.Join(models, "\n")
	fmt.Println(str)
	return nil
}

func generateTemplate(modelTmpl string) ([]string, error) {

	var models []string

	t := template.New("t")
	template.Must(t.Parse(modelTmpl))

	err := gorma.GormaDesign.IterateStores(func(store *gorma.RelationalStoreDefinition) error {
		err := store.IterateModels(func(model *gorma.RelationalModelDefinition) error {

			var fieldData []string
			_ = model.IterateFields(func(field *gorma.RelationalFieldDefinition) error {

				if field.PrimaryKey {
					return nil
				}

				fieldName := field.DatabaseFieldName
				if fieldName == "created_at" || fieldName == "updated_at" || fieldName == "deleted_at" {
					return nil
				}

				var fieldNamelist []string
				for _, value := range strings.Split(fieldName, "_") {
					fieldNamelist = append(fieldNamelist, strings.Title(value))
				}
				fieldNameJoin := strings.Join(fieldNamelist, "")

				fieldData = append(fieldData, `		m.`+ fieldNameJoin +`= *ctx.Payload.` + fieldNameJoin)

				return nil
			})

			modelName := strings.Split(model.ModelName, "")
			modelName[0] = strings.ToLower(modelName[0])
			modelNameJoin := strings.Join(modelName, "")

			dest := new(bytes.Buffer)
			t.Execute(dest, map[string]string{
				"tableName": modelNameJoin + "Table",
				"newDbName": "New" + model.ModelName + "DB" ,
				"fieldData": strings.Join(fieldData, "\n"),
				"modelName": model.ModelName,
			})
			models = append(models, dest.String())
			return nil
		})
		return err
	})

	if err != nil {
		return nil, err
	}

	return models, nil
}

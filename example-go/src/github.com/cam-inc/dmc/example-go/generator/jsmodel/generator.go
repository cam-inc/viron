package jsmodel

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"text/template"

	"strings"

	"io/ioutil"

	"github.com/goadesign/goa/design"
	"github.com/goadesign/goa/goagen/codegen"
	"github.com/goadesign/goa/goagen/utils"
	"github.com/goadesign/gorma"
)

// Generator is the application code generator.
type Generator struct {
	genfiles   []string // Generated files
	outDir     string   // Absolute path to output directory
	target     string   // Target package name - "js" by default
	appPkg     string   // Generated goa app package name - "app" by default
	appPkgPath string   // Generated goa app package import path
}

// Generate is the generator entry point called by the meta generator.
func Generate() (files []string, err error) {
	var outDir, target, appPkg, ver string

	set := flag.NewFlagSet("jsmodel", flag.PanicOnError)
	set.String("design", "", "")
	set.StringVar(&outDir, "out", "", "")
	set.StringVar(&ver, "version", "", "")
	set.StringVar(&target, "pkg", "js", "")
	set.StringVar(&appPkg, "app", "app", "")
	set.Parse(os.Args[2:])

	// First check compatibility
	if err := codegen.CheckVersion(ver); err != nil {
		return nil, err
	}

	// Now proceed
	appPkgPath, err := codegen.PackagePath(filepath.Join(outDir, appPkg))
	if err != nil {
		return nil, fmt.Errorf("invalid app package: %s", err)
	}
	outDir = filepath.Join(outDir, target)
	g := &Generator{outDir: outDir, target: target, appPkg: appPkg, appPkgPath: appPkgPath}

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
	if err := os.MkdirAll(g.outDir, 0755); err != nil {
		return nil, err
	}

	if err := g.generateJsModels(g.outDir, api); err != nil {
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

func (g *Generator) generateJsModels(outdir string, api *design.APIDefinition) error {
	str := "var models = {};\n\n"
	var models []string

	modelTmpl := `models.{{.modelName}} = {
  name: '{{.tableName}}',
  fields: {
{{.fields}}
  },
};
`
	type Field struct {
		DataType   string `json:"data_type"`
		Nullable   bool   `json:"nullable"`
		PrimaryKey bool   `json:"primary_key"`
		Size       int    `json:"size"`
		SQLTag     string `json:"sql_tag"`
	}

	t := template.New("t")
	template.Must(t.Parse(modelTmpl))
	err := gorma.GormaDesign.IterateStores(func(store *gorma.RelationalStoreDefinition) error {
		err := store.IterateModels(func(model *gorma.RelationalModelDefinition) error {
			var fields []string
			_ = model.IterateFields(func(field *gorma.RelationalFieldDefinition) error {
				f := Field{
					DataType:   string(field.Datatype),
					Nullable:   field.Nullable,
					PrimaryKey: field.PrimaryKey,
					Size:       field.Size,
					SQLTag:     field.SQLTag,
				}
				jsonStr, _ := json.Marshal(f)
				fields = append(fields, "    "+field.DatabaseFieldName+": "+string(jsonStr)+",")
				return nil
			})

			dest := new(bytes.Buffer)
			t.Execute(dest, map[string]string{
				"modelName": model.ModelName,
				"tableName": model.TableName(),
				"fields":    strings.Join(fields, "\n"),
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
	str = str + `
module.exports.default = models;
module.exports.models = models;`

	out := filepath.Join(outdir, "models.js")
	if err := os.RemoveAll(out); err != nil {
		fmt.Println(err)
	}
	ioutil.WriteFile(out, []byte(str), 0644)
	fmt.Println(out)
	return nil
}

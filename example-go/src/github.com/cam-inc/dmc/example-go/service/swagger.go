package service

import (
	_ "github.com/cam-inc/dmc/example-go/design"
	"github.com/goadesign/goa/design"
	"github.com/goadesign/goa/goagen/codegen"
	"github.com/goadesign/goa/goagen/gen_swagger"
)

var swagger *genswagger.Swagger

func init() {
	codegen.ParseDSL()
	if sw, err := genswagger.New(design.Design); err != nil {
		panic(err)
	} else {
		swagger = sw
	}
}

func GetSwagger() *genswagger.Swagger {
	return swagger
}

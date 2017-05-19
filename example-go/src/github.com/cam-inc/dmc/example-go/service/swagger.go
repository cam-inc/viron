package service

import (
	_ "github.com/cam-inc/dmc/example-go/design"
	"github.com/goadesign/goa/design"
	"github.com/goadesign/goa/goagen/codegen"
	"github.com/goadesign/goa/goagen/gen_swagger"
)

var swagger *genswagger.Swagger
var whiteList []string

func init() {
	codegen.ParseDSL()
	if sw, err := genswagger.New(design.Design); err != nil {
		panic(err)
	} else {
		swagger = sw
	}
	whiteList = []string{
		"dmc",
		"swagger.json",
		"dmc_authtype",
		"signin",
		"signout",
		"googlesignin",
		"googleoauth2callback",
	}
}

func GetSwagger() *genswagger.Swagger {
	return swagger
}

func GetApiWhiteList() []string {
	return whiteList
}

package helpers

import (
	"strings"

	"github.com/getkin/kin-openapi/openapi3"
)

func ref(r string, org string, rep string) string {
	if strings.Contains(r, org) {
		return strings.Replace(r, org, rep, -1)
	}
	return r
}

func opeRef(ope *openapi3.Operation, org string, rep string) error {
	if ope.OperationID != "" {
		first := ope.OperationID[:1]
		lower := strings.ToLower(first)
		ope.OperationID = strings.Replace(ope.OperationID, first, lower, 1)
	}
	if ope.RequestBody != nil {
		ope.RequestBody.Ref = ref(ope.RequestBody.Ref, org, rep)
	}
	for _, r := range ope.Responses {
		r.Ref = ref(r.Ref, org, rep)
	}
	for _, p := range ope.Parameters {
		p.Ref = ref(p.Ref, org, rep)
	}
	return nil
}

func Ref(docRoot *openapi3.T, org string, rep string) error {

	// paths
	for _, pathItem := range docRoot.Paths {
		pathItem.Ref = ref(pathItem.Ref, org, rep)
		if pathItem.Get != nil {
			if err := opeRef(pathItem.Get, org, rep); err != nil {
				return err
			}
		}
		if pathItem.Post != nil {
			if err := opeRef(pathItem.Post, org, rep); err != nil {
				return err
			}
		}
		if pathItem.Put != nil {
			if err := opeRef(pathItem.Put, org, rep); err != nil {
				return err
			}
		}
		if pathItem.Delete != nil {
			if err := opeRef(pathItem.Delete, org, rep); err != nil {
				return err
			}
		}
	}

	// components
	for _, param := range docRoot.Components.Parameters {
		param.Ref = ref(param.Ref, org, rep)
	}
	for _, schema := range docRoot.Components.Schemas {
		schema.Ref = ref(schema.Ref, org, rep)
		if schema.Value != nil {

			for _, oo := range schema.Value.OneOf {
				oo.Ref = ref(oo.Ref, org, rep)
			}
			for _, ao := range schema.Value.AllOf {
				ao.Ref = ref(ao.Ref, org, rep)
			}
			for _, any := range schema.Value.AnyOf {
				any.Ref = ref(any.Ref, org, rep)
			}
		}
	}
	for _, response := range docRoot.Components.Responses {
		response.Ref = ref(response.Ref, org, rep)
	}
	for _, link := range docRoot.Components.Links {
		link.Ref = ref(link.Ref, org, rep)
	}
	return nil
}

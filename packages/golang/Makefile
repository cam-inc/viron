.PHONY: codegen
codegen:
	$$GOPATH/bin/oapi-codegen -generate "types,skip-prune,spec" -package components -o ./routes/components/components.gen.go ./openapi/origin/components.yaml
	$$GOPATH/bin/oapi-codegen -import-mapping ./components.yaml:github.com/cam-inc/viron/packages/golang/routes/components -generate "types,chi-server,spec" -package oas -o ./routes/oas/oas.gen.go ./openapi/origin/oas.yaml
	$$GOPATH/bin/oapi-codegen -import-mapping ./components.yaml:github.com/cam-inc/viron/packages/golang/routes/components -generate "types,chi-server,spec" -package auth -o ./routes/auth/auth.gen.go ./openapi/origin/auth.yaml
	$$GOPATH/bin/oapi-codegen -import-mapping ./components.yaml:github.com/cam-inc/viron/packages/golang/routes/components -generate "types,chi-server,spec" -package adminusers -o ./routes/adminusers/adminusers.gen.go ./openapi/origin/adminusers.yaml
	$$GOPATH/bin/oapi-codegen -import-mapping ./components.yaml:github.com/cam-inc/viron/packages/golang/routes/components,./adminusers.yaml:github.com/cam-inc/viron/packages/golang/routes/adminusers -generate "types,chi-server,spec" -package adminaccounts -o ./routes/adminaccounts/adminaccounts.gen.go ./openapi/origin/adminaccounts.yaml
	$$GOPATH/bin/oapi-codegen -import-mapping ./components.yaml:github.com/cam-inc/viron/packages/golang/routes/components -generate "types,chi-server,spec" -package adminroles -o ./routes/adminroles/adminroles.gen.go ./openapi/origin/adminroles.yaml
	$$GOPATH/bin/oapi-codegen -import-mapping ./components.yaml:github.com/cam-inc/viron/packages/golang/routes/components -generate "types,chi-server,spec" -package authconfigs -o ./routes/authconfigs/authconfigs.gen.go ./openapi/origin/authconfigs.yaml
	$$GOPATH/bin/oapi-codegen -import-mapping ./components.yaml:github.com/cam-inc/viron/packages/golang/routes/components -generate "types,chi-server,spec" -package auditlogs -o ./routes/auditlogs/auditlogs.gen.go ./openapi/origin/auditlogs.yaml

.PHONY: codegen
codegen:
	# Generate server code
	# https://github.com/deepmap/oapi-codegen
	$$GOPATH/bin/oapi-codegen -generate "types,skip-prune,spec" -package components -o ../routes/components/components.gen.go ./origin/components.yaml
	$$GOPATH/bin/oapi-codegen -import-mapping ./components.yaml:github.com/cam-inc/viron/packages/golang/routes/components -generate "types,chi-server,spec" -package oas -o ../routes/oas/oas.gen.go ./origin/oas.yaml
	$$GOPATH/bin/oapi-codegen -import-mapping ./components.yaml:github.com/cam-inc/viron/packages/golang/routes/components -generate "types,chi-server,spec" -package auth -o ../routes/auth/auth.gen.go ./origin/auth.yaml
	$$GOPATH/bin/oapi-codegen -import-mapping ./components.yaml:github.com/cam-inc/viron/packages/golang/routes/components -generate "types,chi-server,spec" -package adminusers -o ../routes/adminusers/adminusers.gen.go ./origin/adminusers.yaml
	$$GOPATH/bin/oapi-codegen -import-mapping ./components.yaml:github.com/cam-inc/viron/packages/golang/routes/components,./adminusers.yaml:github.com/cam-inc/viron/packages/golang/routes/adminusers -generate "types,chi-server,spec" -package adminaccounts -o ../routes/adminaccounts/adminaccounts.gen.go ./origin/adminaccounts.yaml
	$$GOPATH/bin/oapi-codegen -import-mapping ./components.yaml:github.com/cam-inc/viron/packages/golang/routes/components -generate "types,chi-server,spec" -package adminroles -o ../routes/adminroles/adminroles.gen.go ./origin/adminroles.yaml
	$$GOPATH/bin/oapi-codegen -import-mapping ./components.yaml:github.com/cam-inc/viron/packages/golang/routes/components -generate "types,chi-server,spec" -package authconfigs -o ../routes/authconfigs/authconfigs.gen.go ./origin/authconfigs.yaml
	$$GOPATH/bin/oapi-codegen -import-mapping ./components.yaml:github.com/cam-inc/viron/packages/golang/routes/components -generate "types,chi-server,spec" -package auditlogs -o ../routes/auditlogs/auditlogs.gen.go ./origin/auditlogs.yaml

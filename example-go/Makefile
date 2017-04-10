__PWD=$(shell pwd)
__NOW=$(shell date +%Y%m%d%H%M%S)
__OS_NAME=$(shell uname -s)
__BIN=bin
__SRC=src
__PKG=pkg
__DIST=dist/$(__OS_NAME)
__REALIZE=$(__BIN)/realize
__GOAGEN=$(__BIN)/goagen

__GITHUB=github.com
__ORGS=cam-inc
__NAME=dmc
__PROJECT=$(__NAME)/example-go
__DESIGN=design
__PUBLIC=public
__MODEL=model
__CONTROLLER=controller
__GEN=gen

__PROG=$(__DIST)/$(__NAME)
__PATH=$(__BIN):$$PATH
__GOPATH=$(__PWD)
__VENDOR_SHELL=$(__PWD)/vendor

__SRC_GITHUB_DIR=$(__SRC)/$(__GITHUB)
__SRC_ORGS_DIR=$(__SRC_GITHUB_DIR)/$(__ORGS)

__PKG_PROJECT_HOME=$(__GITHUB)/$(__ORGS)/$(__PROJECT)
__SRC_PROJECT_DIR=$(__SRC)/$(__PKG_PROJECT_HOME)

__PKG_PROJECT_DESIGN=$(__PKG_PROJECT_HOME)/$(__DESIGN)
__SRC_PROJECT_DESIGN=$(__SRC)/$(__PKG_PROJECT_DESIGN)

__PKG_PROJECT_CONTROLLER=$(__PKG_PROJECT_HOME)/$(__CONTROLLER)
__SRC_PROJECT_CONTROLLER=$(__SRC)/$(__PKG_PROJECT_CONTROLLER)

__PKG_PROJECT_GEN=$(__PKG_PROJECT_HOME)/$(__GEN)
__SRC_PROJECT_GEN=$(__SRC)/$(__PKG_PROJECT_GEN)

__PKG_PROJECT_MODEL=$(__PKG_PROJECT_HOME)/$(__MODEL)
__SRC_PROJECT_MODEL=$(__SRC)/$(__PKG_PROJECT_MODEL)

TARGET=$(target)

all:
	@echo 'README.md :)'

clean:
	rm -rf $(__BIN)
	rm -rf $(__PKG)
	rm -rf $(__DIST)
	$(__VENDOR_SHELL) uninstall

deps:
	$(__VENDOR_SHELL) install

realize:
	GOPATH=${__GOPATH} $(__REALIZE) list
	GOPATH=${__GOPATH} $(__REALIZE) run

start:
	@#GOPATH=${__GOPATH} go run  $(__SRC_PROJECT_DIR)/*.go
	cd $(__SRC_PROJECT_DIR); \
		GOPATH=${__GOPATH} go run *.go

build: deps gen
	mkdir -p $(__DIST)
	GOPATH=${__GOPATH} go build -o $(__DIST)/$(__PROJECT) $(__PKG_PROJECT_HOME)
	GOPATH=${__GOPATH} go build -o $(__DIST)/$(__PROJECT)-cli $(__PKG_PROJECT_GEN)/tool/example-go-cli

test:
	@echo "test"

bench:
	@echo "bench"

gen: gen-app gen-client gen-swagger gen-schema gen-js gen-model ## Generate goa all (ignore: gen-main)
	@#GOPATH=$(__GOPATH) ./bin/goagen bootstrap -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_DIR)

# Once run
#
gen-main: ## Generate goa [main]
	@echo "[INFO ] >>>>> gen-main"
	GOPATH=$(__GOPATH) $(__GOAGEN) main -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_CONTROLLER)
	@echo "[INFO ] Manual move file -> $(__SRC_PROJECT_CONTROLLER)/main.go"

gen-app: ## Generate goa [app]
	@echo "[INFO ] >>>>> gen-app"
	GOPATH=$(__GOPATH) $(__GOAGEN) app -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_GEN)

gen-client: ## Generate goa [client]
	@echo "[INFO ] >>>>> gen-client"
	GOPATH=$(__GOPATH) $(__GOAGEN) client -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_GEN)

gen-swagger: ## Generate goa [swagger]
	@echo "[INFO ] >>>>> gen-swagger"
	GOPATH=$(__GOPATH) $(__GOAGEN) swagger -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_GEN)

gen-schema: ## Generate goa [schema]
	@echo "[INFO ] >>>>> gen-schema"
	GOPATH=$(__GOPATH) $(__GOAGEN) schema -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_GEN)

gen-js: ## gGenerate oa [gen]
	@echo "[INFO ] >>>>> gen-js"
	GOPATH=$(__GOPATH) $(__GOAGEN) js -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_GEN)

gen-model:
	@echo "[INFO ] >>>>> gen-model"
	GOPATH=$(__GOPATH) $(__GOAGEN) gen -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_GEN) --pkg-path=github.com/goadesign/gorma

.PHONY: all \
	clean \
	deps \
	start \
	test \
	bench \
	gen \
	gen-main \
	gen-app \
	gen-client \
	gen-swagger \
	gen-schema \
	gen-js

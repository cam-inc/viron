__PWD=$(shell pwd)
__NOW=$(shell date +%Y%m%d%H%M%S)
__OS_NAME=$(shell uname -s)
__BIN=bin
__SRC=src
__PKG=pkg
__DIST=dist/$(__OS_NAME)
__REALIZE=$(__BIN)/realize

__GITHUB=github.com
__ORGS=cam-inc
__NAME=example-go
__PROJECT=$(__NAME)
__DESIGN=design
__PUBLIC=public
__MODEL=model

__PROG=$(__DIST)/$(__NAME)
__PATH=$(__BIN):$$PATH
__GOPATH=$(__PWD)
__VENDOR_SHELL=$(__PWD)/vendor

__SRC_GITHUB_DIR=$(__SRC)/$(__GITHUB)
__SRC_ORGS_DIR=$(__SRC_GITHUB_DIR)/$(__ORGS)

__SRC_PROJECT_DIR=$(__SRC_ORGS_DIR)/$(__PROJECT)
__SRC_PROJECT_PUBLIC_DIR=$(__SRC_PROJECT_DIR)/$(__PUBLIC)
__PKG_PROJECT=$(__GITHUB)/$(__ORGS)/$(__PROJECT)

__SRC_PROJECT_DESIGN_DIR=$(__SRC_PROJECT_DIR)/$(__DESIGN)
__PKG_PROJECT_DESIGN=$(__GITHUB)/$(__ORGS)/$(__PROJECT)/$(__DESIGN)
__PKG_PROJECT_MODEL=$(__GITHUB)/$(__ORGS)/$(__PROJECT)/$(__DESIGN)/$(__MODEL)

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
	GOPATH=${__GOPATH} go build -o $(__DIST)/$(__PROJECT) $(__PKG_PROJECT)
	GOPATH=${__GOPATH} go build -o $(__DIST)/$(__PROJECT)-cli $(__PKG_PROJECT)/tool/$(__PROJECT)-cli

test:
	@echo "test"

bench:
	@echo "bench"

gen: gen-main gen-app gen-client gen-swagger gen-schema gen-js gen-gorma
	@#GOPATH=$(__GOPATH) ./bin/goagen bootstrap -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_DIR)

# Once run
gen-main:
	GOPATH=$(__GOPATH) ./bin/goagen main -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_DIR)
gen-app:
	GOPATH=$(__GOPATH) ./bin/goagen app -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_DIR)
gen-client:
	GOPATH=$(__GOPATH) ./bin/goagen client -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_DIR)
gen-swagger:
	GOPATH=$(__GOPATH) ./bin/goagen swagger -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_PUBLIC_DIR)
gen-schema:
	GOPATH=$(__GOPATH) ./bin/goagen schema -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_PUBLIC_DIR)
gen-js:
	GOPATH=$(__GOPATH) ./bin/goagen js -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_PUBLIC_DIR)
gen-gorma:
	GOPATH=$(__GOPATH) ./bin/goagen gen -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_DIR) --pkg-path=github.com/goadesign/gorma

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

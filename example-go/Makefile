__PWD=$(shell pwd)
__OS_NAME=$(shell uname -s)

__BIN=bin
__BIN_DIR=$(__PWD)/$(__BIN)

__SRC=src
__SRC_DIR=$(__PWD)/$(__SRC)

__PKG=pkg
__PKG_DIR=$(__PWD)/$(__PKG)

__DIST=dist
__DIST_DIR=$(__PWD)/$(__DIST)

__PUBLIC=public
__PUBLIC_DIR=$(__PWD)/$(__PUBLIC)

__REALIZE=$(__BIN_DIR)/realize
__GOAGEN=$(__BIN_DIR)/goagen
__GOCONVEY=$(__BIN_DIR)/goconvey
__GOLINT=$(__BIN_DIR)/golint
__GOFMT=gofmt
__GOVET=go vet

__BINARY_PROG=$(__DIST)/$(__NAME)
__PATH=$(__BIN):$$PATH
__GOPATH=$(__PWD)
__CDEP=$(__PWD)/cdep

__SERVICE=$(shell $(__CDEP) print_SERVICE)
__ORGANIZATION=$(shell $(__CDEP) print_ORGANIZATION)
__REPOSITORY=$(shell $(__CDEP) print_REPOSITORY)
__TARGET_HOME=example-go
__CDEP_LOCK_FILE=$(shell $(__CDEP) xprint_CDEP_LOCK_FILE)

__DESIGN=design
__CONTROLLER=controller
__GEN=gen

__PKG_PROJECT_HOME=$(__SERVICE)/$(__ORGANIZATION)/$(__REPOSITORY)/$(__TARGET_HOME)
__SRC_PROJECT_HOME=$(__SRC)/$(__SERVICE)/$(__ORGANIZATION)/$(__REPOSITORY)/$(__TARGET_HOME)

__PKG_PROJECT_DESIGN=$(__PKG_PROJECT_HOME)/$(__DESIGN)
__SRC_PROJECT_DESIGN=$(__SRC_PROJECT_HOME)/$(__DESIGN)

__PKG_PROJECT_CONTROLLER=$(__PKG_PROJECT_HOME)/$(__CONTROLLER)
__SRC_PROJECT_CONTROLLER=$(__SRC_PROJECT_HOME)/$(__CONTROLLER)

__PKG_PROJECT_GEN=$(__PKG_PROJECT_HOME)/$(__GEN)
__SRC_PROJECT_GEN=$(__SRC_PROJECT_HOME)/$(__GEN)


all: help

help: ## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##/|/'

#
# -- Setup
#
vendor-install: ## Vendor package install and update(cdep)
	$(__CDEP) install

vendor-uninstall: ## Vendor package uninstall(cdep)
	$(__CDEP) uninstall

setup-pre:
	@__hg=`which hg`; \
	if [ "x$${__hg}" == "x" ]; then \
	 	echo "[ERROR] 'hg' command not found. brew install hg"; \
	 	exit 1; \
	fi

setup: setup-pre vendor-install ## Setup
	@if [ ! -f $(__GOAGEN) ]; then \
		cd $(__SRC_DIR)/github.com/goadesign/goa; \
		GOPATH=$(__GOPATH) make goagen; \
	fi
	@if [ ! -f $(__REALIZE) ]; then \
		cd $(__SRC_DIR)/github.com/tockins/realize; \
		go install; \
	fi
	@if [ ! -f $(__SRC_PROJECT_HOME)/common/jwtkey_gen.go ]; then \
		GOPATH=$(__GOPATH) go generate $(__SRC_PROJECT_HOME)/common/jwtkey.go; \
	fi

#
# -- Clean
#
clean: clean-realize ## clean project
	rm -rf $(__BIN_DIR)
	rm -rf $(__PKG_DIR)
	rm -rf $(__DIST_DIR)
	$(__CDEP) uninstall

clean-realize:
	rm -rf .realize

clean-docker:
	@ID=`docker ps -a --filter 'name=examplego_example-go' -q`; \
	if [ "x$${ID}" != "x" ]; then \
	  docker rm -f $${ID}; \
  	fi
	@ID=`docker ps -a --filter 'name=examplego_mysql' -q`; \
	if [ "x$${ID}" != "x" ]; then \
	  docker rm -f $${ID}; \
  	fi

#
# -- Check
#
test: go-fmt go-vet go-lint ## Checking go programs ## Run all test
	@echo "[INFO ] >>>>> test";
	@for line in `find ./src/github.com/cam-inc/dmc/example-go -type d -name 'gen' -prune -o -type d -print | sed -e "s/.\/src\///g"`; \
	do \
	  echo ""; \
	  GOPATH=$(__GOPATH) go test -v -covermode=count -coverprofile=cover.out $${line}; \
	done

go-lint:
	@echo "[INFO ] >>>>> go-lint"
	@for line in `find $(__SRC_PROJECT_HOME) -type d -name 'gen' -prune -o -type f -name '*.go' -print`; \
	do \
	  $(__GOLINT) $${line}; \
	done

go-fmt:
	@echo "[INFO ] >>>>> go-fmt"
	@for line in `find $(__SRC_PROJECT_HOME) -type d -name 'gen' -prune -o -type f -name '*.go' -print`; \
	do \
	  $(__GOFMT) -w $${line}; \
	done

go-vet:
	@echo "[INFO ] >>>>> go-vet"
	@for line in `find $(__SRC_PROJECT_HOME) -type d -name 'gen' -prune -o -type f -name '*.go' -print`; \
	do \
	  $(__GOVET) $${line}; \
	done



#
# -- Benchmark
#
bench: ## Benchmark
	@echo "bench"

#
# -- goa
#
gen: gen-controller gen-app gen-client gen-swagger gen-schema gen-js gen-model ## Generate goa all (ignore: gen-main)
	@#GOPATH=$(__GOPATH) $(__GOAGEN) bootstrap -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_DIR)
	@echo "Finish :p"

gen-main: ## Generate goa [main]
	@echo "[INFO ] >>>>> gen-main"
	GOPATH=$(__GOPATH) $(__GOAGEN) main -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_DIR)
	@echo "[INFO ] Manual move file -> $(__SRC_PROJECT_CONTROLLER)/main.go"

gen-controller: ## Generate goa [controller]
	@echo "[INFO ] >>>>> gen-controller"
	GOPATH=$(__GOPATH) $(__GOAGEN) controller --app-pkg ../gen/app --pkg $(__CONTROLLER) -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_CONTROLLER)

gen-app: ## Generate goa [app]
	@echo "[INFO ] >>>>> gen-app"
	GOPATH=$(__GOPATH) $(__GOAGEN) app -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_GEN)

gen-client: ## Generate goa [client]
	@echo "[INFO ] >>>>> gen-client"
	GOPATH=$(__GOPATH) $(__GOAGEN) client -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_GEN)

gen-swagger: ## Generate goa [swagger]
	@echo "[INFO ] >>>>> gen-swagger"
	GOPATH=$(__GOPATH) $(__GOAGEN) swagger -d $(__PKG_PROJECT_DESIGN) -o $(__PUBLIC_DIR)

gen-schema: ## Generate goa [schema]
	@echo "[INFO ] >>>>> gen-schema"
	GOPATH=$(__GOPATH) $(__GOAGEN) schema -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_GEN)

gen-js: ## gGenerate oa [gen]
	@echo "[INFO ] >>>>> gen-js"
	GOPATH=$(__GOPATH) $(__GOAGEN) js -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_GEN)

gen-model: ## Generate goa [gorma]
	@echo "[INFO ] >>>>> gen-model"
	GOPATH=$(__GOPATH) $(__GOAGEN) gen -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_GEN) --pkg-path=github.com/goadesign/gorma


#
# -- Start Server
#

# Host
run-local: setup ## Basic run on Host
	cd $(__SRC_PROJECT_HOME); \
		GOPATH=$(__GOPATH) go run *.go

realize-local: clean-realize setup ## Hot-reload run on Host
	$(__REALIZE) list
	GOPATH=$(__GOPATH) $(__REALIZE) run

# Docker Container
run-docker: setup gen ## Basic run on Docker Container
	cd $(__SRC_PROJECT_HOME); \
		GOPATH=$(__GOPATH) go run *.go

realize-docker: clean-realize setup gen ## Hot-reload run on Docker Container
	$(__REALIZE) list
	GOPATH=$(__GOPATH) $(__REALIZE) run


dressup: clean-docker ## Run on docker-compose all
	mkdir -p $(__DIST_DIR)
	docker-compose -f docker-compose.all.yml up --build

dressup-db: clean-docker ## Run on docker-compose only database
	mkdir -p $(__DIST_DIR)
	docker-compose -f docker-compose.db.yml up --build

#
# -- Build
#
build-local: ## Build on Host
	@if [ -f $(__SRC_PROJECT_CONTROLLER)/main.go ]; then \
		echo "Unnecessary files exist of merge please. $(__SRC_PROJECT_CONTROLLER)/main.go -> $(__SRC_PROJECT_HOME)/main.go"; \
		exit 1; \
	fi

	mkdir -p $(__DIST_DIR)/$(__OS_NAME)
	GOPATH=$(__GOPATH) go build -o $(__DIST_DIR)/$(__OS_NAME)/$(__TARGET_HOME) $(__PKG_PROJECT_HOME)
	GOPATH=$(__GOPATH) go build -o $(__DIST_DIR)/$(__OS_NAME)/$(__TARGET_HOME)-cli $(__PKG_PROJECT_GEN)/tool/$(__TARGET_HOME)-cli
	@echo "[Success] Output directory. :p \t$(__DIST)/$(__OS_NAME)"

build-docker: ## Build on docker container
	@ID=`docker-compose -f docker-compose.all.yml ps -q example-go`; \
	@if [ "x$${ID}" == "x" ]; then \
	  echo "[ERROR] docker not running. ex) $$ make dressup"; \
	  exit 1; \
	fi
	docker exec -it $(shell docker-compose -f docker-compose.all.yml ps -q example-go) make build-local

#
# -- Tools
#
example-go-ssh: ## SSH example-go on docker-compose
	@ID=`docker-compose -f docker-compose.all.yml ps -q example-go`; \
	if [ "x$${ID}" == "x" ]; then \
	  echo "[ERROR] docker not running. ex) $$ make dressup"; \
	  exit 1; \
	fi
	docker exec -it $(shell docker-compose -f docker-compose.all.yml ps -q example-go) bash

mysql-ssh: ## SSH mysql on docker-compose
	@ID=`docker-compose -f docker-compose.all.yml ps -q mysql`; \
	if [ "x$${ID}" == "x" ]; then \
	  echo "[ERROR] docker not running. ex) $$ make dressup"; \
	  exit 1; \
	fi
	docker exec -it $(shell docker-compose -f docker-compose.all.yml ps -q mysql) bash

mysql-client: ## Access mysql client on docker-compose
	mysql -u root -h 127.0.0.1 -ppassword

#
# -- Etc (Experiments!)
#
goconvey: ## Start web visualize go testing tools. [experiments]
	@pushd $(__SRC_PROJECT_HOME); \
	GOPATH=$(__GOPATH) \
	$(__GOCONVEY) \
		-cover \
		-depth -1 \
		-packages 10 \
		-port 4001; \
	popd;

.PHONY: all \
	help \
	vendor-install \
	vendor-uninstall \
	setup \
	clean \
	test \
	go-lint \
	go-fmt \
	go-vet \
	check \
	bench \
	gen \
	gen-main \
	gen-controller \
	gen-app \
	gen-client \
	gen-swagger \
	gen-schema \
	gen-js \
	gen-model \
	run-local \
	realize-local \
	run-docker \
	realize-docker \
	dressup \
	dressup-db \
	build-local \
	build-docker \
	example-go-ssh \
	mysql-ssh \
	mysql-client \
	goconvey

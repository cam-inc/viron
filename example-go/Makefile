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
__CDEP_LOCK_FILE=$(shell $(__CDEP) xprint_CDEP_LOCK_FILE)

__DESIGN=design
__CONTROLLER=controller
__GEN=gen


__JWTKEY=jwtkey
__JWTKEY_DIR=$(__SRC)/$(__PKG_PROJECT_HOME)/$(__JWTKEY)
__JWTKEY_SECRET=$(__JWTKEY_DIR)/jwt.key
__JWTKEY_PUBLIC=$(__JWTKEY_DIR)/jwt.key.pub


__PKG_PROJECT_HOME=$(__SERVICE)/$(__ORGANIZATION)/$(__REPOSITORY)
__SRC_PROJECT_HOME=$(__SRC)/$(__PKG_PROJECT_HOME)

__PKG_PROJECT_DESIGN=$(__PKG_PROJECT_HOME)/$(__DESIGN)
__SRC_PROJECT_DEAIGN=$(__SRC)/$(__PKG_PROJECT_DESIGN)

__PKG_PROJECT_CONTROLLER=$(__PKG_PROJECT_HOME)/$(__CONTROLLER)
__SRC_PROJECT_CONTROLLER=$(__SRC)/$(__PKG_PROJECT_CONTROLLER)

__PKG_PROJECT_GEN=$(__PKG_PROJECT_HOME)/$(__GEN)
__SRC_PROJECT_GEN=$(__SRC)/$(__PKG_PROJECT_GEN)


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

setup: vendor-install setup-key ## Setup
	@if [ ! -f $(__GOAGEN) ]; then \
		cd $(__SRC_DIR)/github.com/goadesign/goa; \
		make goagen; \
	fi
	@if [ ! -f $(__REALIZE) ]; then \
		cd $(__SRC_DIR)/github.com/tockins/realize; \
		go install; \
	fi

setup-key:
	@if [ ! -d "$(__JWTKEY_DIR)" ]; then \
		mkdir -p $(__JWTKEY_DIR); \
		openssl genrsa 2048 > $(__JWTKEY_SECRET); \
		openssl rsa -in $(__JWTKEY_SECRET) -pubout -out $(__JWTKEY_PUBLIC); \
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
	@ID=`docker ps -a --filter 'name=camplat-guid' -q`; \
	if [ "x$${ID}" != "x" ]; then \
	  docker rm -f $${ID}; \
  	fi
	@ID=`docker ps -a --filter 'name=camplat-mysql' -q`; \
	if [ "x$${ID}" != "x" ]; then \
	  docker rm -f $${ID}; \
  	fi

#
# -- Check
#
test: ## Run go test
	@echo "[INFO ] >>>>> test";
	@for line in `find ./src/github.com/cam-inc/camplat-guid -type d -name 'gen' -prune -o -type d -print | sed -e "s/.\/src\///g"`; \
	do \
	  echo ""; \
	  GOPATH=$(__GOPATH) go test -v -covermode=count -coverprofile=cover.out $${line}; \
	done

go-lint: ## Run golint
	@echo "[INFO ] >>>>> go-lint"
	@for line in `find $(__SRC_PROJECT_HOME) -type d -name 'gen' -prune -o -type f -name '*.go' -print`; \
	do \
	  $(__GOLINT) $${line}; \
	done

go-fmt: ## Run go format
	@echo "[INFO ] >>>>> go-fmt"
	@for line in `find $(__SRC_PROJECT_HOME) -type d -name 'gen' -prune -o -type f -name '*.go' -print`; \
	do \
	  $(__GOFMT) -w $${line}; \
	done

go-vet: ## Run go vet
	@echo "[INFO ] >>>>> go-vet"
	@for line in `find $(__SRC_PROJECT_HOME) -type d -name 'gen' -prune -o -type f -name '*.go' -print`; \
	do \
	  $(__GOVET) $${line}; \
	done


check: test go-fmt go-vet go-lint ## Checking go programs ## Run all programs checking!!

#
# -- Benchmark
#
bench: ## Benchmark
	@echo "bench"

#
# -- goa
#
gen: gen-app gen-client gen-swagger gen-schema gen-js gen-model ## Generate goa all (ignore: gen-main)
	@#GOPATH=$(__GOPATH) $(__GOAGEN) bootstrap -d $(__PKG_PROJECT_DESIGN) -o $(__SRC_PROJECT_DIR)
	@echo "Finish :p"

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

realize-docker: clean-realize setup ## Hot-reload run on Docker Container
	$(__REALIZE) list
	@if [ ! -L /go/$(__GEN) ]; then \
		ln -s $(__GOPATH)/$(__SRC_PROJECT_GEN) /go/$(__GEN); \
		echo "[symlink] $(__GOPATH)/$(__SRC_PROJECT_GEN) /go/$(__GEN)"; \
	fi
	GOPATH=$(__GOPATH) $(__REALIZE) run


dressup: clean-docker ## Run on docker-compose
	mkdir -p $(__DIST_DIR)
	docker-compose -f docker-compose.yml up --build

#
# -- Build
#
build-local: ## Build on Host
	@if [ -f $(__SRC_PROJECT_CONTROLLER)/main.go ]; then \
		echo "Unnecessary files exist of merge please. $(__SRC_PROJECT_CONTROLLER)/main.go -> $(__SRC_PROJECT_HOME)/main.go"; \
		exit 1; \
	fi

	mkdir -p $(__DIST_DIR)/$(__OS_NAME)
	GOPATH=$(__GOPATH) go build -o $(__DIST_DIR)/$(__OS_NAME)/$(__REPOSITORY) $(__PKG_PROJECT_HOME)
	GOPATH=$(__GOPATH) go build -o $(__DIST_DIR)/$(__OS_NAME)/$(__REPOSITORY)-cli $(__PKG_PROJECT_GEN)/tool/$(__REPOSITORY)-cli
	@echo "[Success] Output directory. :p \t$(__DIST)/$(__OS_NAME)"

build-docker: ## Build on docker container
	@ID=`docker-compose ps -q camplat-guid`; \
	@if [ "x$${ID}" == "x" ]; then \
	  echo "[ERROR] docker not running. ex) $$ make dressup"; \
	  exit 1; \
	fi
	docker exec -it $(shell docker-compose ps -q camplat-guid) make build-local

#
# -- Tools
#
camplat-guid-ssh: ## SSH camplat-guid on docker-compose
	@ID=`docker-compose ps -q camplat-guid`; \
	if [ "x$${ID}" == "x" ]; then \
	  echo "[ERROR] docker not running. ex) $$ make dressup"; \
	  exit 1; \
	fi
	docker exec -it $(shell docker-compose ps -q camplat-guid) bash

camplat-mysql-ssh: ## SSH camplat-mysql on docker-compose
	@ID=`docker-compose ps -q camplat-mysql`; \
	if [ "x$${ID}" == "x" ]; then \
	  echo "[ERROR] docker not running. ex) $$ make dressup"; \
	  exit 1; \
	fi
	docker exec -it $(shell docker-compose ps -q camplat-mysql) bash

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
	gen-app \
	gen-client \
	gen-swagger \
	gen-schema \
	gen-js \
	gen-models \
	run-local \
	realize-local \
	run-docker \
	realize-docker \
	dressup \
	build \
	docker-build \
	camplat-guid-ssh \
	camplat-mysql-ssh \
	mysql-client \
	goconvey

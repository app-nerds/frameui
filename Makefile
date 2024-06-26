.DEFAULT_GOAL := help
.PHONY: help setup

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

VERSION := $(shell cat ./VERSION)
YEAR := $(shell date +%Y)
BANNER := "/* Copyright © $(YEAR) App Nerds LLC $(VERSION) */"

setup: ## Sets up dependencies
	yarn global add rollup uglify-js uglifycss

run: ## Runs the example
	@cd examples && python3 -m http.server 8000

run-base: ## Runs the base example
	cd examples && ../.venv/bin/python3 ./serve-base.py

run-admin-left: ## Runs the example for admin-left
	cd examples && ../.venv/bin/python3 ./serve-admin-left.py

run-admin-top: ## Runs the example for admin-top
	cd examples && ../.venv/bin/python3 ./serve-admin-top.py

watch: ## Watches for changes and rebuilds
	watchman-make -p 'src/**/*.css' 'src/**/*.js' -t build

build: clean build-library copy clean-dist-after ## Builds Nerd JS Library for distribution

build-debug: clean rollup ## Builds a non-minified version of Nerd JS Library

clean: ## Removes all files from the dist folder
	@rm -rf dist/*

build-library: build-css
	@parallel --colsep ' ' -a ./roster-js.txt ./minifyjs.sh {1} {2}

build-css: build-type-files
	@parallel --colsep ',' -a ./roster-css.txt ./minifycss.sh {1} {2}

build-type-files: setup-directories
	npx -p typescript tsc src/**/*.js --declaration --allowJs --emitDeclarationOnly --outDir dist

setup-directories:
	@mkdir -p dist/autocomplete
	@mkdir -p dist/datetime
	@mkdir -p dist/color-picker
	@mkdir -p dist/dialogs
	@mkdir -p dist/menus
	@mkdir -p dist/message-bar
	@mkdir -p dist/shim
	@mkdir -p dist/spinner
	@mkdir -p dist/tagcloud

copy:
	@cp dist/*.min.css examples/static
	@cp dist/frame.js examples/static/frame.js

clean-dist-after:
	npx -p typescript tsc dist/frame.js --declaration --allowJs --emitDeclarationOnly --outDir dist
	cd dist && find . -type f -name "*.js" ! -name "*.min.js" -exec rm -f {} +

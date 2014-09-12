#
# Variables
#

NAME = Sliding Menu

#
# Paths
#

UGLIFYJS = node_modules/uglify-js/bin/uglifyjs
UGLIFYCSS = node_modules/uglifycss/uglifycss
JS_DEST = dist/sliding-menu.js
JS_MIN_DEST = dist/sliding-menu.min.js
CSS_DEST = dist/sliding-menu.css
CSS_MIN_DEST = dist/sliding-menu.min.css


#
# Make a new development build
#

build: node_modules standalone

#
# Make a standalone version that doesn't depend on component etc.
#

standalone:
	@$(UGLIFYJS) $(JS_DEST) --output $(JS_MIN_DEST) -p 5 -c -m --lint --comments all
	@$(UGLIFYCSS) --cute-comments $(CSS_DEST) > $(CSS_MIN_DEST)

#
# Install Node.js modules
#

node_modules:
	@npm install

#
# Clean the installed Node.js modules
#

clean:
	@rm -rf node_modules
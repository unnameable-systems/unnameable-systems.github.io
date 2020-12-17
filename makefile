CSS = $(shell find css -type f -name "*.scss" -printf '%f\n' | cut -f 1 -d '.')
JS = $(shell find js -type f -name "*.js" -not -name "*.min.js" -printf '%f\n' | cut -f 1 -d '.')

HTMLFILES = $(shell find html -type f -name "*.html")
SCSSFILES = $(foreach f, $(CSS), css/$(f).scss)
JSFILES = $(foreach f, $(JS), js/$(f).js)

MINCSSFILES = $(foreach f, $(CSS), css/$(f).min.css)
MINJSFILES = $(foreach f, $(JS), js/$(f).min.js)

all: index.html bundle.min.css bundle.min.js

index.html: $(HTMLFILES)
	jinja2 html/index.html > index.html

bundle.min.css: $(MINCSSFILES)
	cat css/*.min.css > bundle.min.css

$(MINCSSFILES): $(SCSSFILES)
	$(foreach f, $(CSS), scss css/$(f).scss | csso > css/$(f).min.css;)

bundle.min.js: $(MINJSFILES)
	cat js/*.min.js > bundle.min.js

$(MINJSFILES): $(JSFILES)
	$(foreach f, $(JS), uglifyjs js/$(f).js > js/$(f).min.js;)

clean:
	rm -f *.html
	rm -f $(MINCSSFILES)
	rm -f *.min.css
	rm -f $(MINJSFILES)
	rm -f *.min.js

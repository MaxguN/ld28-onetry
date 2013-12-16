# Makefile for ²

NODE_PATH = ./node_modules
JS_COMPILER = $(NODE_PATH)/uglify-js/bin/uglifyjs

all : www/onetry.js

www/onetry.global.js : \
	app/libs/ajax.js \
	app/libs/loader.js \
	app/libs/audio.js \
	app/canvas.js \
	app/states.js \
	app/controls.js \
	app/bullet.js \
	app/ennemy.js \
	app/vessel.js \
	app/interface.js \
	app/level.js \
	app/game.js \
	app/menu.js \
	app/main.js
	@rm -f $@
	@echo "(function () {"  > $@
	cat $^ >> $@
	@echo "})()" >> $@

www/onetry.js : www/onetry.global.js
	@rm -f $@
	$(JS_COMPILER) < $< > $@
	mkdir www/animations
	mkdir www/audio
	mkdir www/ennemies
	mkdir www/images
	cp app/animations/* www/animations/
	cp app/audio/* www/audio/
	cp app/ennemies/* www/ennemies/
	cp app/images/* www/images/
	cp app/styles.css www/

clean :
	rm -f www/onetry.global.js

delete :
	rm -f www/onetry.js www/onetry.global.js
	rm -rf www/animations
	rm -rf www/audio
	rm -rf www/ennemies
	rm -rf www/images
	rm -f www/styles.css

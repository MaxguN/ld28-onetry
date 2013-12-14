function Editor() {
	var self = this;

	this.ui = new Interface(this);
	this.level = new Level();
	this.sandbox = new Sandbox(this);

	this.offset = {
		x : 0,
		y : 0
	};

	this.screen = 0;

	ajax.getJSON('level.json', function (data) {
		self.init(data);
	});
}

Editor.prototype.init = function(level) {
	this.level.load(level);
	this.sandbox.edit = this.level.edit;
	this.ui.setHeight(this.level.height);
	this.ui.setGlobalSpeed(this.level.speed);
	this.ui.setScreenW(this.level.screen.width);
	this.ui.setScreenH(this.level.screen.height);
};

Editor.prototype.getLevel = function() {
	return this.level.get();
};

Editor.prototype.updateOffset = function(offsetX, offsetY) {
	this.offset.x = offsetX;
	this.offset.y = this.level.screen.height + offsetY;

	this.screen = Math.floor(this.offset.y / this.level.screen.height) - 1;
	this.level.setScreen(this.screen);
	this.sandbox.edit = this.level.edit;
};

Editor.prototype.selectToAdd = function(type) {
	this.sandbox.ennemyToAdd(type);
};

Editor.prototype.tick = function(length) {
	this.sandbox.tick(length);
	this.level.tick(length);

	this.draw(this.offset);
};

Editor.prototype.draw = function(offset) {
	this.level.draw(offset);
	this.sandbox.draw(offset);
};
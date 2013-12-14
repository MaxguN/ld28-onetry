function Editor() {
	var self = this;

	this.ui = new Interface(this);
	this.level = new Level();

	ajax.getJSON('level.json', function (data) {
		self.init(data);
	});
}

Editor.prototype.init = function(level) {
	this.level.load(level);
	this.ui.setHeight(this.level.height);
};

Editor.prototype.getLevel = function() {
	return this.level.get();
};

Editor.prototype.tick = function(length) {
	this.draw();
};

Editor.prototype.draw = function(offset) {
	this.level.draw();
};
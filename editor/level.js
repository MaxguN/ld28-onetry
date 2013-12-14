function Level() {
	this.level = {};

	this.height = 0;
	this.speed = 0;
	this.screen = {
		x : 0,
		y : 0
	}
	this.ennemies = [];
}

Level.prototype.isLoaded = function() {
	return this.height !== 0;
};

Level.prototype.load = function(data) {
	this.level = data;

	this.height = data.height;
	this.speed = data.speed;
	this.screen = data.screen;
	this.ennemies = data.ennemies;
};

Level.prototype.get = function() {
	this.level = {
		height : this.height,
		speed : this.speed,
		screen : this.screen,
		ennemies : this.ennemise
	};

	return this.level;
};

Level.prototype.tick = function(length) {
	
};

Level.prototype.draw = function(offset) {
	
};
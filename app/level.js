function Level(game) {
	this.game = game;
	this.level = {};

	this.height = 0;
	this.speed = 0;
	this.screen = {
		height : 0,
		width : 0
	}
	this.screens = [];

	this.ennemies = [];
	this.vessel = null;

	this.index = 0;
}

Level.prototype.isLoaded = function() {
	return this.height !== 0;
};

Level.prototype.load = function(data) {
	this.level = data;

	this.height = data.height;
	this.speed = data.speed;
	this.screen = data.screen;
	this.screens = data.ennemies;

	var x = this.screen.width / 2;
	var y = this.screen.height - 100;

	this.vessel = new Vessel(x, y);

	this.index = 0;
};

Level.prototype.get = function() {
	this.level = {
		height : this.height,
		speed : this.speed,
		screen : this.screen,
		ennemies : this.screens
	};

	return this.level;
};

Level.prototype.nextScreen = function() {
	this.screens[this.index].forEach(function (ennemy) {
		this.ennemies.push(new Ennemy(ennemy));
	}, this);
};

Level.prototype.tick = function(length) {
	this.ennemies.forEach(function (ennemy) {
		ennemy.tick(length);
	}, this);
};

Level.prototype.draw = function(offset) {

	this.ennemies.forEach(function (ennemy) {
		ennemy.draw(offset);
	}, this);

	if (this.vessel) {
		this.vessel.draw();
	}
};
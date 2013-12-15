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
	this.bullets = [];

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

	for (var i = 0; i < this.height; i += this.screen.height) {
		if (!this.screens[i / this.screen.height]) {
			this.screens[i / this.screen.height] = [];
		}
	}

	var x = this.screen.width / 2;
	var y = this.screen.height - 100;

	this.vessel = new Vessel(x, y);

	this.index = 0;
	this.nextScreen();
};

Level.prototype.removeEnnemy = function(e) {
	this.ennemies.some(function (ennemy, index) {
		if (e === ennemy) {
			this.ennemies.splice(index, 1);
			return true;
		}
	}, this);
};

Level.prototype.removeVessel = function() {
	delete this.vessel;
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
		this.ennemies.push(new Ennemy(ennemy, this));
	}, this);
};

Level.prototype.tick = function(length) {
	this.bullets.forEach(function (bullet, index) {
		bullet.tick(length);

		if (this.vessel) {
			if (this.vessel.collidesCircle(bullet.x, bullet.y, bullet.radius)) {
				this.vessel.hit();
				bullet.destroy();
				this.bullets.splice(index, 1);
			}
		}
	}, this);

	if (this.vessel) {
		this.vessel.bullets.forEach(function (bullet, index) {
			bullet.tick(length);

			this.ennemies.forEach(function (ennemy) {
				if (ennemy.collidesSquare(bullet.x, bullet.y, bullet.radius)) {
					ennemy.hit();
					bullet.destroy();
					this.vessel.bullets.splice(index, 1);
				}
			}, this);
		}, this);
	}

	this.ennemies.forEach(function (ennemy) {
		if (!ennemy.shooting && this.game.offset.y + ennemy.y >= 0) {
			ennemy.shooting = true;
		}

		ennemy.tick(length);
	}, this);

	if (this.vessel) {
		this.vessel.tick(length);
	}
};

Level.prototype.draw = function(offset) {
	this.bullets.forEach(function (bullet) {
		bullet.draw();
	}, this);

	if (this.vessel) {
		this.vessel.bullets.forEach(function (bullet) {
			bullet.draw();
		}, this);
	}

	this.ennemies.forEach(function (ennemy) {
		ennemy.draw(offset);
	}, this);

	if (this.vessel) {
		this.vessel.draw();
	}
};
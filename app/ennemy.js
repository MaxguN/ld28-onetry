function Ennemy(data, level) {
	var self = this;

	this.level = level;

	this.x = data.position.x;
	this.y = data.position.y;

	this.type = data.type;
	this.hitpoints = 1;
	this.shootspeed = 1; // shoot.s^-1
	this.score = 0;
	this.shooting = false;

	this.pattern = data.pattern;

	this.animations = {};
	this.currentanimation = '';
	this.currentframe = 0;
	this.mirror = false;
	this.forward = true;
	this.animationrunning = false;
	this.animationtimer = 0;
	this.framelength = 0;
	this.tilesets = [];
	this.tiles = {};

	this.lastshot = 0;

	this.loaded = false;
	this.dead = false;

	load.json('animations/' + this.type + '.json', function (data) {self.init(data);});
	load.json('ennemies/' + this.type + '.json', function (data) {self.setParams(data);});
}

Ennemy.prototype.init = function(data) {
	var self = this;

	this.animations = data.animations;
	this.currentanimation = this.animations[data.default];

	data.tilesets.forEach(function (tileset, index) {
		this.tilesets[index] = {
			image : new Image(),
			width : tileset.tilewidth,
			height : tileset.tileheight
		}

		load.image('images/' + tileset.file, function (image) {
			self.tilesets[index].image = image;
		});

		for (var i = 0; i < tileset.imageheight; i += tileset.tileheight) {
			for (var j = 0; j < tileset.imagewidth; j += tileset.tilewidth) {
				this.tiles[tileset.firstgid + i / tileset.tileheight * (tileset.imagewidth / tileset.tilewidth) + j / tileset.tilewidth] = {
					x : j,
					y : i,
					set : index,
					width : tileset.tilewidth,
					height : tileset.tileheight
				};
			}
		}

	}, this);

	load.ready(function () {
		self.loaded = true;
	});
};

Ennemy.prototype.setParams = function(data) {
	this.hitpoints = data.hitpoints;
	this.shootspeed = data.shootspeed;
	this.score = data.score;
};

Ennemy.prototype.hit = function() {
	this.hitpoints -= 1;

	if (this.hitpoints <= 0) {
		this.kill();
	}
};

Ennemy.prototype.kill = function() {
	if (!this.dead) {
		this.dead = true;
		this.shooting = false;

		game.hud.addScore(this.score);
		game.level.removeEnnemy(this);
	}
};

Ennemy.prototype.collidesSquare = function(x, y, side) {
	if (this.loaded) {
		var frame = this.currentanimation.frames[this.currentframe];
		var tile = this.tiles[frame.tile];
		var tileset = this.tilesets[tile.set];
		var width = tileset.width;
		var height = tileset.height;
		var ex = game.offset.x + this.x - frame.points[0].x;
		var ey = game.offset.y + this.y - frame.points[0].y;

		return x + side >= ex && x <= ex + width && y + side >= ey && y <= ey + height;
	}
};

Ennemy.prototype.tick = function(length) {
	if (this.shooting) {
		var frame = this.currentanimation.frames[this.currentframe];
		var now = new Date().getTime();

		if (now - this.lastshot >= 1000 / this.shootspeed) {
			for (var i = 1; i < frame.points.length; i += 1) {
				var point = frame.points[i];
				var x = game.offset.x + this.x - frame.points[0].x + point.x;
				var y = game.offset.y + this.y - frame.points[0].y + point.y;

				this.level.bullets.push(new Bullet(x, y, point.r, this.level.bullets, true));
			}

			this.lastshot = now;
		}
	}
};

Ennemy.prototype.draw = function(offset) {
	if (this.loaded && !this.dead) {
		var frame = this.currentanimation.frames[this.currentframe];
		var tile = this.tiles[frame.tile];
		var tileset = this.tilesets[tile.set];
		var width = tileset.width;
		var height = tileset.height;
		var x = - frame.points[0].x;
		var y = - frame.points[0].y;

		context.save();
		context.translate(this.x + offset.x, this.y + offset.y);

		if (this.mirror) {
			context.scale(-1, 1);
		}

		context.drawImage(tileset.image, tile.x, tile.y, width, height, x, y, width, height);

		context.restore();
	}
};
function Vessel(x, y) {
	var self = this;

	this.x = x;
	this.y = y;

	this.tilewidth = 0;
	this.tileheight = 0;

	this.speed = 600; //px.s^-1
	this.shootspeed = 10; //shoot.s^-1
	this.bullets = [];

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

	this.sfx = new Audio();

	this.lastshot = 0;

	this.state = states.standby;

	this.loaded = false;
	this.dead = false;
	this.god = false;

	load.json('animations/vessel.json', function (data) {self.init(data);});
}

Vessel.prototype.init = function(data) {
	var self = this;

	audio.sfx('audio/shoot.wav', function (sfx) {
		self.sfx = sfx;
	});

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

	var frame = this.currentanimation.frames[this.currentframe];
	var tile = this.tiles[frame.tile];
	var tileset = this.tilesets[tile.set];
	this.tilewidth = tileset.width;
	this.tileheight = tileset.height;

	load.ready(function () {
		self.loaded = true;
	});
};

Vessel.prototype.hit = function() {
	if (this.god) {
		console.log('Hit !');
	} else {
		this.kill();
	}
};

Vessel.prototype.kill = function() {
	if (!this.dead) {
		this.dead = true;
		game.level.removeVessel();
		game.over();
	}
};

Vessel.prototype.collidesCircle = function(x, y, radius) {
	var width = this.tilewidth / 2;
	var height = this.tileheight / 2;
	var vx = this.x - width / 2;
	var vy = this.y - height / 2;

	var point = {
		x : 0,
		y : 0
	}

	if (x < vx) {
		point.x = vx;
	} else if (x > vx + width) {
		point.x = vx + width;
	} else {
		point.x = x;
	}

	if (y < vy) {
		point.y = vy;
	} else if (y > vy + height) {
		point.y = vy + height;
	} else {
		point.y = y;
	}

	return (Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2)) <= radius);
};

Vessel.prototype.switchtoanim = function(state, mirror) {
	var canswitch = false;

	if (state === states.turn) {
		canswitch = this.state === states.standby;
	} else if (state === states.standby) {
		canswitch = true;
	}

	if (canswitch) {
		this.state = state;
		this.currentanimation = this.animations[state];
		this.currentframe = 0;
		this.animationtimer = 0;
		this.framelength = 1000 / this.currentanimation.speed;
		this.animationrunning = true;
		this.mirror = !(!mirror);
	}
};

Vessel.prototype.tick = function(length) {
	if (this.loaded && !this.dead) {
		var frame = this.currentanimation.frames[this.currentframe];
		var tile = this.tiles[frame.tile];
		var x = this.x - this.tilewidth / 2;
		var y = this.y - this.tileheight / 2;
		var dx = 0;
		var dy = 0;
		var width = this.tilewidth;
		var height = this.tileheight;
		var collision = {};
		this.animationtimer += Math.min(1000/60, length);

		if (keydown[keys.space]) {
			var now = new Date().getTime();
			if (now - this.lastshot >= 1000 / this.shootspeed) {
				for (var i = 1; i < frame.points.length; i += 1) {
					var point = frame.points[i];
					var x = this.x - frame.points[0].x + point.x;
					var y = this.y - frame.points[0].y + point.y;

					this.bullets.push(new Bullet(x, y, 12, this.bullets));

					if (sound) {
						this.sfx.play();
					}
				}

				this.lastshot = now;
			}
		}

		if (keydown[keys.right]) {
			dx += length * this.speed / 1000;
			this.switchtoanim(states.turn);
		}

		if (keydown[keys.left]) {
			dx += - length * this.speed / 1000;
			this.switchtoanim(states.turn, true);
		}

		if (keydown[keys.up]) {
			dy += - length * this.speed / 1000;
		}

		if (keydown[keys.down]) {
			dy += length * this.speed / 1000;
		}

		if (this.animationrunning) {
			if (this.animationtimer >= this.framelength) {
				this.animationtimer -= 1000/60;
				this.currentframe += 1;

				if (this.currentframe >= this.currentanimation.frames.length) {
					if (this.currentanimation.loop) {
						this.currentframe = this.currentanimation.loopto;
					} else {
						this.currentframe -= 1;
						this.animationrunning = false;
					}
				}
			}
		}

		this.x += dx;
		this.y += dy;

		var maxwidth = game.level.screen.width;
		var maxheight = game.level.screen.height;
		var halfwidth = width / 2;
		var halfheight = height / 2;

		if (this.x - halfwidth < 0) {
			this.x = halfwidth;
		}

		if (this.x + halfwidth > maxwidth) {
			this.x = maxwidth - halfwidth;
		}

		if (this.y - halfheight < 0) {
			this.y = halfheight;
		}

		if (this.y + halfheight > maxheight) {
			this.y = maxheight - halfheight;
		}

		game.level.ennemies.some(function (ennemy) {
			if (ennemy.collidesSquare(this.x, this.y, width / 2)) {
				this.hit();
				return true;
			}
		}, this);

		if (dx === 0) {
			this.switchtoanim(states.standby);
		}
	}
};

Vessel.prototype.draw = function() {
	if (this.loaded && !this.dead) {
		var frame = this.currentanimation.frames[this.currentframe];
		var tile = this.tiles[frame.tile];
		var tileset = this.tilesets[tile.set];
		var width = tileset.width;
		var height = tileset.height;
		var x = - frame.points[0].x;
		var y = - frame.points[0].y;

		context.save();
		context.translate(this.x, this.y);

		if (this.mirror) {
			context.scale(-1, 1);
		}

		context.drawImage(tileset.image, tile.x, tile.y, width, height, x, y, width, height);

		context.restore();
	}
};
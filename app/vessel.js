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

	this.lastshot = 0;

	this.state = states.standby;

	this.loaded = false;

	load.json('animations/vessel.json', function (data) {self.init(data);});
}

Vessel.prototype.init = function(data) {
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

	var frame = this.currentanimation.frames[this.currentframe];
	var tile = this.tiles[frame.tile];
	var tileset = this.tilesets[tile.set];
	this.tilewidth = tileset.width;
	this.tileheight = tileset.height;

	load.ready(function () {
		self.loaded = true;
	});
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
	if (this.loaded) {
		var frame = this.currentanimation.frames[this.currentframe];
		var tile = this.tiles[frame.tile];
		var x = this.x - this.tilewidth / 2;
		var y = this.y - this.tileheight / 2;
		var dx = 0;
		var dy = 0;
		var width = 0;
		var height = 0;
		var collision = {};
		this.animationtimer += Math.min(1000/60, length);

		this.bullets.forEach(function (bullet) {
			bullet.tick(length);
		}, this);

		if (keydown[keys.space]) {
			var now = new Date().getTime();
			if (now - this.lastshot >= 1000 / this.shootspeed) {
				for (var i = 1; i < frame.points.length; i += 1) {
					var point = frame.points[i];
					var x = this.x - frame.points[0].x + point.x;
					var y = this.y - frame.points[0].y + point.y;

					this.bullets.push(new Bullet(x, y, 12));
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

		if (dx === 0) {
			this.switchtoanim(states.standby);
		}
	}
};

Vessel.prototype.draw = function() {
	if (this.loaded) {
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
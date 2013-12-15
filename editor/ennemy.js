function Ennemy(data) {
	var self = this;

	this.x = data.position.x;
	this.y = data.position.y;

	this.type = data.type;

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

	this.loaded = false;
	this.highlight = false;

	load.json('animations/' + this.type + '.json', function (data) {self.init(data);});
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

Ennemy.prototype.contains = function(coords) {
	var frame = this.currentanimation.frames[this.currentframe];
	var tile = this.tiles[frame.tile];
	var tileset = this.tilesets[tile.set];
	var width = tileset.width;
	var height = tileset.height;
	var x = - frame.points[0].x;
	var y = - frame.points[0].y;

	var left = this.x + x;
	var right = this.x + x + width;
	var top = (editor.level.index + 1) * editor.level.screen.height + this.y + y;
	var bottom = (editor.level.index + 1) * editor.level.screen.height + this.y + y + height;

	return (coords.x >= left && coords.x <= right && coords.y >=  top && coords.y <= bottom);
};

Ennemy.prototype.tick = function(length) {
	if (this.highlight) {
		this.highlight = false;
	}

	if (keydown[keys.escape]) {
		if (this.selected) {
			delete this.selected;
		}
	}
};

Ennemy.prototype.draw = function(offset) {
	if (this.loaded) {
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

		if (this.highlight || this.selected) {
			context.strokeStyle = "#aa0000";
			context.strokeRect(x, y, width, height);
		}

		context.restore();
	}
};
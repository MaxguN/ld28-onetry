function Bullet(x, y, radius, container, foe) {
	var self = this;

	this.container = container;

	this.x = x;
	this.y = y;

	this.foe = !(!foe);
	this.side = this.foe ? 1 : -1;

	this.radius = radius;
	this.image = new Image();
	this.speed = 600; //px.s^-1

	this.loaded = false;
	this.destroyed = false;

	var filename = 'bullet';
	if (this.foe) {
		filename += '-' + this.radius;
	}
	filename += '.png';

	load.image('images/' + filename, function (data) {self.init(data);});
	load.ready(function () {self.loaded = true;});
}

Bullet.prototype.init = function(data) {
	this.image = data;
};

Bullet.prototype.destroy = function() {
	this.destroyed = true;
};

Bullet.prototype.tick = function(length) {
	this.y += this.side * length * this.speed / 1000;

	if (this.y < 0 || this.y > game.level.screen.height) {
		this.destroy();
		this.container.some(function (bullet, index) {
			if (bullet === this) {
				this.container.splice(index, 1);
				return true;
			}
		}, this);

	}
};

Bullet.prototype.draw = function() {
	if (this.loaded && !this.destroyed) {
		var x = - this.radius / 2;
		var y = - this.radius / 2;
		
		context.save();

		context.translate(this.x, this.y);

		context.drawImage(this.image, x, y);

		context.restore();
	}
};
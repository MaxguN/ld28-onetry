function Bullet(x, y, radius, foe) {
	var self = this;

	this.x = x;
	this.y = y;

	this.foe = !(!foe);
	this.side = this.foe ? 1 : -1;

	this.radius = radius;
	this.image = new Image();
	this.speed = 600; //px.s^-1

	this.loaded = false;

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

Bullet.prototype.tick = function(length) {
	this.y += this.side * length * this.speed / 1000;
};

Bullet.prototype.draw = function() {
	if (this.loaded) {
		var x = - this.radius / 2;
		var y = - this.radius / 2;
		
		context.save();

		context.translate(this.x, this.y);

		context.drawImage(this.image, x, y);

		context.restore();
	}
};
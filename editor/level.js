function Level() {
	this.level = {};

	this.height = 0;
	this.speed = 0;
	this.screen = {
		height : 0,
		width : 0
	}
	this.ennemies = [];

	this.index = 0;
	this.edit = [];
	this.display = [];

	this.update = false;
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

	this.edit = this.ennemies[0];
	this.update = true;
};

Level.prototype.get = function() {
	this.level = {
		height : this.height,
		speed : this.speed,
		screen : this.screen,
		ennemies : this.ennemies
	};

	return this.level;
};

Level.prototype.setScreen = function(screen) {
	this.index = screen;
	this.edit = this.ennemies[screen];
	this.update = true;

	if (this.edit === undefined) {
		this.edit = [];
		this.ennemies[screen] = this.edit;
	}
};

Level.prototype.tick = function(length) {
	if (this.update) {
		this.display = [];

		this.edit.forEach(function (ennemy) {
			var display = {};
			var current = {
				x : ennemy.position.x,
				y : ((this.index + 1) * this.screen.height) + ennemy.position.y
			};
			var next = current;

			display.sprite = new Ennemy(ennemy);
			display.path = [];
			display.via = [];

			ennemy.pattern.forEach(function (point) {
				next = point.destination;

				display.path.push({
					src : current,
					dst : next
				});

				display.via.push({
					center : next,
					radius : 5
				});

				current = next;
			}, this);

			display.sprite.selected = ennemy.selected;

			this.display.push(display);
		}, this);

		this.update = false;
	}

	this.display.forEach(function (ennemy) {
		ennemy.sprite.tick(length);
	})
};

Level.prototype.draw = function(offset) {
	this.display.forEach(function (ennemy, index) {
		if (this.edit[index].selected) {
			context.strokeStyle = '#cccccc';

			context.beginPath();
			ennemy.path.forEach(function (line) {
				context.moveTo(line.src.x, line.src.y);
				context.lineTo(line.dst.x, line.dst.y);
			}, this);
			context.closePath()
			context.stroke();

			context.fillStyle = '#aa0000';

			ennemy.via.forEach(function (point) {
				context.beginPath();
				context.arc(point.center.x, point.center.y, point.radius, 0, Math.PI * 2);
				context.closePath();
				context.fill();
			}, this);
		}

		ennemy.sprite.draw(offset);
	}, this);
};
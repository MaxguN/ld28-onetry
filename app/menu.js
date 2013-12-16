function Menu() {
	var self = this;

	this.over = false;
	this.title = new Image();
	this.score = 0;

	this.loaded = false;

	this.state = states.title;

	load.image('images/title.png', function (image) {self.init(image);});
}

Menu.prototype.init = function(image) {
	this.title = image;

	this.loaded = true;
};

Menu.prototype.start = function() {
	this.state = states.title;
};

Menu.prototype.end = function(score) {
	this.state = states.end;
	this.score = Math.floor(score);
};

Menu.prototype.tick = function(length) {
	if (keydown[keys.m]) {
		sound = !sound;
		keydown[keys.m] = false;
	}

	if (this.state === states.title) {
		if (keydown[keys.enter]) {
			self.over = false;
			current = game;
			game.startlevel();
		}
	} else if (this.state === states.end) {
		if (keydown[keys.enter]) {
			self.over = false;
			current = game;
			game.startlevel();
		}
	}

	this.draw()
};

Menu.prototype.draw = function() {
	if (this.state === states.title) {
		context.drawImage(this.title, 0, 0);
	} else if (this.state === states.end) {
		var score = '' + this.score;

		for (var i = score.length; i < 9; i += 1) {
			score = '0' + score;
		}

		score = score.split('');

		score.splice(6, 0, ' ');
		score.splice(3, 0, ' ');

		score = score.join('');

		context.save();

		context.fillStyle = '#000000';
		context.font = '80pt Arial';
		context.textAlign = 'center';
		context.textBaseline = 'top';

		context.fillText(score, canvas.width / 2, 50);

		context.font = '36pt Arial';
		context.fillText('PRESS ENTER TO RETRY', canvas.width / 2, canvas.height / 2);

		context.restore();
	}
};
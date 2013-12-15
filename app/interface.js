function Interface(game) {
	this.game = game;

	this.score = 0;

	this.distance = 0;
	this.kills = 0;
}

Interface.prototype.addScore = function(score) {
	this.score += score;
	this.kills += score;
};

Interface.prototype.tick = function(length) {
	var distance = length * this.game.level.speed / 1000;

	this.distance += distance;
	this.score += distance * 1.5;
};

Interface.prototype.draw = function(offset) {
	var score = '' + Math.floor(this.score);

	for (var i = score.length; i < 9; i += 1) {
		score = '0' + score;
	}

	score = score.split('');

	score.splice(6, 0, ' ');
	score.splice(3, 0, ' ');

	score = score.join('');

	context.fillStyle = "#000000";
	context.font = "36pt Arial";

	context.fillText(score, 0, 40);
};
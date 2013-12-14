function Interface(editor) {
	this.editor = editor;

	this.map = document.getElementById('map');
	this.slider = document.getElementById('slider');
	this.height = document.getElementById('height');
	this.button_save = document.getElementById('save');
	this.button_reload = document.getElementById('reload');

	this.init();
}

Interface.prototype.init = function() {
	var self = this;

	this.button_save.addEventListener('click', function () {self.save();});
	this.button_reload.addEventListener('click', function () {self.reload();});

	this.height.addEventListener('keyup', function () {self.updateHeight();});

	this.slider.addEventListener('mousedown', function () {self.grabSlider();});
	this.slider.addEventListener('mousemove', function () {self.moveSlider();});
	this.slider.addEventListener('mouseup', function () {self.releaseSlider();});
};

Interface.prototype.save = function() {
	var self = this;
	var level = this.editor.getLevel();
	var data = {level : JSON.stringify(level)};

	this.disable();
	ajax.post('server/save.php', data, function (response) {
		console.log(response);
		self.enable();
	});
};

Interface.prototype.reload = function() {
	var self = this;

	this.disable();
	ajax.getJSON('level.json', function (data) {
		self.editor.init(data);
		self.setHeight(self.editor.level.height);
		self.enable();
	});
};

Interface.prototype.setHeight = function(height) {
	this.height.value = height;
	this.updateSlider();
};

Interface.prototype.updateHeight = function() {
	var height = parseInt(this.height.value);

	this.editor.level.height = height;
	this.updateSlider();
};

Interface.prototype.updateSlider = function() {
	var height = this.editor.level.height;
	var screen = this.editor.level.screen.height;

	var slider = this.map.offsetHeight * (screen / height) - 2;

	this.slider.style.height = slider  + 'px';
};

Interface.prototype.enable = function() {
	this.button_save.disabled = false;
	this.button_reload.disabled = false;
};

Interface.prototype.disable = function() {
	this.button_save.disabled = true;
	this.button_reload.disabled = true;	
};
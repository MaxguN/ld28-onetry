function Interface(editor) {
	this.editor = editor;

	this.map = document.getElementById('map');
	this.slider = document.getElementById('slider');

	this.height = document.getElementById('height');
	this.globalspeed = document.getElementById('globalspeed');
	this.screenw = document.getElementById('screenw');
	this.screenh = document.getElementById('screenh');

	this.button_save = document.getElementById('save');
	this.button_reload = document.getElementById('reload');

	this.button_private = document.getElementById('private');
	this.button_sergeant = document.getElementById('sergeant');
	this.button_captain = document.getElementById('captain');
	this.button_major = document.getElementById('major');
	this.button_general = document.getElementById('general');

	this.button_add = document.getElementById('add');
	this.button_edit = document.getElementById('edit');
	this.button_delete = document.getElementById('delete');

	this.speed = document.getElementById('speed');
	this.pause = document.getElementById('pause');

	this.grabbed = false;

	this.init();
}

Interface.prototype.init = function() {
	var self = this;

	this.button_save.addEventListener('click', function () {self.save();});
	this.button_reload.addEventListener('click', function () {self.reload();});

	this.height.addEventListener('keyup', function () {self.update();});
	this.globalspeed.addEventListener('keyup', function () {self.update();});
	this.screenw.addEventListener('keyup', function () {self.update();});
	this.screenh.addEventListener('keyup', function () {self.update();});

	this.slider.addEventListener('mousedown', function (event) {self.grabSlider(event);}, false);
	this.map.addEventListener('mousemove', function (event) {self.moveSlider(event);}, false);
	document.addEventListener('mouseup', function (event) {self.releaseSlider(event);}, false);
	document.addEventListener('mouseleave', function (event) {self.releaseSlider(event);}, false);

	this.button_private.addEventListener('click', function (event) {self.selectEnnemy(event);});
	this.button_sergeant.addEventListener('click', function (event) {self.selectEnnemy(event);});
	this.button_captain.addEventListener('click', function (event) {self.selectEnnemy(event);});
	this.button_major.addEventListener('click', function (event) {self.selectEnnemy(event);});
	this.button_general.addEventListener('click', function (event) {self.selectEnnemy(event);});
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
		self.setGlobalSpeed(self.editor.level.speed);
		self.setScreenW(self.editor.level.screen.width);
		self.setScreenH(self.editor.level.screen.height);
		self.enable();
	});
};

Interface.prototype.setHeight = function(height) {
	this.height.value = height;
	this.updateSlider();
};

Interface.prototype.setGlobalSpeed = function(speed) {
	this.globalspeed.value = speed;
};

Interface.prototype.setScreenW = function(width) {
	this.screenw.value = width;
};

Interface.prototype.setScreenH = function(height) {
	this.screenh.value = height;
};

Interface.prototype.update = function() {
	var height = parseInt(this.height.value);
	var speed = parseInt(this.globalspeed.value);
	var screenw = parseInt(this.screenw.value);
	var screenh = parseInt(this.screenh.value);

	this.editor.level.height = height;
	this.editor.level.speed = speed;
	this.editor.level.screen = {
		width: screenw,
		height : screenh
	};

	this.updateSlider();
};

Interface.prototype.updateSlider = function() {
	var height = this.editor.level.height;
	var screen = this.editor.level.screen.height;

	var slider = this.map.offsetHeight * (screen / height) - 2;

	this.slider.style.height = slider  + 'px';
};

Interface.prototype.grabSlider = function(event) {
	this.grabbed = true;
};

Interface.prototype.moveSlider = function(event) {
	if (this.grabbed) {
		var top = event.offsetY;
		var height = this.slider.offsetHeight;
		var max = this.map.offsetHeight;

		if (event.srcElement === this.slider) {
			top += event.srcElement.offsetTop;
		}

		var move = max - Math.max(0, Math.min(max, top));
		var zone = Math.floor(move / height); 
		var offset = this.editor.level.screen.height * zone;

		this.slider.style.bottom = (zone * height) + 'px';

		this.editor.updateOffset(0, offset)
	}
};

Interface.prototype.releaseSlider = function(event) {
	this.grabbed = false;
};

Interface.prototype.selectEnnemy = function(event) {
	var element = event.srcElement;

	if (element.className === 'selected') {
		element.className = '';

		this.editor.selectToAdd();
	} else {
		this.button_private.className = '';
		this.button_sergeant.className = '';
		this.button_captain.className = '';
		this.button_major.className = '';
		this.button_general.className = '';

		element.className = 'selected';

		this.editor.selectToAdd(element.id);	
	}

};

Interface.prototype.enable = function() {
	this.button_save.disabled = false;
	this.button_reload.disabled = false;
};

Interface.prototype.disable = function() {
	this.button_save.disabled = true;
	this.button_reload.disabled = true;	
};
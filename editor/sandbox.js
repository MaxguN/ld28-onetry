function Sandbox(editor) {
	this.editor = editor;
	this.edit = [];

	this.type = '';
	this.addElement = null;
	this.moveElement = null;
	this.editElement = null;
	this.selectElement = null;
	this.highlight = null;

	this.init();
}

Sandbox.prototype.init = function() {
	var self = this;

	canvas.addEventListener('click', function (event) {self.onClick(event);});
	canvas.addEventListener('mousedown', function (event) {self.onMouseDown(event);});
	canvas.addEventListener('mouseup', function (event) {self.onMouseUp(event);});
};

Sandbox.prototype.onClick = function(event) {
	if (this.type === 'ennemy') {
		this.edit.push({
			type : this.addElement.type,
			position : {
				x : this.addElement.x,
				y : this.addElement.y - (this.editor.level.index + 1) * this.editor.level.screen.height
			},
			pattern : this.addElement.pattern
		})

		this.editor.level.update = true;
	}
};

Sandbox.prototype.onMouseDown = function(event) {
	if (this.highlight) {
		this.editElement = this.highlight;
		this.moveElement = new Ennemy(this.highlight);
		this.highlight = null;
	}
};

Sandbox.prototype.onMouseUp = function(event) {
	if (this.moveElement) {
		this.editElement.position.x = this.moveElement.x;
		this.editElement.position.y = this.moveElement.y - (this.editor.level.index + 1) * this.editor.level.screen.height;

		this.selectElement = this.editElement;
		this.editElement = null;
		this.moveElement = null;

		this.selectElement.selected = true;
		
		this.editor.level.update = true;
	}
};

Sandbox.prototype.ennemyToAdd = function(type) {
	if (type) {
		this.addElement = new Ennemy({
			type : type,
			position : {
				x : -1000,
				y : 0
			},
			pattern : []
		});
		this.type = 'ennemy';
	} else {
		this.addElement = null;
		this.type = '';
	}
};

Sandbox.prototype.tick = function(length) {
	if (this.addElement) {
		this.addElement.x = mouse.canvas.x;
		this.addElement.y = mouse.canvas.y;
	} else if (this.moveElement) {
		this.moveElement.x = mouse.canvas.x;
		this.moveElement.y = mouse.canvas.y;
	} else {
		this.highlight = null;

		if (mouse.canvas.x >= 0 && mouse.canvas.x <= this.editor.level.screen.width &&
			mouse.canvas.y >= 0 && mouse.canvas.y <= this.editor.level.screen.height) {

			this.edit.some(function (ennemy, index) {
				if (this.editor.level.display[index].sprite.contains(mouse.canvas)) {
					this.editor.level.display[index].sprite.highlight = true;
					this.highlight = ennemy;
					return true;
				}
			}, this);
		}
	}

	if (keydown[keys.escape]) {
		this.edit.forEach(function (ennemy) {
			if (ennemy.selected) {
				delete ennemy.selected;
			}
		});
	}

	if (keydown[keys.delete]) {
		this.edit.forEach(function (ennemy, index) {
			if (ennemy.selected) {
				this.edit.splice(index, 1);
				this.editor.level.display.splice(index, 1);
			}
		}, this);

		this.editor.level.update = true;
	}
};
 
Sandbox.prototype.draw = function(offset) {
	if (this.addElement) {
		this.addElement.draw({x : 0, y : 0});
	}

	if (this.moveElement) {
		this.moveElement.draw({x : 0, y : 0});
	}
};
function Sandbox(editor) {
	this.editor = editor;
	this.edit = [];

	this.addElement = null;
}

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
	} else {
		this.addElement = null;
	}
};

Sandbox.prototype.tick = function(length) {
	if (this.addElement) {
		this.addElement.x = mouse.canvas.x;
		this.addElement.y = mouse.canvas.y;
	}
};

Sandbox.prototype.draw = function(offset) {
	if (this.addElement) {
		this.addElement.draw({x : 0, y : 0});
	}
};
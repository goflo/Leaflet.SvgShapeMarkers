L.SVG.include({
	getCustomShapePath: function(shape, p, s) {
		var path;

		if (shape === "diamond") {
			path = 'M' + (p.x-s) + ' ' + (p.y) + ' L' + (p.x) + ' ' + (p.y-s) + ' L'  + (p.x+s) + ' ' + (p.y) + ' L'  + (p.x) + ' ' + (p.y+s) + ' Z';
		} else if (shape === "square") {
			path = 'M' + (p.x-s) + ' ' + (p.y-s) + ' L' + (p.x+s) + ' ' + (p.y-s) + ' L'  + (p.x+s) + ' ' + (p.y+s) + ' L'  + (p.x-s) + ' ' + (p.y+s) + ' Z';
		} else if (shape === "triangle") {
			path = 'M' + (p.x-s) + ' ' + (p.y+s) + ' L' + (p.x) + ' ' + (p.y-s) + ' L' + (p.x+s) + ' ' + (p.y+s) + ' Z';
		} else if (shape === "triangle-rotated") {
			path = 'M' + (p.x-s) + ' ' + (p.y-s) + ' L' + (p.x) + ' ' + (p.y+s) + ' L' + (p.x+s) + ' ' + (p.y-s) + ' Z';
		} else if (shape === "circle") {
			path = 'M' + (p.x-s) + ' ' + (p.y) + ' a' + s + ' ' + s + ' 0 1 0 ' + (2*s) + ' 0' + ' a' + s + ' ' + s + ' 0 1 0 ' + (-2*s) + ' 0';
		} else if (shape === "cross") {
			path = 'M' + (p.x+s) + ' ' + (p.y+s) + ' L' + (p.x-s) + ' ' + (p.y-s) +	' M' + (p.x-s) + ' ' + (p.y+s) + ' L' + (p.x+s) + ' ' + (p.y-s);
		} else if (shape === "map-marker") {
			// https://jsfiddle.net/150u7dpx/4/
			var s3 = s / 3;
			var s2 = s / 2;
			var w = 2 * s;
			var h = 3 * s;
			
			path = 'M' + (p.x) + ' ' + (p.y)
			     + ' Q' + (p.x + s) + ' ' + (p.y - w + s3) + ' ' + (p.x + s) + ' ' + (p.y - w)
				 + ' A' + (s2) + ' ' + (s2) + ' 0 0 0 ' + (p.x - s) + ' ' + (p.y - w)
				 + ' Q' + (p.x - s) + ' ' + (p.y - w + s3) + ' ' + (p.x) + ' ' + (p.y)
				 + ' Z';
		}
		
		return path;
	},

	_updateShape: function (layer) {
		var p = layer._point;
		var s = layer._radius;
		var shape = layer.options.shape;
		var path = this.getCustomShapePath(shape, p, s);

		if (shape === "circle") {
			this._updateCircle(layer)
		} else if (path) {
			this._setPath(layer, path);			
		} else {
			this._setPath(layer, "");
		}
	}
});

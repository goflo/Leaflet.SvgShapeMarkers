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
;L.ShapeMarker = L.Path.extend({
	options: {
		fill: true,
		shape: 'triangle',
		radius: 10
	},

	initialize: function (latlng, options) {
		L.setOptions(this, options);
		this._latlng = L.latLng(latlng);
		this._radius = this.options.radius;
	},

	setLatLng: function (latlng) {
		this._latlng = L.latLng(latlng);
		this.redraw();
		return this.fire('move', {latlng: this._latlng});
	},

	getLatLng: function () {
		return this._latlng;
	},

	setRadius: function (radius) {
		this.options.radius = this._radius = radius;
		return this.redraw();
	},

	getRadius: function () {
		return this._radius;
	},

	setStyle : function (options) {
		var radius = options && options.radius || this._radius;
		L.Path.prototype.setStyle.call(this, options);
		this.setRadius(radius);
		return this;
	},

	_project: function () {
		this._point = this._map.latLngToLayerPoint(this._latlng);
		this._updateBounds();
	},

	_updateBounds: function () {
		var r = this._radius,
			r2 = this._radiusY || r,
			w = this._clickTolerance(),
			p = [r + w, r2 + w];
		this._pxBounds = new L.Bounds(this._point.subtract(p), this._point.add(p));
	},

	_update: function () {
		if (this._map) {
			this._updatePath();
		}
	},

	_updatePath: function () {
		this._renderer._updateShape(this);
	},

	_empty: function () {
		return this._size && !this._renderer._bounds.intersects(this._pxBounds);
	},

	toGeoJSON: function () {
		return L.GeoJSON.getFeature(this, {
			type: 'Point',
			coordinates: L.GeoJSON.latLngToCoords(this.getLatLng())
		});
	}

});


// @factory L.shapeMarker(latlng: LatLng, options? ShapeMarker options)
//
L.shapeMarker = function shapeMarker(latlng, options) {
	return new L.ShapeMarker(latlng, options);
};

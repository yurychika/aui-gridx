(function(){

angular.module('aui.grid')
.factory('GridRow', ['$q', '$compile', '$parse', '$timeout', 'GridCore',
	function($q, $compile, $parse, $timeout, GridCore) {
		var GridRow = function(id, grid) {
			this.grid = grid;
			this.model = grid.model;
			this.id = id;
		};

		GridRow.prototype.index = function() {
			return this.model.idToIndex(this.id);
		};

		GridRow.prototype.parent = function() {
			return this.grid.row(this.model.parentId(this.id), 1);
		};

		GridRow.prototype.cell = function(column, isId) {
			return this.grid.cell(this, column, isId);
		};

		GridRow.prototype.cells = function(start, count) {
			var t = this,
				g = t.grid,
				cells = [],
				cols = g._columns,
				total = cols.length,
				i = start || 0,
				end = count >= 0 ? start + count : total;

			for (; i < end && i < total; ++i) {
				cells.push(g.cell(t.id, cols[i].id, 1));
			}
			return cells;
		};

		GridRow.prototype.data = function() {
			return this.model.byId(this.id).data;
		};

		GridRow.prototype.rawData = function() {
			return this.model.byId(this.id).rawData;
		};

		GridRow.prototype.item = function() {
			return this.model.byId(this.id).item;
		};

		GridRow.prototype.setRawData = function(rawData) {
			var t = this, 
				s = t.grid.store,
				item = t.item(),
				field, d;
				
			if(s.setValue){
				d = new Deferred();
				try{
					for(field in rawData){
						s.setValue(item, field, rawData[field]);
					}
					s.save({
						onComplete: lang.hitch(d, d.callback),
						onError: lang.hitch(d, d.errback)
					});
				}catch(e){
					d.errback(e);
				}
			}
			return d || Deferred.when(s.put(lang.mixin(lang.clone(item), rawData)));
		};

		return GridRow;
	}]);
})();

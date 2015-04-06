(function(){

angular.module('aui.grid')
.factory('GridView', ['$q', '$compile', '$parse', '$timeout', 'GridCore',
	function($q, $compile, $parse, $timeout, GridCore) {
		var GridView = function(grid) {
			this.grid = grid;
		};

		GridView.prototype.getRowInfo = function(row) {
			var vi = row.visualIndex,
				index = row.index,
				id = row.id;

			if (vi !== undefined) {			//by visual index


			} else if (index !== undefined) {		//by index

			} else {		//by id

			}
			// return this.model.idToIndex(this.id);
		};

		return GridView;
	}]);
})();

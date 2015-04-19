(function(){
	
angular.module('aui.grid')
.factory('GridOption', ['$q', '$compile', '$parse', '$timeout', 'GridCore',
	function($q, $compile, $parse, $timeout, GridCore) {

		var GridOption = function(options) {
			this._options = options;
		};

		GridOption.prototype.childField = 'children';

		GridOption.prototype.emptyInfo = 'There are no rows.';

		GridOption.prototype.paginationPageSize = -1;		//no pagination by default

		GridOption.prototype.startPage = 0;

		GridOption.prototype.paginationPageSizes = [5, 10, 25, 50];

		GridOption.prototype.getOption = function(name) {
			if (this._options.hasOwnProperty(name)) {
				return this._options[name];
			}

			return this[name];
		};

		return GridOption;
	}]);
})();

(function() {
	angular.module('aui.grid')
	.service('GridUtil', ['$q', '$compile', '$parse', '$timeout', function() {
		var s = {
			delegate: function() {},

			isFunction: function(func) {
				return angular.isFunction(func);
			},

			isString: function(s) {
				return angular.isString(s);
			},

			isArray: function(a) {
				return angular.isArray(a);
			},

			closest: function(node, className) {
				while(node) {
					if(angular.element(node).hasClass(className)) {
						return node;
					}
					node = node.parentNode;
				}
			},
			
			hitch: function(scope, method) {
				scope = scope || window;
				method = angular.isString(method) ? scope[method] : method;

				if (arguments.length > 2) {
					var args = [].slice.apply(arguments, [2]);
					// args = args.splice(0, 2);
					return function() {
						var _args = [].concat(args);
						for (var i = 0; i < arguments.length; i++) {
							_args.push(arguments[i]);
						}
						return method.apply(scope, _args);
					}
				}

				return function() {return method.apply(scope, arguments || []);}
			},

			mixin: function(a, b) {
				var k;

				for (k in b) {
					if (!a.hasOwnProperty(k)) {
						a[k] = b[k];
					}
				}

				return a;
			},

			isColumnSortable: function(grid, col) {
				if (angular.isString(col)) {
					col = grid._columnsById[colId];
				}

				return col && col.enableSorting !== false;
			}
		};

		return s;
	}]);

})();
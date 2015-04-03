(function() {
	angular.module('aui.grid')
	.service('GridUtil', ['$q', '$compile', '$parse', '$timeout', function() {
		var s = {
			delegate: function() {},

			isFunction: function() {
				return angular.isFunction();
			},

			isString: function(s) {
				return angular.isString(s);
			},

			isArray: function(a) {
				return angular.isArray(a);
			},
			
			hitch: function(scope, method) {
				scope = scope || window;
				method = angular.isString(method) ? scope[method] : method;

				if (arguments.length > 2) {
					var args = [].slice.apply(arguments, [2]);
					// args = args.splice(0, 2);
					return function() {return method.apply(scope, args.concat(arguments));}
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
			}
		}

		return s;
	}]);

})();
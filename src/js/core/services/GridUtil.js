(function() {
	angular.module('aui.grid')
	.service('GridUtil', ['$q', '$compile', '$parse', '$timeout', function() {
		var s = {
			delegate: function() {},

			isFunction: function() {
				return angular.isFunction();
			},

			isString: function(s) {
				return angualr.isString(s);
			},

			isArray: function(a) {
				return angular.isArray(a);
			},
			
			hitch: function() {},

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
(function () {
	'use strict';
	angular.module('aui.grid.i18n', []);
	angular.module('aui.grid', ['aui.grid.i18n']);
})();
(function() {
	'use strict';

	var module = angular.module('aui.grid');

	module.directive('auiGrid', function() {
		return {
			templateUrl: 'aui-grid/aui-grid',
			// scope: {
			// 	auiGrid: '=',
			// 	// getExternalScopes: '&?externalScopes' //optional functionwrapper around any needed external scope instances
			// },
			replace: true,
			transclude: true,
			// controller: 'uiGridController',
			link: function($scope, $elem) {
				console.log('this is the aui gridx instance');
				// console.log
			}
		};
	});
})();

angular.module('aui.grid').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('aui-grid/aui-grid',
    "<div>hello worldd</div>"
  );

}]);

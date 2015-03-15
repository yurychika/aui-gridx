(function() {
	'use strict';

	var module = angular.module('aui.grid');

	module.controller('auiGridController',
		['$scope', '$element', '$attrs', 'Grid', function ($scope, $element, $attrs, Grid) {
			console.log($scope.auiGrid);
			$scope.grid = new Grid($scope.auiGrid);

			console.log($scope.grid);
			

		}]);

	module.directive('auiGrid', function() {
		return {
			templateUrl: 'aui-grid/aui-grid',
			scope: {
				auiGrid: '=',
				getExternalScopes: '&?externalScopes' //optional functionwrapper around any needed external scope instances
			},
			replace: true,
			transclude: true,
			controller: 'auiGridController',
			link: function($scope, $elem) {
				console.log($scope.auiGrid);
				// console.log
			}
		};
	});
})();

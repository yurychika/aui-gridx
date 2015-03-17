(function() {
	'use strict';

	var module = angular.module('aui.grid');

	module.directive('auiGridFooter', function() {
		return {
			templateUrl: 'aui-grid/aui-grid-footer',
			scope: {
				auiGrid: '=',
				getExternalScopes: '&?externalScopes' //optional functionwrapper around any needed external scope instances
			},
			require: ['^auiGrid'],
			replace: true,
			transclude: true,
			// controller: 'auiGridController',
			link: function($scope, $elem) {
				console.log($scope.auiGrid);
				// console.log
			}
		};
	});
})();

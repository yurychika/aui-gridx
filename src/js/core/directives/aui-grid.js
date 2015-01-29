(function() {
	'use strict';

	var module = angular.module('aui.grid');

	module.directive('auiGrid', [], function() {
		return {
			templateUrl: 'templates/aui-grid',
			scope: {
				auiGrid: '=',
				// getExternalScopes: '&?externalScopes' //optional functionwrapper around any needed external scope instances
			},
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

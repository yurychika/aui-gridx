(function() {
	'use strict';

	var module = angular.module('aui.grid');

	module.directive('auiGridFooter', function() {
		return {
			templateUrl: 'aui-grid/aui-grid-footer',
			// require: ['^auiGrid'],
			replace: true,
			link: function($scope, $elem) {
				$scope.grid.footerNode = $elem[0];
			}
		};
	});
})();

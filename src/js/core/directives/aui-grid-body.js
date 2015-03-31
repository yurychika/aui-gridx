(function() {
	'use strict';

	var module = angular.module('aui.grid');

	module.controller('auiGridBodyController', ['$scope', '$element', '$attrs', 'Grid', function ($scope, $element, $attrs, Grid) {
			var self = this;
			this.grid = $scope.grid;
			this.renderedRows = this.grid.body.renderedRows;

			this.isEmpty = function() {
				console.log('is empty', grid.model.size());
				return self.grid.model.size() !== 0;
			}
		}]);

	module.directive('auiGridBody', function() {
		return {
			templateUrl: 'aui-grid/aui-grid-body',
			require: ['^auiGrid', 'auiGridBody'],
			replace: true,
			transclude: true,
			controller: 'auiGridBodyController as RenderContainer',
			// controller: 'auiGridController',
			link: function($scope, $elm, $attrs, controllers) {
			// link: function($scope, $elem) {
				var gridCtrl = controllers[0];
				var bodyCtrl = controllers[1];

				$scope.renderedRows = bodyCtrl.renderedRows;
				$scope.isEmpty = bodyCtrl.isEmpty;

				$scope.$watch(
					// This function returns the value being watched. It is called for each turn of the $digest loop
					function() { return gridCtrl.grid.model.size() === 0; },
					// This is the change listener, called when the value returned from the above function changes
					function(newValue, oldValue) {
						if (newValue) {
							$scope.isEmpty = true;
						} else {
							$scope.isEmpty = false;
						}
					}
				);
				// $scope.renderredRows = [1,2,3];
				// console.log('body controller', gridCtrl.grid.body.renderedRows);
				// console.log('body controller', gridCtrl.grid);
				// console.log('body controller', gridCtrl.grid.body);
				// // $scope.renderredRows =
				// console.log('in aui body link');
				// console.log($scope.auiGrid);
				// console.log
			}
		};
	});
})();
(function () {
	'use strict';
	angular.module('aui.grid.i18n', []);
	angular.module('aui.grid', ['aui.grid.i18n']);
})();
(function() {
	'use strict';

	var module = angular.module('aui.grid');

	module.controller('auiGridBodyController', ['$scope', '$element', '$attrs', 'Grid', function ($scope, $element, $attrs, Grid) {
		var self = this;
		this.grid = $scope.grid;
		this.renderedRows = this.grid.body.renderedRows;

		this.isEmpty = function() {
			// console.log('is empty', grid.model.size());
			return self.grid.model.size() !== 0;
		}
	}]);

	module.directive('auiGridBody', function() {
		return {
			templateUrl: 'aui-grid/aui-grid-body',
			require: ['^auiGrid', 'auiGridBody'],
			replace: true,
			controller: 'auiGridBodyController as RenderContainer',
			// controller: 'auiGridController',
			link: function($scope, $elem, $attrs, controllers) {
			// link: function($scope, $elem) {
				var gridCtrl = controllers[0],
					bodyCtrl = controllers[1],
					bodyNode = $elem.find('div')[1];

				$scope.renderedRows = bodyCtrl.renderedRows;
				$scope.isEmpty = bodyCtrl.isEmpty;
				$scope.grid.bodyNode = $elem.find('div')[1];

				$scope.grid.subscribe('columnChange', function() {
					grid.body.render();
				});
				$scope.$watchCollection(function() {
					return $scope.renderedRows;
				}, function(newData) {
				});

				$scope.$watch(
					function() { return gridCtrl.grid.model.size() === 0; },
					function(newValue, oldValue) {
						if (newValue) {
							$scope.isEmpty = true;
						} else {
							$scope.isEmpty = false;
						}
					}
				);

				$scope.$on('onBodyRender', function() {
					console.log('%cin on body render event', 'color:red');
					if ($scope.grid.bodyNode.scrollHeight > $scope.grid.bodyNode.clientHeight) {
						$scope.grid.hasVScroller = true;
					} else {
						$scope.grid.hasVScroller = false;
					}
					if ($scope.grid.bodyNode.scrollWidth > $scope.grid.bodyNode.clientWidth) {
						$scope.grid.hasHScroller = true;
					} else {
						$scope.grid.hasHScroller = false;
					}
				});

				angular.element(bodyNode).on('scroll', function() {
					$scope.grid.headerInner.scrollLeft = bodyNode.scrollLeft;
				});
			}
		};
	});
})();

(function() {
	'use strict';

	var module = angular.module('aui.grid');
	module.directive('auiGridCell', ['GridUtil', function(GridUtil) {
		function cellWrapper(rowId, colIndex, data, grid, $scope) {
			// if (colIndex === 0 && grid.model.hasChildren(rowId)) {
			if (colIndex === 0) {
				var treepath = grid.model.treePath(rowId);

				var wrapper = document.createElement('div');
				angular.element(wrapper).addClass('gridxTreeExpandoCell');
				if (grid.view.isExpanded(rowId)) {
					angular.element(wrapper).addClass('gridxTreeExpandoCellOpen');
				}
				wrapper.style.paddingLeft = ((treepath.length) * 16) + 'px';
				var content = document.createElement('div');
				angular.element(content).addClass('gridxTreeExpandoContent gridxCellContent').html(data);

				if (grid.model.hasChildren(rowId)) {
					var icon = document.createElement('div');
					angular.element(icon).addClass('gridxTreeExpandoIcon');
					var expando = document.createElement('div');
					angular.element(expando).addClass('gridxTreeExpandoInner').html('+');
					icon.style.left = ((treepath.length - 1) * 16) + 'px';

					icon.addEventListener('click', function(e) {
						if (grid.view.isExpanded(rowId)) {
							grid.view.logicCollapse(rowId);
						} else {
							grid.view.logicExpand(rowId);
						}
						grid.body.render();
						$scope.$apply();
					});

					wrapper.appendChild(icon);
					wrapper.appendChild(content);

					icon.appendChild(expando);
				} else {
					wrapper.appendChild(content);
				}
				// wrapper.innerHTML = data;
				return wrapper;
			}

			return data;
		}

		return {
			// templateUrl: 'aui-grid/aui-grid-cell',
			replace: true,
			require: ['^auiGrid'],
			scope: {
				row: '=',
				field: '=',
				colId: '=',
				col: '='
			},
			// transclude: true,
			link: function($scope, $elem, $attrs, controllers) {
				var gridCtrl = controllers[0],
					grid, temp;

				$scope.grid = gridCtrl.grid;
				$scope.columns = $scope.grid._columns;
				$scope.domNode = $elem[0];
				$scope.innerNode = $scope.domNode.querySelectorAll('.gridxHeaderRowInner')[0];
				$scope.headerCells = [];
				grid = $scope.grid;

				var row = $scope.row;
				var field = $scope.field;
				var colId = $scope.colId;
				var data = row.data()[field];
				// console.log($scope.field
				var col = grid._columnsById[colId];
				var colIndex = $scope.col.index;
				$elem[0].style.width = col.width;
				$elem[0].style.maxWidth = col.width;
				$elem[0].style.minWidth= col.width;

				// 	data = '<a href="' + '#" class="expando">+</a>' + data;
				// }
				var cellContent = cellWrapper(row.id, colIndex, data, grid, $scope);
				if (typeof cellContent === 'object') {
					$elem[0].appendChild(cellContent);
				} else {
					$elem[0].innerHTML = data;
				}

				if ($scope.$parent.$last) {
					$scope.$emit('onRowRender');
				}
			}
		};
	}]);
})();

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

(function() {
	'use strict';

	var module = angular.module('aui.grid');

	module.directive('auiGridHeader', ['GridUtil', function(GridUtil) {
		return {
			templateUrl: 'aui-grid/aui-grid-header',
			replace: true,
			require: ['^auiGrid'],
			link: function($scope, $elem, $attrs, controllers) {
				var gridCtrl = controllers[0];

				$scope.grid = gridCtrl.grid;
				var grid = $scope.grid;
				grid.subscribe(['columnChange', 'refresh'], function() {
					console.log('%cin column change callback', 'color:red');
					buildHeader();
				});
				grid.headerNode = $elem[0];
				grid.headerInner = $elem[0].querySelectorAll('.gridxHeaderRowInner')[0];;
				$scope.columns = gridCtrl._columns;
				$scope.domNode = $elem[0];
				$scope.innerNode = grid.headerInner;
				// var $colMenu 
				var temp;

				function buildHeader() {
					$scope.headerCells = [];
					console.log('%cin build header', 'color:blue');
					angular.forEach(grid._columns, function(col) {
						temp = {};
						temp.id = grid.id + col.id;
						temp.colId = col.id;
						temp.domClass = (GridUtil.isFunction(col.headerClass) ? col.headerClass(col) : col.headerClass) || '';
						temp.style = 'width:' +  col.width + ';min-width:' + col.width + ';';
						temp.style += (GridUtil.isFunction(col.headerStyle) ? col.headerStyle(col) : col.headerStyle) || '';
						temp.content = (GridUtil.isFunction(col.headerFormatter) ? col.headerFormatter(col) : col.name);
						temp.sorting = col.sorting;
						temp.sortable = col.enableSorting !== false;
						$scope.headerCells.push(temp);
					});
				}

				function toggleHeaderSorting(colId) {
					var col = grid._columnsById[colId],
						sorting, newSorting;
					if(!col || col.enableSorting === false) return;

					sorting = col.sorting || 0;
					switch(sorting) {
						case 1:
							newSorting = col.sorting = -1;
							break;
						case -1:
							newSorting = col.sorting = 0;
							break;
						case 0:
							newSorting = col.sorting = 1;
							break;
					}
					console.log('current sorting', newSorting);
					if (col.sorting !== 0) {
						grid.sort([{colId: colId, descending: col.sorting === -1}]);
					} else {
						grid.publish('clearSort');
					}
				}

				$elem.on('click', function(evt) {
					var target = evt.target,
						headerCell = GridUtil.closest(target, 'gridxCell'),
						colId, col;

					if(!headerCell) return;
					
					colId = target.getAttribute('colId');
					col = grid._columnsById[colId];
					if (col && col.enableSorting === false) {
						console.warn('column:', colId, 'not allowed to do sorting');
					}
					toggleHeaderSorting(colId);
				})
			}
		};
	}]);
})();

(function() {
	'use strict';

	var module = angular.module('aui.grid');

	module.directive('auiGridPaginationBar', ['GridUtil', function(GridUtil) {
		return {
			templateUrl: 'aui-grid/aui-grid-pagination-bar',
			replace: true,
			require: ['^auiGrid'],
			link: function($scope, $elem, $attrs, controllers) {
				var gridCtrl = controllers[0];
				var grid = $scope.grid;

				$scope.grid = gridCtrl.grid;
				$scope.paginationApi = $scope.grid.api.pagination;
				$scope.paginationPageSizes = grid.getOption('paginationPageSizes');

				var watchPageSize = $scope.$watch('grid.paginationPageSize', function (newValue, oldValue) {
					if (newValue === oldValue) {
						return;
					} else {
						grid.api.pagination.setPageSize(newValue);
					}
				});

				var watchCurrentPage = $scope.$watch('grid.currentPage', function (newValue, oldValue) {
					if (newValue === oldValue) {
						return;
					} else {
						if (angular.isNumber(newValue)) {
							grid.api.pagination.goto(newValue);
						}
					}
				});
			}
		};
	}]);
})();

(function() {
	'use strict';

	var module = angular.module('aui.grid');
	module.factory('GridPagination', ['GridUtil', '$q', '$compile', '$parse', '$timeout', function(GridUtil) {
		var GridPagination = function(grid) {
			this.grid = grid;
			this.model = grid.model;
			this.init();
		};
		var hitch = GridUtil.hitch;
		var proto = {
			rowMixin: {
				getPage: function(){
					// summary:
					//		Get the page index this row belongs to.
					return this.grid.pagination.pageOfIndex(this.index());
				},

				indexInPage: function(){
					// summary:
					//		Get the index of this row in its page.
					return this.grid.pagination.indexInPage(this.index());
				}
			},

			preload: function(){
				this.grid.view.paging = true;
			},

			init: function(){
				var t = this,
					finish = function(){
						t._updateBody(1);
						// t.connect(t.model, 'onSizeChange', '_onSizeChange');
						// t.loaded.callback();
					};

				this._pageSize = this.grid.paginationPageSize = this.grid.getOption('paginationPageSize') > 0 ? this.grid.getOption('paginationPageSize') : 5;
				this._page = this.grid.currentPage = this.grid.getOption('startPage');

				this.grid.registerApi('pagination', 'goto', hitch(this, this.goto));
				this.grid.registerApi('pagination', 'previous', hitch(this, this.previous));
				this.grid.registerApi('pagination', 'next', hitch(this, this.next));
				this.grid.registerApi('pagination', 'pageCount', hitch(this, this.pageCount));
				this.grid.registerApi('pagination', 'setPageSize', hitch(this, this.setPageSize));

				// grid.currentPage = this.currentPage;
				this.grid.model.when({}).then(finish, finish);

			},

			// [Public API] --------------------------------------------------------
			// GET functions
			pageSize: function(){
				var s = this._pageSize;
				return s > 0 ? s : this.model.size();
			},

			isAll: function(){
				return this._pageSize === 0;
			},

			pageCount: function(){
				return this.isAll() ? 1 : Math.max(Math.ceil(this.model.size() / this.pageSize()), 1);	//Integer
			},

			currentPage: function(){
				return this._page;
			},

			firstIndexInPage: function(page){
				if(!page && page !== 0){
					page = this._page;
				}else if(!(page >= 0)){
					return -1;	//Integer
				}
				var index = (page - 1) * this.pageSize();
				return index < this.model.size() ? index : -1;
			},

			lastIndexInPage: function(page){
				var t = this,
					firstIndex = t.firstIndexInPage(page);
				if(firstIndex >= 0){
					var lastIndex = firstIndex + parseInt(t.pageSize(), 10) - 1,
						size = t.model.size();
					return lastIndex < size ? lastIndex : size - 1;
				}
				return -1;
			},

			pageOfIndex: function(index){
				return this.isAll() ? 0 : (Math.floor(index / this.pageSize()) + 1);
			},

			indexInPage: function(index){
				return this.isAll() ? index : index % this.pageSize();
			},

			filterIndexesInPage: function(indexes, page){
				var first = this.firstIndexInPage(page),
					end = this.lastIndexInPage(page);
				return first < 0 ? [] : array.filter(indexes, function(index){
					return index >= first && index <= end;
				});
			},

			//SET functions
			goto: function(page){
				var t = this, oldPage = t._page;
				if(page != oldPage && t.firstIndexInPage(page) >= 0){
					t.grid.currentPage = t._page = page;
					t._updateBody();
					t.onSwitchPage(page, oldPage);
				}
			},

			previous: function() {
				this.goto(this._page - 1);
			},

			next: function() {
				this.goto(this._page + 1);
			},

			setPageSize: function(size) {
				var t = this, oldSize = t._pageSize;
				if (size != oldSize && size >= 0) {
					var index = t.firstIndexInPage(),
						oldPage = -1;
					t._pageSize = size;
					if (t._page > t.pageCount()) {
						oldPage = t._page;
						t._page = t.grid.currentPage = t.pageOfIndex(index);
					}
					t._updateBody();
					t.onChangePageSize(size, oldSize);
					if (oldPage >= 0) {
						t.onSwitchPage(t._page, oldPage);
					}
				}
			},

			// [Events] ----------------------------------------------------------------
			onSwitchPage: function(/*currentPage, originalPage*/){},

			onChangePageSize: function(/*currentSize, originalSize*/){},
			
			// [Private] -------------------------------------------------------
			_page: 0,

			_pageSize: 10,

			_updateBody: function(noRefresh){
				var t = this,
					size = t.model.size(),
					count = t.pageSize(),
					start = t.firstIndexInPage();
				if(size === 0 || start < 0){
					start = 0;
					count = 0;
				}else if(size - start < count){
					count = size - start;
				}
				t.grid.view.updateRootRange(start, count, 1);
				if(!noRefresh){
					// t.grid.body.lazyRefresh();
					t.grid.body.render();
				}
			},

			_onSizeChange: function(size){
				var t = this;
				if(size === 0){
					t._page = 0;
					t.grid.view.updateRootRange(0, 0);
				}else{
					var first = t.firstIndexInPage();
					if(first < 0 && t._page !== 0){
						var oldPage = t._page;
						t._page = 0;
						t.onSwitchPage(0, oldPage);
					}
					t._updateBody();
				}
			}
		};

		GridUtil.mixin(GridPagination.prototype, proto);

		return GridPagination;
	}]);

	module.directive('auiGridPagination', ['GridPagination', '$compile', function(GridPagination, $compile) {
		return {
			strict: 'A',
			require: ['^auiGrid'],
			// replace: true,
			// transclude: true,
			// controller: 'auiGridController',
			link: function($scope, $elem, $attrs, $controller) {
				var gridCtrl = $controller[0];
				var grid = $scope.grid = gridCtrl.grid;
				grid.pagination = new GridPagination(grid);
				grid.paging = true;

				var pager = angular.element("<div aui-grid-pagination-bar></div>");
				$elem.append(pager);
				$compile(pager)($scope);
				// GridPaginationService.init($scope.grid);
			}
		};
	}]);
})();

(function() {
	'use strict';

	var module = angular.module('aui.grid');
	module.directive('auiGridRow', ['GridUtil', function(GridUtil) {
		return {
			templateUrl: 'aui-grid/aui-grid-row',
			replace: true,
			require: ['^auiGrid'],
			scope: {
				row: '='
			},
			// transclude: true,
			link: function($scope, $elem, $attrs, controllers) {
				var gridCtrl = controllers[0],
					grid,
					temp;

				$scope.grid = gridCtrl.grid;
				$scope.columns = $scope.grid._columns;
				$scope.domNode = $elem[0];
				$scope.innerNode = $scope.domNode.querySelectorAll('.gridxHeaderRowInner')[0];
				$scope.headerCells = [];
				// var $colMenu 
				grid = $scope.grid;

				$scope.$on('onRowRender', function() {
					if ($scope.$parent.$last) {
						$scope.$emit('onBodyRender');
					}
				});

				$elem.on('mouseenter', function() {
					$elem.addClass('gridxRowOver');
				});
				$elem.on('mouseleave', function() {
					$elem.removeClass('gridxRowOver');
				})
			}
		};
	}]);
})();

(function() {
	'use strict';
	
	var module = angular.module('aui.grid');
	module.factory('GridSortService', ['GridUtil', function(GridUtil) {
		var hitch = GridUtil.hitch;

		var service = {
			init: function(grid) {
				grid.registerApi('sort', 'sort', hitch(this, this.sort, grid));
			},

			sort: function(grid, option) {
				var field = option.field;
				grid.options.data.sort(function(a, b) {
					a = a[field];
					b = b[field];
					if (a > b) return 1;
					if (a == b) return 0;
					if (a < b) return -1;
				});
			}
		};

		return service;
	}]);
	module.directive('auiGridSort', ['GridSortService', function(GridSortService) {
		return {
			strict: 'A',
			require: ['^auiGrid'],
			// replace: true,
			// transclude: true,
			// controller: 'auiGridController',
			link: function($scope, $elem, $attrs, $controller) {
				var gridCtrl = $controller[0];
				var grid = $scope.grid = gridCtrl.grid;

				GridSortService.init(grid);
			}
		};
	}]);
})();

(function() {
	'use strict';

	var module = angular.module('aui.grid');

	module.controller('auiGridController',
		['$scope', '$element', '$attrs', 'Grid', 'GridBody', 'GridView', 'GridUtil',
		function ($scope, $element, $attrs, Grid, GridBody, GridView, GridUtil) {
			var grid;
			window.grid = $scope.grid = new Grid($scope.auiGrid);
			grid = this.grid = $scope.grid;
			grid.body = new GridBody('basic', grid);
			grid.view = new GridView(grid);

			var dataWatchDestroy= $scope.$parent.$watchCollection(function() { return $scope.auiGrid.data; }, dataWatchFunction);
			var columnWatchDestroy = $scope.$parent.$watchCollection(function(){ return $scope.auiGrid.columnStructs; }, columnWatchFunction);

			function dataWatchFunction(newData) {
				newData = newData || [];
				grid.setData(newData);
				grid.model.when({}, function() {
					var size = grid.model.size(),
						pageSize = grid.getOption('paginationPageSize'),
						startPage = grid.getOption('startPage'),
						firstIndex = 0;

					pageSize = pageSize > 0 ? pageSize : size;
					firstIndex = pageSize * (startPage - 1);
					try {
						grid.view.updateRootRange(firstIndex, pageSize);
					} catch (e) {
						console.log(e);
					}
					grid.refresh();
				});
				console.log('in data watch function;');
			}

			function columnWatchFunction(nv, ov) {
				grid.setColumns(nv);
				grid.publish('columnChange');
				console.log('in column watch function');
			}
		}]);

	module.directive('auiGrid', ['GridUtil', function(GridUtil) {
		return {
			templateUrl: 'aui-grid/aui-grid',
			scope: {
				auiGrid: '=',
				getExternalScopes: '&?externalScopes' //optional functionwrapper around any needed external scope instances
			},
			replace: true,
			// transclude: true,
			controller: 'auiGridController',
			link: function($scope, $elem) {
				// debugger;
				var grid = $scope.grid;

				if (GridUtil.isFunction($scope.auiGrid.onRegisterApi)) {
					$scope.auiGrid.onRegisterApi(grid.api);
				}
			}
		};
	}]);
})();

(function(){
	
angular.module('aui.grid')
.factory('Grid', ['$q', '$compile', '$parse', '$timeout', 'GridCore', 'GridOption',
	function($q, $compile, $parse, $timeout, GridCore, GridOption) {
		var dummyFunc = function(){};
		var version = {
			// summary:
			//		Version number
			// description:
			//		Hash about the version, including
			//
			//		- major: Integer: Major version. If total version is "1.2.0beta1", will be 1
			//		- minor: Integer: Minor version. If total version is "1.2.0beta1", will be 2
			//		- patch: Integer: Patch version. If total version is "1.2.0beta1", will be 0
			//		- flag: String: Descriptor flag. If total version is "1.2.0beta1", will be "beta1"
			//		- revision: Number: The Git rev from which dojo was pulled
			major: 0,
			minor: 0,
			patch: 1,
			flag: "",
			toString: function() {
				return this.major + "." + this.minor + "." + this.patch + this.flag;
			}
		};
		var Grid = function Grid(options){
			var t = this;
			this.name = 'aui gridx';
			this.isIE = false;
			this.options = options;
			this.hasVScroller = false;
			this.hasHScroller = false;
			this.api = {};		//GridApi
			this._options = new GridOption(options);
			this.enableRowHoverEffect = this.getOption('enableRowHoverEffect');
			// console.log('childField', this.getOption('childField'));
			// console.log('emptyInfo', this.getOption('emptyInfo'));
			this.postCreate();
			this.subscribe(['clearSort'], function() {
				t.model.clearCache();
				t.model.when({}).then(function() {
					t.refresh();
				});
			});
		};


		Grid.prototype = GridCore.prototype;

		Grid.prototype.version = version;

		Grid.prototype.hasVScroller = false;

		Grid.prototype.hasHScroller = false;

		Grid.prototype.enableRowHoverEffect = true;

		Grid.prototype.getOption = function(name) {
			return this._options.getOption(name);
		};

		Grid.prototype._setTextDirAttr = function(textDir){
			// summary:
			//		 Seamlessly changes grid 'textDir' property on the fly.
			// textDir:
			//		Grid text direction
			if(this.textDir != textDir){
				this.textDir = textDir;
				this.header.refresh();
				if(this.edit){
					this.edit._initAlwaysEdit();
				}
				this.body.refresh();
			}
		},

		Grid.prototype.refresh = function() {
			// debugger;
			this.body.render();
			this.publish('refresh');
		};

		Grid.prototype.getTextDir = function(colId, text){
			var col = this._columnsById[colId],
				textDir = (col && col.textDir) || this.textDir;
			return textDir = (textDir === "auto") ? _BidiSupport.prototype._checkContextual(text) : textDir;
		};

		Grid.prototype.getTextDirStyle = function(colId, text){
			var textDir = this.getTextDir(colId, text);
			return textDir ? " direction:" + textDir + ";" : "";
		};

		Grid.prototype.enforceTextDirWithUcc = function(colId, text){
			var textDir = this.getTextDir(colId, text);
			//var LRE = '\u202A', RLE = '\u202B', PDF = '\u202C';
			return textDir ? (textDir === "rtl" ? '\u202B' : '\u202A') + text + '\u202C' : text;
		},
		//textDir bidi support end

		Grid.prototype.coreModules = [];

		Grid.prototype.coreExtensions = [
			//Put default extensions here!
			// Query
		],
	
		Grid.prototype.postCreate = function() {
			// summary:
			//		Override to initialize grid modules
			// tags:
			//		protected extension
			var t = this;
			// if(t.touch){
			// 	domClass.add(t.domNode, 'gridxTouch');
			// }else{
			// 	domClass.add(t.domNode, 'gridxDesktop');
			// }
			// if(!t.isLeftToRight()){
			// 	domClass.add(t.domNode, 'gridxRtl');
			// }
			// if(t.summary){
			// 	t.domNode.setAttribute('summary', t.summary);
			// }
			//in case gridx is not a root level package, it should still work
			// t.nls = i18n.getLocalization('gridx', 'gridx', t.lang) || nls;
			t._eventFlags = {};
			t.modules = t.coreModules.concat(t.modules || []);
			t.modelExtensions = t.coreExtensions.concat(t.modelExtensions || []);
			// t.lastFocusNode.setAttribute('tabIndex', t.domNode.getAttribute('tabIndex'));
			t._initEvents(t._compNames, t._eventNames);
			t._init();
			//resize the grid when zoomed in/out.
			// t.connect(metrics, 'onFontResize', function(){
			// 	t.resize();
			// });
		},
	
		Grid.prototype.destroy = function(){
			// summary:
			//		Destroy this grid widget
			// tags:
			//		public extension
			// this._uninit();
			// this.inherited(arguments);
		},

		Grid.prototype.sort = function(options) {
			var t = this,
				columns = t._columnsById;

			t._columns.forEach(function(col) {
				col.sorting = 0;
			});
			options.forEach(function(opt) {
				t._columnsById[opt.colId].sorting = opt.descending ? -1 : 1;
			});

			this.model.sort(options, t).then(function() {
				console.log('%csort finished', 'color:green');
				t.refresh();
				t.publish('sort');
			});
		},
	/*=====
		// autoHeight: Boolean
		//		If true, the grid's height is determined by the total height of the rows in current body view,
		//		so that there will never be vertical scroller bar. And when scrolling the mouse wheel over grid body,
		//		the whole page will be scrolled. Note if this is false, only the grid body will be scrolled.
		autoHeight: false,
		// autoWidth: Boolean
		//		If true, the grid's width is determined by the total width of the columns, so that there will
		//		never be horizontal scroller bar.
		autoWidth: false,
		// summary: String
		//
		//
		summary: '',
		// touch: Boolean
		//		Whether grid is run in touch environment
		//		If undefined, automatically set to true on mobile devices (like ios or android)
		//touch: undefined,
	=====*/

		Grid.prototype.resize = function(changeSize){
			// summary:
			//		Resize the grid using given width and height.
			// tags:
			//		public
			// changeSize: Object?
			//		An object like {w: ..., h: ...}.
			//		If omitted, the grid will re-layout itself in current width/height.
			var t = this, ds = {};
			if(changeSize){
				if(t.autoWidth){
					changeSize.w = undefined;
				}
				if(t.autoHeight){
					changeSize.h = undefined;
				}
				domGeometry.setMarginBox(t.domNode, changeSize);
			}
			t._onResizeBegin(changeSize, ds);
			t._onResizeEnd(changeSize, ds);
		},

		//Private-------------------------------------------------------------------------------
		Grid.prototype._onResizeBegin = function(){},
		Grid.prototype._onResizeEnd = function(){},

		Grid.prototype._escapeId = function(id){
			return String(id).replace(/\\/g, "\\\\").replace(/\"/g, "\\\"").replace(/\'/g, "\\\'");
		},

		Grid.prototype._encodeHTML = function(id){
			return String(id).replace(/\"/g, "&quot;");
		},

		//event handling begin
		Grid.prototype._compNames =['Cell', 'HeaderCell', 'Row', 'Header'],
	
		Grid.prototype._eventNames = [
			'TouchStart', 'TouchEnd',
			'Click', 'DblClick',
			'MouseDown', 'MouseUp', 
			'MouseOver', 'MouseOut', 
			'MouseMove', 'ContextMenu',
			'KeyDown', 'KeyPress', 'KeyUp'
		],
	
		Grid.prototype._initEvents = function(objNames, evtNames){
			var i = 0, j, comp, evt, evtName;
			while(comp = objNames[i++]){
				for(j = 0; evt = evtNames[j++];){
					evtName = 'on' + comp + evt;
					this[evtName] = this[evtName] || dummyFunc;
				}
			}
		};

		Grid.prototype._connectEvents = function(node, connector, scope){
			for(var t = this,
					m = t.model,
					eventName,
					eventNames = t._eventNames,
					len = eventNames.length,
					i = 0; i < len; ++i){
				eventName = eventNames[i];
				m._cnnts.push(on(node, eventName.toLowerCase(), lang.hitch(scope, connector, eventName)));
			}
		};
	
		Grid.prototype._isConnected = function(eventName){
			return this[eventName] !== dummyFunc;
		};
		//event handling end

		Grid.prototype._isCtrlKey = function(evt){
			// summary:
			//		On Mac Ctrl+click also opens a context menu. So call this to check ctrlKey instead of directly call evt.ctrlKey
			//		if you need to implement some handler for Ctrl+click.
			return has('mac') ? evt.metaKey : evt.ctrlKey;
		};

		return Grid;
	}]);
})();

(function(){

angular.module('aui.grid')
.factory('GridBody', ['$q', 'GridRow',
		function($q, GridRow) {
/*=====
	Row.node = function(){
		// summary:
		//		Get the dom node of this row.
		// returns:
		//		DOMNode|null
	};

	Cell.node = function(){
		// summary:
		//		Get the dom node of this cell.
		// returns:
		//		DOMNode|null
	};

	Cell.contentNode = function(){
		// summary:
		//		Get the dom node in this cell that actually contains data.
		//		This function is useful if some modules (e.g. Tree) wraps cell data with some extra html.
		// returns:
		//		DOMNode|null
	};

	var Body = declare(_Module, {
		// summary:
		//		module name: body.
		//		The body UI of grid.
		// description:
		//		This module is in charge of row rendering. It should be compatible with virtual/non-virtual scroll, 
		//		pagination, details on demand, and even tree structure.

		// loadingInfo: String
		//		The loading message shown in grid body. Default to use nls files.
		loadingInfo: '',

		// emptyInfo: String
		//		The message shown in grid body when there's no row to show. Default to use nls files.
		emptyInfo: '',

		// loadFailInfo: String
		//		The error message shown in grid body when there's some error orrured during loading. Default to use nls files.
		loadFailInfo: '',

		// rowHoverEffect: Boolean
		//		Whether to show a visual effect when mouse hovering a row.
		rowHoverEffect: true,

		// renderedIds: Object
		//		This object contains the current renderred rows Ids.
		//		For grid not using virtualVSroller, this is equal to current row ids in the grid body.
		renderedIds: {},
		// stuffEmptyCell: Boolean
		//		Whether to stuff a cell with &nbsp; if it is empty.
		stuffEmptyCell: true,

		// renderWholeRowOnSet: Boolean
		//		If true, the whole row will be re-rendered even if only one field has changed.
		//		Default to false, so that only one cell will be re-rendered editing that cell.
		renderWholeRowOnSet: false,

		// compareOnSet: Function
		//		When data is changed in store, compare the old data and the new data of grid, return true if
		//		they are the same, false if not, so that the body can decide whether to refresh the corresponding cell.
		compareOnSet: function(v1, v2){},

		getRowNode: function(args){
			// summary:
			//		Get the DOM node of a row
			// args: View.__RowInfo
			//		A row info object containing row index or row id
			// returns:
			//		The DOM node of the row. Null if not found.
		},

		getCellNode: function(args){
			// summary:
			//		Get the DOM node of a cell
			// args: View.__CellInfo
			//		A cell info object containing sufficient info
			// returns:
			//		The DOM node of the cell. Null if not found.
		},

		refresh: function(start){
			// summary:
			//		Refresh the grid body
			// start: Integer?
			//		The visual row index to start refresh. If omitted, default to 0.
			// returns:
			//		A deferred object indicating when the refreshing process is finished.
		},

		refreshCell: function(rowVisualIndex, columnIndex){
			// summary:
			//		Refresh a single cell
			// rowVisualIndex: Integer
			//		The visual index of the row of this cell
			// columnIndex: Integer
			//		The index of the column of this cell
			// returns:
			//		A deferred object indicating when this refreshing process is finished.
		},

		// renderStart: [readonly] Integer
		//		The visual row index of the first renderred row in the current body
		renderStart: 0,

		// renderCount: [readonly] Integer
		//		The count of renderred rows in the current body.
		renderCount: 0,
	
		// autoUpdate: [private] Boolean
		//		Update grid body automatically when onNew/onSet/onDelete is fired
		autoUpdate: true,

		onAfterRow: function(row){
			// summary:
			//		Fired when a row is created, data is filled in, and its node is inserted into the dom tree.
			// row: gridx.core.Row
			//		A row object representing this row.
		},
		
		onRowHeightChange: function(row){
			// summary:
			//		Fired when a row node's height is changed.
			//		This is different from onAfterRow since the row node is already there but the style/height is changed.
			//
			// row: gridx.core.Row | rowId
			//		A row object representing this row or rowId.
		},

		onAfterCell: function(cell){
			// summary:
			//		Fired when a cell is updated by cell editor (or store data change), or by cell refreshing.
			//		Note this is not fired when rendering the whole grid. Use onAfterRow in that case.
			// cell: grid.core.Cell
			//		A cell object representing this cell
		},

		onRender: function(start, count, flag){
			// summary:
			//		Fired everytime the grid body content is rendered or updated.
			// start: Integer
			//		The visual index of the start row that is affected by this rendering. If omitted, all rows are affected.
			// flag: Object
			//		Some info can be carried by the flag attribute.
			// count: Integer
			//		The count of rows that is affected by this rendering. If omitted, all rows from start are affected.
		},

		onUnrender: function(){
			// summary:
			//		Fired when a row is unrendered (removed from the grid dom tree).
			//		Usually, this event is only useful when using virtual scrolling.
			// id: String|Number
			//		The ID of the row that is unrendered.
		},

		onCheckCustomRow: function(row, output){
			// summary:
			//		Fired before creating every row, giving user a chance to customize the entire row.
			// row: grid.core.Row
			//		A row object representing this row
			// output: Object
			//		If the given row should be customized, set output[row.id] to truthy.
		},

		onBuildCustomRow: function(row, output){
			// summary:
			//		Fired if onCheckCustomRow decides to customize this row.
			// row: grid.core.Row
			//		A row object representing this row
			// output: Object
			//		Set output[row.id] = some html string to render the row.
		},

		onDelete: function(){
			// summary:
			//		Fired when a row in current view is deleted from the store.
			//		Note if the deleted row is not visible in current view, this event will not fire.
			// id: String|Number
			//		The ID of the deleted row.
			// index: Integer
			//		The index of the deleted row.
		},

		onSet: function(row){
			// summary:
			//		Fired when a row in current view is updated in store.
			// row: gridx.core.Row
			//		A row object representing the updated row.
		},

		onMoveToCell: function(){
			// summary:
			//		Fired when the focus is moved to a body cell by keyboard.
			// tags:
			//		private
		},

		onEmpty: function(){
			// summary:
			//		Fired when there's no rows in current body view.
		},

		onLoadFail: function(){
			// summary:
			//		Fire when there's an error occured when loading data.
		},

		onForcedScroll: function(){
			// summary:
			//		Fired when the body needs to fetch more data, but there's no trigger to the scroller.
			//		This is an inner mechanism to solve some problems when using virtual scrolling or pagination.
			//		This event should not be used by grid users.
			// tags:
			//		private
		},

		collectCellWrapper: function(){
			// summary:
			//		Fired when a cell is being rendered, so as to collect wrappers for the content in this cell.
			//		This is currently an inner mechanism used to implement widgets in cell and tree node.
			// tags:
			//		private
			// wrappers: Array
			//		An array of functions with signature function(cellData, rowId, colId) and should return a string to replace
			//		cell data. The connectors of this event should push a new wrapper function in this array.
			//		The functions in this array can also carry a number typed "priority" property.
			//		The wrappers will be executed in ascending order of this "priority" function.
			// rowId: String|Number
			//		The row ID of this cell
			// colId: String|Number
			//		The column ID of this cell.
		}
	});

	return Body;
=====*/
		function GridBody(id, grid) {
			var t = this,
				g = t.grid;
				// dn = t.domNode = g.bodyNode;
			t.id = id;
			t.grid = grid;
			t.emptyMessage = grid.options.loadingInfo || 'there is no data.';
			t._cellCls = {};
			t.renderedIds = {};
			t.renderedRows = [];

			// if(t.arg('rowHoverEffect')){
			// 	domClass.add(dn, 'gridxBodyRowHoverEffect');
			// }
			// g.emptyNode.innerHTML = t.arg('loadingInfo', g.nls.loadingInfo);
			// g._connectEvents(dn, '_onEvent', t);
			// t.aspect(t.model, 'onDelete', '_onDelete');
			// t.aspect(t.model, 'onSet', '_onSet');
			// if(!g.touch){
			// 	t.aspect(g, 'onRowMouseOver', '_onRowMouseOver');
			// 	t.connect(g.mainNode, 'onmouseleave', function(){
			// 		query('> .gridxRowOver', t.domNode).removeClass('gridxRowOver');
			// 	});
			// 	t.connect(g.mainNode, 'onmouseover', function(e){
			// 		if(e.target == g.bodyNode){
			// 			query('> .gridxRowOver', t.domNode).removeClass('gridxRowOver');
			// 		}
			// 	});
			// }
			// t.aspect(g.model, 'setStore', function(){
			// 	t.refresh();
			// });
		}

		GridBody.prototype = {
			name: "body",

			forced: ['view'],

			constructor: function(){
			},

			preload: function(){
				this._initFocus();
			},

			load: function(args){
				var t = this,
					view = t.grid.view;
				t.aspect(view, 'onUpdate', 'lazyRefresh');
				if(view._err){
					t._loadFail(view._err);
				}
				t.loaded.callback();
			},

			destroy: function(){
				this.inherited(arguments);
				this.domNode.innerHTML = '';
				this._destroyed = true;
			},

			rowMixin: {
				node: function(){
					return this.grid.body.getRowNode({
						rowId: this.id
					});
				}
			},

			cellMixin: {
				node: function(){
					return this.grid.body.getCellNode({
						rowId: this.row.id,
						colId: this.column.id
					});
				},
				contentNode: function(){
					var node = this.node();
					return node && query('.gridxCellContent', node)[0] || node;
				}
			},

			rowHoverEffect: true,

			stuffEmptyCell: true,

			renderWholeRowOnSet: false,

			renderStart: 0,

			renderCount: 0,

			autoUpdate: true,

			renderedIds: {},

			render: function() {
				var g = this.grid,
					size = g.model.size(), i = 0,
					rr = this.renderedRows,
					cache = g.model._cache._cache, rowInfo;

				g.view.updateVisualCount().then(function(){
					rr.splice(0, rr.length);
					for (i = 0; i < grid.view.visualCount; i++) {
						rowInfo = g.view.getRowInfo({visualIndex: i});

						if (rowInfo) {
							rr.push(new GridRow(rowInfo.rowId, this.grid));
						}
					}
				});
			},

			compareOnSet: function(v1, v2){
				return typeof v1 == 'object' && typeof v2 == 'object' ?
					json.toJson(v1) == json.toJson(v2) :
					v1 === v2;
			},

			addClass: function(rowId, colId, cls){
				var cellCls = this._cellCls,
					r = cellCls[rowId] = cellCls[rowId] || {},
					c = r[colId] = r[colId] || [];
				if(array.indexOf(c, cls) < 0){
					c.push(cls);
					domClass.add(this.getCellNode({
						rowId: rowId,
						colId: colId
					}), cls);
				}
			},

			removeClass: function(rowId, colId, cls){
				var cellCls = this._cellCls,
					r = cellCls[rowId],
					c = r && r[colId],
					idx = c && array.indexOf(c, cls);
				if(idx >= 0){
					c.splice(idx, 1);
					domClass.remove(this.getCellNode({
						rowId: rowId,
						colId: colId
					}), cls);
				}
			},

			getRowNode: function(args){
				//FIX ME: has('ie')is not working under IE 11
				//use has('trident') here to judget IE 11
				if(this.model.isId(args.rowId) && (has('ie') || has('trident'))){
					return this._getRowNode(args.rowId);
				}else{
					var rowQuery = this._getRowNodeQuery(args);
					return rowQuery && query('> ' + rowQuery, this.domNode)[0] || null;	//DOMNode|null
				}
			},

			getCellNode: function(args){
				var t = this,
					colId = args.colId,
					cols = t.grid._columns,
					r = t._getRowNodeQuery(args);
				if(r){
					if(!colId && cols[args.colIndex]){
						colId = cols[args.colIndex].id;
					}
					var c = " [colid='" + colId + "'].gridxCell";
					//FIX ME: has('ie')is not working under IE 11
					//use has('trident') here to judget IE 11
					if(t.model.isId(args.rowId) && (has('ie') || has('trident'))){
						var rowNode = t._getRowNode(args.rowId);
						return rowNode && query(c, rowNode)[0] || null;
					}else{
						return query(r + c, t.domNode)[0] || null;
					}
				}
				return null;
			},

			refresh: function(start){
				var t = this,
					loadingNode = t.grid.loadingNode,
					d = new Deferred();
				delete t._err;
				clearTimeout(t._sizeChangeHandler);
				domClass.toggle(t.domNode, 'gridxBodyRowHoverEffect', t.arg('rowHoverEffect'));

				// cache visual ids
				// t.renderedIds = {};
				
				// domClass.add(loadingNode, 'gridxLoading');
				t._showLoadingMask();
				t.grid.view.updateVisualCount().then(function(){
					try{
						var rs = t.renderStart,
							rc = t.renderCount,
							vc = t.grid.view.visualCount;
						if(rs + rc > vc){
							if(rc < vc){
								rs = t.renderStart = vc - rc;
							}else{
								rs = t.renderStart = 0;
								rc = vc;
							}
						}
						if(typeof start == 'number' && start >= 0){
							start = rs > start ? rs : start;
							var count = rs + rc - start,
								n = query('> [visualindex="' + start + '"]', t.domNode)[0],
								uncachedRows = [],
								renderedRows = [];
							if(n){
								var rows = t._buildRows(start, count, uncachedRows, renderedRows);
								if(rows){
									domConstruct.place(rows, n, 'before');
								}
							}
							var rowIds = {};
							array.forEach(renderedRows, function(row){
								rowIds[row.id] = 1;
							});
							while(n){
								var tmp = n.nextSibling,
									id = n.getAttribute('rowid');
								if(!rowIds[id]){
									//Unrender this row only when it is not being rendered now.
									//Set a special flag so that RowHeader won't destroy its nodes.
									//FIXME: this is ugly...
									t.onUnrender(id, 'refresh');
									t.renderedIds[id] = undefined;
								}
								domConstruct.destroy(n);
								// t.renderedIds[id] = undefined;
								n = tmp;
							}
							array.forEach(renderedRows, t.onAfterRow, t);
							Deferred.when(t._buildUncachedRows(uncachedRows), function(){
								t.onRender(start, count);
								t.onForcedScroll();
								// domClass.remove(loadingNode, 'gridxLoading');
								t._hideLoadingMask();
								d.callback();
							});
						}else{
							t.renderRows(rs, rc, 0, 1);
							t.onForcedScroll();
							// t._hideLoadingMask();
							// domClass.remove(loadingNode, 'gridxLoading');
							d.callback();
						}
					}catch(e){
						t._loadFail(e);
						// domClass.remove(loadingNode, 'gridxLoading');
						t._hideLoadingMask();
						d.errback(e);
					}
				}, function(e){
					t._loadFail(e);
					// domClass.remove(loadingNode, 'gridxLoading');
					t._hideLoadingMask();
					d.errback(e);
				});
				return d;
			},

			refreshCell: function(rowVisualIndex, columnIndex){
				var d = new Deferred(),
					t = this,
					m = t.model,
					g = t.grid,
					col = g._columns[columnIndex],
					cellNode = col && t.getCellNode({
						visualIndex: rowVisualIndex,
						colId: col.id
					});
				if(cellNode){
					var rowCache,
						rowInfo = g.view.getRowInfo({visualIndex: rowVisualIndex}),
						idx = rowInfo.rowIndex,
						pid = rowInfo.parentId;
					m.when({
						start: idx,
						count: 1,
						parentId: pid
					}, function(){
						rowCache = m.byIndex(idx, pid);
						if(rowCache){
							rowInfo.rowId = m.indexToId(idx, pid);
							var cell = g.cell(rowInfo.rowId, col.id, 1),
								isPadding = g.tree && g.tree.isPaddingCell(rowInfo.rowId, col.id);
							cellNode.innerHTML = t._buildCellContent(col, rowInfo.rowId, cell, rowVisualIndex, isPadding);
							t.onAfterCell(cell);
						}
					}).then(function(){
						d.callback(!!rowCache);
					});
					return d;
				}
				d.callback(false);
				return d;
			},

			lazyRefresh: function(){
				var t = this;
				clearTimeout(t._sizeChangeHandler);
				t._sizeChangeHandler = setTimeout(function(){
					if(!t._destroyed){
						t.refresh();
					}
				}, 10);
			},

			renderRows: function(start, count, position/*?top|bottom*/, isRefresh){
				var t = this,
					g = t.grid,
					str = '',
					uncachedRows = [], 
					renderedRows = [],
					n = t.domNode,
					en = g.emptyNode,
					emptyInfo = t.arg('emptyInfo', g.nls.emptyInfo),
					finalInfo = '';
				if(t._err){
					return;
				}
				if(count > 0){
					// en.innerHTML = t.arg('loadingInfo', g.nls.loadingInfo);
					// en.style.zIndex = '';
					if(position != 'top' && position != 'bottom'){
						t.model.free();
					}
					if(position == 'top'){
						str = t._buildRows(start, count, uncachedRows, renderedRows);
						t.renderCount += t.renderStart - start;
						t.renderStart = start;
						domConstruct.place(str, n, 'first');
						//unrender out-of-range rows immediately, so that CellWidget can reuse the widgets.
						//FIXME: need a better solution here!
						if(g.cellWidget && g.vScroller._updateRowHeight){
							var oldEnd = t.renderStart + t.renderCount,
								postCount = g.vScroller._updateRowHeight('post');
							if(oldEnd - postCount < start + count){
								count = oldEnd - postCount - start;
							}
						}
					}else if(position == 'bottom'){
						str = t._buildRows(start, count, uncachedRows, renderedRows);
						t.renderCount = start + count - t.renderStart;
						domConstruct.place(str, n, 'last');
						//unrender out-of-range rows immediately, so that CellWidget can reuse the widgets.
						//FIXME: need a better solution here!
						if(g.cellWidget && g.vScroller._updateRowHeight){
							g.vScroller._updateRowHeight('pre');
							if(t.renderStart > start){
								start = t.renderStart;
								count = t.renderCount;
							}
						}
					}else{
						t.renderStart = start;
						t.renderCount = count;
						//If is refresh, try to maintain the scroll top
						var scrollTop = isRefresh ? n.scrollTop : 0;
						//unrender before destroy nodes, so that other modules have a chance to detach nodes.
						if(!t._skipUnrender){
							//only when we do have something to unrender
							t.onUnrender();
						}
						// while(n.firstChild){
						// 	id = n.firstChild.getAttribute('rowid');
						// 	n.removeChild(n.firstChild);
						// 	if(g.model.isId(id)){
						// 		t.renderedIds[id] = undefined;
						// 	}
						// }
						// reset renderedIds since all rows in body are destroyed
						t.renderedIds = {};
						str = t._buildRows(start, count, uncachedRows, renderedRows);
						n.innerHTML = str;
						n.scrollTop = scrollTop;
						n.scrollLeft = g.hScrollerNode.scrollLeft;
						finalInfo = str ? "" : emptyInfo;
						if(!str){
							en.style.zIndex = 1;
						}
					}
					array.forEach(renderedRows, t.onAfterRow, t);
					Deferred.when(t._buildUncachedRows(uncachedRows), function(){
						if(!t._err){
							en.innerHTML = finalInfo;
						}
						t._hideLoadingMask();
						t.onRender(start, count);
					});
				}else if(!{top: 1, bottom: 1}[position]){
					var id  = 0;
					n.scrollTop = 0;
					//unrender before destroy nodes, so that other modules have a chance to detach nodes.
					if(!t._skipUnrender){
						//only when we do have something to unrender
						t.onUnrender();
					}
					while(n.firstChild){
						id = n.firstChild.getAttribute('rowid');
						n.removeChild(n.firstChild);
					}
					//reset renderedIds since all rows in body are destroyed.
					t.renderedIds = {};
					en.innerHTML = emptyInfo;
					en.style.zIndex = 1;
					t._hideLoadingMask();
					t.onEmpty();
					t.model.free();
				}
			},

			unrenderRows: function(count, preOrPost){
				if(count > 0){
					//Just remove the nodes from DOM tree instead of destroying them,
					//in case other logic still needs these nodes.
					var t = this, m = t.model, i = 0, id, bn = t.domNode;
					if(preOrPost == 'post'){
						for(; i < count && bn.lastChild; ++i){
							id = bn.lastChild.getAttribute('rowid');
							if(m.isId(id)){
								m.free(id);
								t.onUnrender(id);
							}else{
								//sometimes, unrendered row has id as null(happens in vv)
								//this will make rowHeader unsync with rows
								//explicitly tell rowHeader to treat this tricky scenerio
								t.onUnrender(id, undefined, 'post');
							}
							domConstruct.destroy(bn.lastChild);
							t.renderedIds[id] = undefined;
						}
					}else{
						var tp = bn.scrollTop;
						for(; i < count && bn.firstChild; ++i){
							id = bn.firstChild.getAttribute('rowid');
							var rh = bn.firstChild.getAttribute("data-rowHeight");
							tp -= rh ? parseInt(rh, 10) : bn.firstChild.offsetHeight;
							if(m.isId(id)){
								m.free(id);
								t.onUnrender(id);
							}else{
								t.onUnrender(id , undefined, 'pre');
							}
							domConstruct.destroy(bn.firstChild);
							t.renderedIds[id] = undefined;
						}
						t.renderStart += i;
						bn.scrollTop = tp > 0 ? tp : 0;
					}
					t.renderCount -= i;
					//Force check cache size
					m.when();
				}
			},

			//Events--------------------------------------------------------------------------------
			onAfterRow: function(){/* row */},

			onRowHeightChange: function(/*id*/){},

			onAfterCell: function(){/* cell */},

			onRender: function(/*start, count, flag*/){
				//FIX #8746
				var bn = this.domNode;
				if(has('ie') < 9 && bn.childNodes.length){
					query('> gridxLastRow', bn).removeClass('gridxLastRow');
					domClass.add(bn.lastChild, 'gridxLastRow');
				}
			},

			onUnrender: function(/* id, refresh, preOrPost*/){},

			onDelete: function(/*id, index*/){},

			onSet: function(/* row */){},

			onMoveToCell: function(){},

			onEmpty: function(){},

			onLoadFail: function(){},

			onForcedScroll: function(){},

			collectCellWrapper: function(/* wrappers, rowId, colId */){},

			//Private---------------------------------------------------------------------------
			_showLoadingMask: function(){
				var t = this,
					g = t.grid,
					ln = g.loadingNode,
					en = g.emptyNode;

				domClass.add(ln, 'gridxLoading');
				en.innerHTML = g.nls.loadingInfo;
				en.style.zIndex = 1;
			},

			_hideLoadingMask: function(){
				var t = this,
					g = t.grid,
					ln = g.loadingNode,
					en = g.emptyNode;

				domClass.remove(ln, 'gridxLoading');
				// en.innerHTML = g.nls.loadingInfo;
				en.style.zIndex = '';
			},

			_getRowNodeQuery: function(args){
				var r, m = this.model, escapeId = this.grid._escapeId;
				if(m.isId(args.rowId)){
					r = "[rowid='" + escapeId(args.rowId) + "']";
				}else if(typeof args.rowIndex == 'number' && args.rowIndex >= 0){
					r = "[rowindex='" + args.rowIndex + "']" + (m.isId(args.parentId) ? "[parentid='" + escapeId(args.parentId) + "']" : '');
				}else if(typeof args.visualIndex == 'number' && args.visualIndex >= 0){
					r = "[visualindex='" + args.visualIndex + "']";
				}
				return r && r + '.gridxRow';
			},

			_getRowNode: function(id){
				//TODO: this should be resolved in dojo.query!
				//In IE, some special ids (with special charactors in it, e.g. "+") can not be queried out.
				for(var i = 0, rows = this.domNode.childNodes, row; row = rows[i]; ++i){
					if(row.getAttribute('rowid') == id){
						return row;
					}
				}
				return null;
			},

			_loadFail: function(e){
				console.error(e);
				var en = this.grid.emptyNode;
				en.innerHTML = this.arg('loadFailInfo', this.grid.nls.loadFailInfo);
				en.style.zIndex = 1;
				this.domNode.innerHTML = '';
				this._err = e;
				this.onEmpty();
				this.onLoadFail(e);
			},

			_buildRows: function(start, count, uncachedRows, renderedRows){
				var t = this,
					end = start + count,
					s = [],
					g = t.grid,
					w = t.domNode.scrollWidth,
					columns = g.columns(),
					encode = this.grid._encodeHTML,
					i = start;

				for(; i < end; ++i){
					var rowInfo = g.view.getRowInfo({visualIndex: i}),
						row = g.row(rowInfo.rowId, 1);
					s.push('<div class="gridxRow ', i % 2 ? 'gridxRowOdd' : '',
						'" role="row" visualindex="', i);
					t.renderedIds[rowInfo.rowId] = 1;
					if(row){
						t.model.keep(row.id);
						s.push('" rowid="', encode(row.id),
							'" rowindex="', rowInfo.rowIndex,
							'" parentid="', encode(rowInfo.parentId),
							'">', t._buildCells(row, i, columns),
						'</div>');
						renderedRows.push(row);
					}else{
						s.push('"><div class="gridxRowDummy" style="width:', w, 'px;"></div></div>');
						rowInfo.start = rowInfo.rowIndex;
						rowInfo.count = 1;
						uncachedRows.push(rowInfo);
					}
				}
				return s.join('');
			},

			_buildUncachedRows: function(uncachedRows){
				var t = this;
				return uncachedRows.length && t.model.when(uncachedRows, function(){
					try{
						array.forEach(uncachedRows, t._buildRowContent, t);
					}catch(e){
						t._loadFail(e);
					}
				}).then(null, function(e){
					t._loadFail(e);
				});
			},

			_buildRowContent: function(rowInfo){
				var t = this,
					n = query('> [visualindex="' + rowInfo.visualIndex + '"]', t.domNode)[0];
				if(n){
					var row = t.grid.row(rowInfo.rowIndex, 0, rowInfo.parentId);
					if(row){
						t.model.keep(row.id);
						n.setAttribute('rowid', row.id);
						n.setAttribute('rowindex', rowInfo.rowIndex);
						n.setAttribute('parentid', rowInfo.parentId || '');
						n.innerHTML = t._buildCells(row, rowInfo.visualIndex);
						t.renderedIds[row.id] = 1;
						t.onAfterRow(row);
					}else{
						console.error('Error in Body._buildRowContent: Row is not in cache: ' + rowInfo.rowIndex);
					}
				}
			},

			onCheckCustomRow: function(row, output){},

			onBuildCustomRow: function(row, output){},

			_buildCells: function(row, visualIndex, cols){
				var t = this,
					rowId = row.id,
					sb = ['<table class="gridxRowTable" role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>'],
					output = {};
				t.onCheckCustomRow(row, output);
				if(output[rowId]){
					output = {};
					t.onBuildCustomRow(row, output);
					sb.push('<td class="gridxCustomRow" aria-readonly="true" role="gridcell" tabindex="-1">',
						t._wrapCellData(output[rowId], rowId),
						'</td>');
				}else{
					var g = t.grid,
						isFocusedRow = g.focus.currentArea() == 'body' && t._focusCellRow === visualIndex,
						rowData = t.model.byId(rowId).data,
						columns = g._columns,
						cellCls = t._cellCls[rowId] || {};
					for(var i = 0, len = columns.length; i < len; ++i){
						var col = columns[i],
							colId = col.id,
							colWidth = col.width,
							isPadding = g.tree && g.tree.isPaddingCell(rowId, colId),
							customCls = col['class'],
							cellData = rowData[colId],
							customClsIsFunction = customCls && lang.isFunction(customCls),
							styleIsFunction = col.style && lang.isFunction(col.style),
							needCell = customClsIsFunction || styleIsFunction || (!isPadding && col.decorator),
							cell = needCell && g.cell(row, cols && cols[i] || colId, 1);

						var cellContent = t._buildCellContent(col, rowId, cell, visualIndex, isPadding, cellData),
							testNode = domConstruct.create('div', {innerHTML: cellContent}), isEmpty,
							testNodeInnerText = testNode.innerText,
							testNodeContent = (testNodeInnerText !== undefined && testNodeInnerText !== null) ? testNodeInnerText : testNode.textContent;
							testNodeContent = testNodeContent.trim ? testNodeContent.trim() : testNodeContent.replace(/\s/g, '');
							isEmpty = testNodeContent === '&nbsp;' || !testNodeContent;

						testNode = '';

						sb.push('<td aria-readonly="true" role="gridcell" tabindex="-1" aria-describedby="',
							col._domId,'" colid="', colId, '" class="gridxCell ',
							isFocusedRow && t._focusCellCol === i ? 'gridxCellFocus ' : '',
							isPadding ? 'gridxPaddingCell ' : '',
							col._class || '', ' ',
							(customClsIsFunction ? customCls(cell) : customCls) || '', ' ',
							cellCls[colId] ? cellCls[colId].join(' ') : '',
							' " style="width:', colWidth, ';min-width:', colWidth, ';max-width:', colWidth, ';',
							g.getTextDirStyle(colId, cellData),
							(styleIsFunction ? col.style(cell) : col.style) || '',
							//when cell content is empty, need to add aria-labssel
							isEmpty? '" aria-label="empty cell' : '',
							'">', cellContent,
						'</td>');
					}
				}
				sb.push('</tr></table>');
				return sb.join('');
			},

			_buildCellContent: function(col, rowId, cell, visualIndex, isPadding, cellData){
				var r = '',
					data = cellData === undefined && cell ? cell.data() : cellData;
				if(!isPadding){
					var s = col.decorator ? col.decorator(data, rowId, visualIndex, cell) : data;
					r = this._wrapCellData(s, rowId, col.id);
				}
				return (r === '' || r === null || r === undefined) && (has('ie') < 8 || this.arg('stuffEmptyCell')) ? '&nbsp;' : r;
			},

			_wrapCellData: function(cellData, rowId, colId){
				var wrappers = [];
				this.collectCellWrapper(wrappers, rowId, colId);
				var i = wrappers.length - 1;
				if(i > 0){
					wrappers.sort(function(a, b){
						return (a.priority || 0) - (b.priority || 0);
					});
				}
				for(; i >= 0; --i){
					cellData = wrappers[i].wrap(cellData, rowId, colId);
				}
				return cellData;
			},

			//Events-------------------------------------------------------------
			_onEvent: function(eventName, e){
				var g = this.grid,
					evtCell = 'onCell' + eventName,
					evtRow = 'onRow' + eventName, evtName;

				this._decorateEvent(e);
				if(e.rowId){
					if(e.columnId){
						g[evtCell](e);
						on.emit(e.target, 'cell' + eventName, e);
					}
					g[evtRow](e);
					on.emit(e.target, 'row' + eventName, e);
				}
			},

			_decorateEvent: function(e){
				//clean decorates from bubble
				//need to re-decorate the event when bubbling
				var atrs = ['rowId', 'columnId', 'rowIndex', 'visualIndex', 'columnIndex', 'parentId', 'cellNode'];
				array.forEach(atrs, function(atr){
					if(atr in e){ 
						delete e[atr]; 
					}
				});
				
				var n = e.target || e.originalTarget,
					g = this.grid,
					tag;
				for(; n && n != g.bodyNode; n = n.parentNode){
					tag = n.tagName && n.tagName.toLowerCase();
					if(tag == 'td' && domClass.contains(n, 'gridxCell') && 
						n.parentNode.parentNode.parentNode.parentNode.parentNode === g.bodyNode){
							
						var col = g._columnsById[n.getAttribute('colid')];
						e.cellNode = n;
						e.columnId = col.id;
						e.columnIndex = col.index;
					}
					if(tag == 'div' && domClass.contains(n, 'gridxRow') && n.parentNode === g.bodyNode){
						e.rowId = n.getAttribute('rowid');
						e.parentId = n.getAttribute('parentid');
						e.rowIndex = parseInt(n.getAttribute('rowindex'), 10);
						e.visualIndex = parseInt(n.getAttribute('visualindex'), 10);
					}
					if(tag == 'table' && domClass.contains(n, 'gridxRowTable') && n.parentNode.parentNode === g.bodyNode){
						n = n.parentNode;
						e.rowId = n.getAttribute('rowid');
						e.parentId = n.getAttribute('parentid');
						e.rowIndex = parseInt(n.getAttribute('rowindex'), 10);
						e.visualIndex = parseInt(n.getAttribute('visualindex'), 10);
						return;
					}
				}
			},

			//Store Notification-------------------------------------------------------------------
			_onDelete: function(id, index, treePath){
				var t = this;
				//only necessary for child row deletion.
				if(treePath && treePath.length > 1){
					t.lazyRefresh();
				}
			},

			_onSet: function(id, index, rowCache, oldCache){
				var t = this;
				if(t.autoUpdate && rowCache){
					var g = t.grid,
						row = g.row(id, 1),
						rowNode = row && row.node();
					if(rowNode){
						var curData = rowCache.data || rowCache._data(),
							oldData = oldCache.data || oldCache._data(),
							cols = g._columns,
							renderWhole = t.arg('renderWholeRowOnSet'),
							compareOnSet = t.arg('compareOnSet');
						if(renderWhole){
							rowNode.innerHTML = t._buildCells(row, row.visualIndex());
							t.onAfterRow(row);
							t.onSet(row);
							t.onRender(index, 1);
						}else{
							array.forEach(cols, function(col){
								if(!compareOnSet(curData[col.id], oldData[col.id])){
									var isPadding = g.tree && g.tree.isPaddingCell(id, col.id),
										cell = row.cell(col.id, 1);
									//Support for Bidi begin
									if('auto' === (col.textDir || g.textDir)){
										var textDirValue = g.getTextDir(col.id, cell.node().innerHTML);
										if(textDirValue){
											cell.node().style.direction = textDirValue;
										}
									}
									//Support for Bidi end
									cell.node().innerHTML = t._buildCellContent(col, id, cell, row.visualIndex(), isPadding);
									t.onAfterCell(cell);
								}
							});
						}
					}
				}
			},

			//-------------------------------------------------------------------------------------
			_onRowMouseOver: function(e){
				var preNode = query('> div.gridxRowOver', this.domNode)[0],
					rowNode = this.getRowNode({rowId: e.rowId});
				if(preNode != rowNode){
					if(preNode){
						domClass.remove(preNode, 'gridxRowOver');
					}
					if(rowNode){
						domClass.add(rowNode, 'gridxRowOver');
					}
				}
			},
			//GridInGrid-------------------------------------------------------------------------------------
			_isDescendantRowNode: function(node){
				return node.parentNode === this.grid.bodyNode;
			},
			
			_isDescendantCellNode: function(node){
				return node.parentNode.parentNode.parentNode.parentNode.parentNode === this.grid.bodyNode;
			},

			//Focus------------------------------------------------------------------------------------------
			_focusCellCol: 0,
			_focusCellRow: 0,

			_initFocus: function(){
				var t = this,
					g = t.grid,
					focus = g.focus;
				focus.registerArea({
					name: 'body',
					priority: 1,
					focusNode: t.domNode,
					scope: t,
					doFocus: t._doFocus,
					doBlur: t._blurCell,
					onFocus: t._onFocus,
					onBlur: t._blurCell
				});
				t.connect(g.mainNode, 'onkeydown', function(evt){
					if(focus.arg('enabled') && focus.currentArea() == 'body'){
						var dk = keys,
							ctrlKey = g._isCtrlKey(evt);
						if(evt.keyCode == dk.HOME && !ctrlKey){
							t._focusCellCol = 0;
							t._focusCell();
							focus.stopEvent(evt);
						}else if(evt.keyCode == dk.END && !ctrlKey){
							t._focusCellCol = g._columns.length - 1;
							t._focusCell();
							focus.stopEvent(evt);
						}else if(!g.tree || !ctrlKey){
							focus._noBlur = 1;	//1 as true
							var arr = {}, dir = g.isLeftToRight() ? 1 : -1;
							arr[dk.LEFT_ARROW] = [0, -dir, evt];
							arr[dk.RIGHT_ARROW] = [0, dir, evt];
							arr[dk.UP_ARROW] = [-1, 0, evt];
							arr[dk.DOWN_ARROW] = [1, 0, evt];
							t._moveFocus.apply(t, arr[evt.keyCode] || []);
							focus._noBlur = 0;	//0 as false
						}
					}
				});
				t.aspect(g, 'onCellClick', function(evt){
					t._focusCellRow = evt.visualIndex;
					t._focusCellCol = evt.columnIndex;
				});
				t.aspect(t, 'onRender', function(start, count){
					var currentArea = focus.currentArea();
					if(focus.arg('enabled')){
						if(currentArea == 'body'){
							if(t._focusCellRow >= start &&
								t._focusCellRow < start + count){
								t._focusCell();
							}
						}else{
							focus.focusArea(currentArea, 1);
						}
					}
				});
				t.connect(g.emptyNode, 'onfocus', function(){
					focus.focusArea('body');
				});
			},

			_doFocus: function(evt){
				return this._focusCell(evt) || this._focusCell(0, -1, -1);
			},

			_focusCell: function(evt, rowVisIdx, colIdx){
				var t = this,
					g = t.grid;
				g.focus.stopEvent(evt);
				colIdx = colIdx >= 0 ? colIdx : t._focusCellCol;
				rowVisIdx = rowVisIdx >= 0 ? rowVisIdx : t._focusCellRow;
				var colId = g._columns[colIdx] ? g._columns[colIdx].id : undefined,
					n = t.getCellNode({
						visualIndex: rowVisIdx,
						colId: colId
					});
				if(n){
					t._blurCell();
					domClass.add(n, 'gridxCellFocus');
					t._focusCellRow = rowVisIdx;
					t._focusCellCol = colIdx;
					g.header._focusHeaderId = colId;
					
					if(has('ie') < 8){
						//In IE7 focus cell node will scroll grid to the left most.
						//So save the scrollLeft first and then set it back.
						//FIXME: this still makes the grid body shake, any better solution?
						var scrollLeft = g.bodyNode.scrollLeft;
						n.focus();
						g.bodyNode.scrollLeft = scrollLeft;
					}else{
						n.focus();
					}
					g.hScroller.scrollToColumn(colId, n.parentNode.parentNode.parentNode.parentNode);//this is for columnlock hack
				}else if(!g.rowCount()){
					g.emptyNode.focus();
					return true;
				}
				return n;
			},

			_moveFocus: function(rowStep, colStep, evt){
				if(rowStep || colStep){
					var r, c,
						t = this,
						g = t.grid, 
						columnCount = g._columns.length,
						vc = g.view.visualCount,
						//IE8 will destroy this event object after setTimeout
						e = has('ie') < 9 ? lang.mixin({}, evt) : evt;
					g.focus.stopEvent(evt); //Prevent scrolling the whole page.
					r = t._focusCellRow + rowStep;
					r = r < 0 ? 0 : (r >= vc ? vc - 1 : r);
					c = t._focusCellCol + colStep;
					c = c < 0 ? 0 : (c >= columnCount ? columnCount - 1 : c);
					g.vScroller.scrollToRow(r).then(function(){
						t._focusCell(0, r, c);
						t.onMoveToCell(r, c, e);
					});
				}
			},

			_nextCell: function(r, c, dir, checker){
				var d = new Deferred(),
					g = this.grid,
					cc = g._columns.length,
					rc = g.view.visualCount;
				do{
					c += dir;
					if(c < 0 || c >= cc){
						r += dir;
						c = c < 0 ? cc - 1 : 0;
						if(r < 0){
							r = rc - 1;
							c = cc - 1;
						}else if(r >= rc){
							r = 0;
							c = 0;
						}
					}
				}while(!checker(r, c));
				g.vScroller.scrollToRow(r).then(function(){
					g.hScroller.scrollToColumn(g._columns[c].id);
					d.callback({r: r, c: c});
				});
				return d;
			},

			_blurCell: function(){
				return !!query('.gridxCellFocus', this.domNode).removeClass('gridxCellFocus');
			},

			_onFocus: function(evt){
				var bn = this.domNode,
					nl = query(evt.target).closest('.gridxCell', bn);
				if(nl[0] && this._isDescendantCellNode(nl[0])){
					var colIndex = this.grid._columnsById[nl[0].getAttribute('colid')].index,
						visualIndex = parseInt(nl.closest('.gridxRow', bn)[0].getAttribute('visualindex'), 10);
					return this._focusCell(0, visualIndex, colIndex);
				}
				return false;
			}
		};

		return GridBody;

	}]);
})();

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

		GridOption.prototype.startPage = 1;

		GridOption.prototype.paginationPageSizes = [5, 10, 25, 50];

		GridOption.prototype.enableRowHoverEffect = true;

		GridOption.prototype.getOption = function(name) {
			if (this._options.hasOwnProperty(name)) {
				return this._options[name];
			}

			return this[name];
		};

		return GridOption;
	}]);
})();

(function(){

angular.module('aui.grid')
.factory('GridRow', ['$q', '$compile', '$parse', '$timeout', 'GridCore',
	function($q, $compile, $parse, $timeout, GridCore) {
		var GridRow = function(id, grid) {
			this.grid = grid;
			this.model = grid.model;
			this.id = id;
		};

		GridRow.prototype.index = function() {
			return this.model.idToIndex(this.id);
		};

		GridRow.prototype.parent = function() {
			return this.grid.row(this.model.parentId(this.id), 1);
		};

		GridRow.prototype.cell = function(column, isId) {
			return this.grid.cell(this, column, isId);
		};

		GridRow.prototype.cells = function(start, count) {
			var t = this,
				g = t.grid,
				cells = [],
				cols = g._columns,
				total = cols.length,
				i = start || 0,
				end = count >= 0 ? start + count : total;

			for (; i < end && i < total; ++i) {
				cells.push(g.cell(t.id, cols[i].id, 1));
			}
			return cells;
		};

		GridRow.prototype.data = function() {
			return this.model.byId(this.id).data;
		};

		GridRow.prototype.rawData = function() {
			return this.model.byId(this.id).rawData;
		};

		GridRow.prototype.item = function() {
			return this.model.byId(this.id).item;
		};

		GridRow.prototype.setRawData = function(rawData) {
			var t = this, 
				s = t.grid.store,
				item = t.item(),
				field, d;
				
			if(s.setValue){
				d = new Deferred();
				try{
					for(field in rawData){
						s.setValue(item, field, rawData[field]);
					}
					s.save({
						onComplete: lang.hitch(d, d.callback),
						onError: lang.hitch(d, d.errback)
					});
				}catch(e){
					d.errback(e);
				}
			}
			return d || Deferred.when(s.put(lang.mixin(lang.clone(item), rawData)));
		};

		return GridRow;
	}]);
})();

(function(){
'use strict';

angular.module('aui.grid')
.factory('GridView', ['$q', '$compile', '$parse', '$timeout', 'GridCore', 'GridUtil', 'GridRow',
	function($q, $compile, $parse, $timeout, GridCore, GridUtil, GridRow) {
		var mixin = GridUtil.mixin;

		var GridView = function(grid) {
			this.grid = grid;
			this.model = grid.model;
			this._clear();
			this.rootStart = 0;
		};

		GridView.prototype.load = function(args){
			var t = this,
				m = t.model,
				g = t.grid,
				persistedOpenInfo = g.persist ? g.persist.registerAndLoad('tree', function(){
					return t._openInfo;
				}) : {};
			t._clear();
			t.aspect(m, 'onSizeChange', '_onSizeChange');
			t.aspect(m, '_onParentSizeChange', '_onParentSizeChange');
			t.aspect(m, 'onDelete', '_onDelete');
			t.aspect(m, 'setStore', function(){
				//If server store changes without notifying grid, expanded rows should remain expanded.
				if(t.arg('clearOnSetStore')){
					t._clear();
				}
			}, t, 'before');
			t.aspect(m, '_msg', '_receiveMsg');
			// t.aspect(m, 'filter', '_onFilter');

			t._loadLevels(persistedOpenInfo).then(function(){
				var size = t._openInfo[''].count = m.size();
				t.rootCount = t.rootCount || size - t.rootStart;
				if(t.rootStart + t.rootCount > size){
					t.rootCount = size - t.rootStart;
				}
				for(var id in persistedOpenInfo){
					t._expand(id);
				}
				t._updateVC();
				t.loaded.callback();
			}, function(e){
				t._err = e;
				t.loaded.callback();
			});
		};

		GridRow.prototype.visualIndex = function() {
			return this.grid.view.getRowInfo({
				rowId: this.id
			}).visualIndex;
		};

		// clearOnSetStore: true,

		// rootStart: 0,

		// rootCount: 0,

		// visualCount: 0,
		GridView.prototype.isExpanded = function(rowId) {
			return !!this._openInfo[rowId]
		};

		GridView.prototype.getRowInfo = function(args){
			var t = this,
				m = t.model,
				id = args.rowId;
			if(m.isId(id)){
				args.rowIndex = m.idToIndex(id);
				args.parentId = m.parentId(id);
			}
			if(typeof args.rowIndex == 'number' && args.rowIndex >= 0){
				//Given row index and parentId, get visual index.
				if(!m.isId(args.parentId)){
					args.parentId = '';
				}
				args.visualIndex = t._getVisualIndex(args.parentId, args.rowIndex);
			}else if(typeof args.visualIndex == 'number' && args.visualIndex >= 0){
				//Given visual index, get row index and parent id.
				var layerId = m.layerId();
				if(m.isId(layerId)){
					args.rowIndex = args.visualIndex;
					args.parentId = layerId;
				}else{
					var rootOpenned = t._openInfo[''].openned,
						vi = t.rootStart + args.visualIndex;
					for(var i = 0; i < rootOpenned.length; ++i){
						var root = t._openInfo[rootOpenned[i]];
						if(m.idToIndex(root.id) < t.rootStart){
							vi += root.count;
						}else{
							break;
						}
					}
					var info = {
						parentId: '',
						preCount: 0
					};
					while(!info.found){
						info = t._getChild(vi, info);
					}
					args.rowIndex = info.rowIndex;
					args.parentId = info.parentId;
				}
			}else{
				//Nothing we can do here...
				return args;
			}
			args.rowId = m.isId(id) ? id : m.indexToId(args.rowIndex, args.parentId);
			return args;
		};

		//Package------------------------------------------------------------------------------
		GridView.prototype.logicExpand = function(id){
			var t = this,
				d = new $q.defer();

			t.model.when({
				parentId: id,
				start: 0,
				count: 1
			}, function(){
				if(t._expand(id)){
					t._updateVC();
				}
			}).then(function(){
				d.resolve();
			}, function(e){
				d.reject(e);
			});
			return d;
		};

		GridView.prototype.logicCollapse = function(id){
			var t = this,
				openInfo = t._openInfo,
				info = openInfo[id];

			if (info) {
				var parentId = t.model.parentId(id),
					parentOpenInfo = t._parentOpenInfo[parentId],
					childCount = info.count;

				parentOpenInfo.splice(parentOpenInfo.indexOf(id), 1);
				info = openInfo[parentId];
				while (info) {
					info.count -= childCount;
					info = openInfo[info.parentId];
				}
				delete openInfo[id];
				t.model.free(id, 1);
				t._updateVC();
			}
		};

		GridView.prototype.updateRootRange = function(start, count, skipUpdate){
			var t = this;
			t.rootStart = start;
			t.rootCount = count;
			return t.updateVisualCount().then(function(){
				if(!skipUpdate){
					t.onUpdate();
				}
			});
		};

		GridView.prototype.updateVisualCount = function(){
			var t = this;
			return t._loadLevels().then(function(){
				t._updateVC();
			});
		};

		//Event---------------------------------------------------------------------------------
		GridView.prototype.onUpdate = function(){};

		//Private-------------------------------------------------------------------------------
		// _parentOpenInfo: null,
		// _openInfo: null,

		GridView.prototype._clear = function(){
			var openned = [];
			this._openInfo = {
				'': {
					id: '',
					parentId: null,
					path: [],
					count: 0,
					openned: openned
				}
			};
			this._parentOpenInfo = {
				'': openned
			};
		},

		GridView.prototype._expand = function(id){
			var t = this,
				m = t.model;
			if(m.hasChildren(id)){
				var parentId = m.parentId(id),
					openInfo = t._openInfo,
					poi = t._parentOpenInfo,
					parentOpenInfo = poi[parentId] = poi[parentId] || [];
				poi[id] = poi[id] || [];
				if(!openInfo[id]){
					var index = m.idToIndex(id);
					if(index >= 0){
						m.keep(id, 1);
						if(parentOpenInfo.indexOf(id) < 0){
							parentOpenInfo.push(id);
						}
						var childCount = m.size(id);
						for(var i = poi[id].length - 1; i >= 0; --i){
							childCount += openInfo[poi[id][i]].count;
						}
						openInfo[id] = {
							id: id,
							parentId: parentId,
							path: m.treePath(id).slice(1).concat([id]),
							count: childCount,
							openned: poi[id]
						};
						var info = openInfo[parentId];
						while(info){
							info.count += childCount;
							info = openInfo[info.parentId];
						}
						return 1;
					}
				}
			}
		};

		GridView.prototype._getVisualIndex = function(parentId, rowIndex){
			var t = this,
				m = this.model,
				openInfo = this._openInfo,
				info = openInfo[parentId],
				preCount = 0,
				rootIndex = parentId === '' ? rowIndex : m.idToIndex(m.rootId(parentId));
			if(info && rootIndex >= t.rootStart && rootIndex < t.rootStart + t.rootCount){
				while(info){
					preCount += rowIndex;
					for(var i = 0; i < info.openned.length; ++i){
						var child = openInfo[info.openned[i]],
							index = m.idToIndex(child.id);
						if(index < rowIndex && (info.id !== '' || index >= t.rootStart)){
							preCount += child.count;
						}
					}
					info.openned.sort(function(a, b){
						return m.idToIndex(a) - m.idToIndex(b);
					});
					rowIndex = m.idToIndex(info.id);
					if(m.isId(info.id)){
						preCount++;
					}
					info = openInfo[info.parentId];
				}
				//All child rows before rootStart are not counted in, so minus rootStart directly.
				return preCount - t.rootStart;
			}
			return null;
		};

		GridView.prototype._getChild = function(visualIndex, info){
			var m = this.model,
				item = this._openInfo[info.parentId],
				preCount = info.preCount + m.idToIndex(item.id) + 1,
				commonMixin = {
					found: true,
					visualIndex: visualIndex
				};
			//Have to sort the opened rows to calc the visual index.
			//But if there are too many opened, this sorting will be slow, any better idea?
			//Note the index can't be maintained since it is changing when sorted or filtered etc.
			item.openned.sort(function(a, b){
				return m.idToIndex(a) - m.idToIndex(b);
			});
			for(var i = 0, len = item.openned.length; i < len; ++i){
				var childId = item.openned[i],
					child = this._openInfo[childId],
					index = m.idToIndex(childId),
					vidx = index + preCount;
				if(vidx === visualIndex){
					return mixin({
						parentId: item.id,
						rowIndex: index
					}, commonMixin);
				}else if(vidx < visualIndex && vidx + child.count >= visualIndex){
					return {
						parentId: childId,
						preCount: preCount
					};
				}else if(vidx + child.count < visualIndex){
					preCount += child.count;
				}
			}
			return mixin({
				parentId: item.id,
				rowIndex: visualIndex - preCount
			}, commonMixin);
		};

		GridView.prototype._loadLevels = function(openInfo){
			openInfo = openInfo || this._openInfo;
			var m = this.model,
				d = $q.defer(),
				id, levels = [];
			for(id in openInfo){
				if(m.isId(id)){
					var i, path = openInfo[id].path;
					for(i = 0; i < path.length; ++i){
						levels[i] = levels[i] || [];
						levels[i].push({
							parentId: path[i],
							start: 0,
							count: 1
						});
					}
				}
			}
			var fetchLevel = function(level){
				if(level < levels.length){
					m.when(levels[level], function(){
						levels[level].forEach(function(arg){
							m.keep(arg.parentId, 1);
						});
						fetchLevel(level + 1);
					}).then(null, function(e){
						d.reject(e);
					});
				}else{
					m.when({}).then(function(){
						d.resolve();
					}, function(e){
						d.reject(e);
					});
				}
			};
			fetchLevel(0);
			return d && d.promise;
		};

		GridView.prototype._updateVC = function(){
			var t = this,
				m = t.model,
				openInfo = t._openInfo,
				info = openInfo[''],
				len = info.openned.length, 
				size = m.size(),
				i, child, index;
			if(size < t.rootStart + t.rootCount){
				if(size > t.rootStart){
					t.rootCount = size - t.rootStart;
				}else{
					t.rootStart = 0;
					t.rootCount = size;
				}
			}
			size = t.rootCount;
			for(i = 0; i < len; ++i){
				child = openInfo[info.openned[i]];
				index = m.idToIndex(child.id);
				if(index >= t.rootStart && index < t.rootStart + t.rootCount){
					size += child.count;
				}
			}
			t.visualCount = size;
		};

		GridView.prototype._onSizeChange = function(size, oldSize){
			var t = this;
			if(!t.paging && t.rootStart === 0 && (t.rootCount === oldSize || oldSize < 0)){
				t.updateRootRange(0, size);
			}
		};

		GridView.prototype._onParentSizeChange = function(parentId, isAdd){
			var t = this,
				rowInfo = t.getRowInfo({rowId: parentId});

			if (rowInfo.visualIndex  !== null && rowInfo.visualIndex !== undefined && isAdd) {
				t.grid.body.renderRows(rowInfo.visualIndex, 1);
			
				if (this._openInfo && this._openInfo[parentId]) {
					// this._openInfo[parentId].count++;
					this.logicCollapse(parentId);
					this.logicExpand(parentId).then(function() {
						t.grid.body.lazyRefresh();
					});
				}
			}
		};

		GridView.prototype._receiveMsg = function(msg){
			var info = this._openInfo,
				m = this.model;

			if(msg === 'filter'){
				this.__openInfo = this._openInfo;
				this.__parentOpenInfo = this._parentOpenInfo;
				this._clear();
			}else if(msg === 'clearFilter'){
				this._openInfo = this.__openInfo || this._openInfo;
				this._parentOpenInfo = this.__parentOpenInfo || this._parentOpenInfo;
			}
		};

		GridView.prototype._onDelete = function(rowId, rowIndex, treePath){
			if(treePath){
				var t = this,
					openInfo = t._openInfo,
					parentOpenInfo = t._parentOpenInfo,
					info = openInfo[rowId],
					model = t.model,
					parentId = treePath.pop(),
					count = 1,
					deleteItem = function(id, parentId){
						var info = openInfo[id],
							openedChildren = parentOpenInfo[id] || [];
						array.forEach(openedChildren, function(child){
							deleteItem(child);
						});
						delete parentOpenInfo[id];
						if(info){
							delete openInfo[id];
							parentId = info.parentId;
						}else if(!model.isId(parentId)){
							//FIXME: don't know what to do here...
							return;
						}
						var ppoi = parentOpenInfo[parentId],
							i = array.indexOf(ppoi, id);
						if(i >= 0){
							ppoi.splice(i, 1);
						}
					};
				if(info){
					count += info.count;
					info = openInfo[info.parentId];
				}else if(model.isId(parentId)){
					info = openInfo[parentId];
				}
				deleteItem(rowId, parentId);
				while(info){
					info.count -= count;
					info = openInfo[info.parentId];
				}
				//sometimes number typed ID can be accidentally changed to string type.
				if(String(parentId) == String(model.layerId()) && rowIndex >= t.rootStart && rowIndex < t.rootStart + t.rootCount){
					t.rootCount--;
				}
				var rootIndex = model.idToIndex(model.rootId(rowId));
				if(rootIndex >= t.rootStart && rootIndex < t.rootStart + t.rootCount){
					t.visualCount -= count;
				}
			}else{
				//FIXME: what to do if some unknown row is deleted?
				// this._clear();
			}
			this.grid.body.lazyRefresh();
		};
	
		// Grid.prototype._stepIn = function(vi, info) {
		// 	var preCount = info.count,
		// 		m = this.grid.model,
		// 		pi = info.parentId,
		// 		openned = null,
		// 		item = this._openInfo[pi], i = 0;

		// 	for (i = 0; i < item.openned.length; i++) {
		// 		var childId = oi.oppened,
		// 			index = m.idToIndex();

		// 		if (preCount + index) {
		// 			info.found = true;
		// 			info.rowId = this.grid.model.byIndex(openned)
		// 		}
		// 	}

		// 	while(!info.found) {
		// 		if (info)
		// 	}
		// };

		// GridView.prototype.getRowInfo = function(row) {
		// 	var vi = row.visualIndex,
		// 		pi = row.parentId || '',
		// 		index = row.index,
		// 		id = row.rowId;

		// 	if (vi !== undefined) {			//by visual index
		// 		var info = {parentId: '', count: 0, found: false};
		// 		stepIn(vi, info);
		// 	} else if (index !== undefined) {		//by index

		// 	} else {		//by id
		// 		index = this.model.idToIndex(id);
		// 		vi = this._getVisualIndex(index, pi);
		// 	}
		// 	// return this.model.idToIndex(this.id);
		// };

		// GridView.prototype._getVisualIndex = function(index, parentId) {

		// };

		return GridView;
	}]);
})();

(function(){
	angular.module('aui.grid')
	.factory('Model', ['$q', 'GridUtil', 'Sync', 'GridSortService', function($q, GridUtil, Sync, GridSortService) {
/*=====
	return declare([], {
		// summary:
		//		This class handles all of the data logic in grid.
		// description:
		//		It provides a clean and useful set of APIs to encapsulate complicated data operations, 
		//		even for huge asynchronous (server side) data stores.
		//		It is built upon a simple extension mechanism, allowing new (even user defined) data operaions to be pluged in.
		//		An instance of this class can be regarded as a stand-alone logic grid providing consistent data processing 
		//		functionalities. This class can even be instanticated alone without any grid UI.

		clearCache: function(){
		},

		isId: function(){
		},

		byIndex: function(index, parentId){
			// summary:
			//		Get the row cache by row index.
			// index: Integer
			//		The row index
			// parentId: String?
			//		If parentId is valid, the row index means the child index under this parent.
			// returns:
			//		The row cache
			return null;	//gridx.core.model.__RowCache
		},

		byId: function(id){
			// summary:
			//		Get the row cache by row id
			// id: String
			//		The row ID
			// returns:
			//		The row cache
			return null;	//gridx.core.model.__RowCache
		},

		indexToId: function(index, parentId){
			// summary:
			//		Transform row index to row ID. If not exist, return undefined.
			// index: Integer
			//		The row index
			// parentId: String?
			//		If parentId is valid, the row index means the child index under this parent.
			// returns:
			//		The row ID
			return '';	//String
		},

		idToIndex: function(id){
			// summary:
			//		Transform row ID to row index. If not exist, return -1.
			// id: String
			//		The row ID
			// returns:
			//		The row index
			return -1;	//Integer
		},

		treePath: function(id){
			// summary:
			//		Get tree path of row by row ID
			// id: String
			//		The row ID
			// returns:
			//		An array of parent row IDs, from root to parent.
			//		Root level rows have parent of id ""(empty string).
			return [];	//String[]
		},

		parentId: function(id){
			// summary:
			//		Get the parent ID of the given row.
			// id: String
			//		The row ID
			// returns:
			//		The parent ID.
			return [];
		},

		hasChildren: function(id){
			// summary:
			//		Check whether a row has children rows.
			// id: String
			//		The row ID
			// returns:
			//		Whether this row has child rows.
			return false;	//Boolean
		},

		children: function(id){
			// summary:
			//		Get IDs of children rows.
			// id: String
			//		The row ID
			// returns:
			//		An array of row IDs
			return [];	//Array
		},

		size: function(parentId){
			// summary:
			//		Get the count of rows under the given parent. 
			// parentId: String?
			//		The ID of a parent row. No parentId means root rows.
			// returns:
			//		The count of (child) rows
			return -1;	//Integer
		},

		keep: function(id){
			// summary:
			//		Lock up a row cache in memory, avoid clearing it out when cache size is reached.
			// id: String
			//		The row ID
		},

		free: function(id){
			// summary:
			//		Unlock a row cache in memory, so that it could be cleared out when cache size is reached.
			// id: String?
			//		The row ID. If omitted, all kept rows will be freed.
		},

		sort: function(id) {

		},

		when: function(args, callback, scope){
			// summary:
			//		Call this method to make sure all the pending data operations are executed and
			//		all the needed rows are at client side.
			// description:
			//		This method makes it convenient to do various grid operations without worrying too much about server side
			//		or client side store. This method is the only asynchronous public method in grid model, so that most of
			//		the custom code can be written in synchronous way.
			// args: Object|null?
			//		Indicate what rows are needed by listing row IDs or row indexes.
			//		Acceptable args include: 
			//		1. A single row index.
			//		e.g.: model.when(1, ...)
			//		2. A single row index range object in form of: {start: ..., count: ...}.
			//		If count is omitted, means all remaining rows.
			//		e.g.: model.when({start: 10, count: 100}, ...)
			//		3. An array of row indexes and row index ranges.
			//		e.g.: model.when([0, 1, {start: 10, count: 3}, 100], ...)
			//		4. An object with property "index" set to the array defined in 3.
			//		e.g.: model.when({
			//			index: [0, 1, {start: 10, count: 3}, 100]
			//		}, ...)
			//		5. An object with property "id" set to an array of row IDs.
			//		e.g.: model.when({
			//		id: ['a', 'b', 'c']
			//		}, ...)
			//		6. An object containing both contents defined in 4 and 5.
			//		7. An empty object
			//		The model will fetch the store size. Currently it is implemented by fetching the first page of data.
			//		8. null or call this method without any arguments.
			//		This is useful when we only need to execute pending data operations but don't need to fetch rows.
			// callback: Function?
			//		The callback function is called when all the pending data operations are executed and all
			// returns:
			//		A Deferred object indicating when all this process is finished. Note that in this Deferred object,
			//		The needed rows might not be available since they might be cleared up to reduce memory usage.
		},

		scan: function(args, callback){
			// summary:
			//		Go through all the rows in several batches from start to end (or according to given args),
			//		and execute the callback function for every batch of rows.
			// args: Object
			//		An object containing scan arguments
			// callback: Function(rows,startIndex)
			//		The callback function.
			// returns:
			//		If return true in this function, the scan process will end immediately.
		},

		onDelete: function(){
			// summary:
			//		Fired when a row is deleted from store
			// tags:
			//		callback
		},

		onNew: function(){
			// summary:
			//		Fired when a row is added to the store
			// tags:
			//		callback
		},

		onSet: function(){
			// summary:
			//		Fired when a row's data is changed
			// tags:
			//		callback
		},

		onSizeChange: function(){
			// summary:
			//		Fired when the size of the grid model is changed
			// tags:
			//		callback
		}
	});
=====*/

	var hitch = GridUtil.hitch;

	function isId(it){

		return it || it === 0;
	}

	function isIndex(it){
		return typeof it == 'number' && it >= 0;
	}

	function isRange(it){
		return it && isIndex(it.start);
	}

	function normArgs(self, args){
		var i, rgs = [], ids = [],
		res = {
			range: rgs,
			id: ids 
		},
		f = function(a){
			if(isRange(a)){
				rgs.push(a);
			}else if(isIndex(a)){
				rgs.push({start: a, count: 1});
			}else if(angular.isArray(a)){
				for(i = a.length - 1; i >= 0; --i){
					if(isIndex(a[i])){
						rgs.push({
							start: a[i],
							count: 1
						});
					}else if(isRange(a[i])){
						rgs.push(a[i]);
					}else if(angular.isString(a)){
						ids.push(a[i]);
					}
				}
			}else if(angular.isString(a)){
				ids.push(a);
			}
		};
		if(args && (args.index || args.range || args.id)){
			f(args.index);
			f(args.range);
			if(angular.isArray(args.id)){
				for(i = args.id.length - 1; i >= 0; --i){
					ids.push(args.id[i]);
				}
			}else if(isId(args.id)){
				ids.push(args.id);
			}
		}else{
			f(args);
		}
		if(!rgs.length && !ids.length && self.size() < 0){
			//first time load, try to load a page
			rgs.push({start: 0, count: self._cache.pageSize || 1});
		}
		return res;
	}
	var Model = function Model(grid) {
		var t = this,
			g = grid,
			cacheClass = grid.cacheClass || Sync;

		cacheClass = typeof cacheClass == 'string' ? require(cacheClass) : cacheClass;
		t.childField = grid.getOption('childField');
		t.store = grid.store;
		t._exts = {};
		t._cmdQueue = [];
		t._model = t._cache = new cacheClass(t, grid);
	};

	Model.prototype = {
		childField: 'children',

		destroy: function() {
			this._cnnts.forEach(function(cnnt){
				cnnt.remove();
			});
			for(var n in this._exts){
				this._exts[n].destroy();
			}
			this._cache.destroy();
		},

		clearCache: function() {
			this._cache.clear();
		},

		isId: isId,

		setData: function(data){
			this.data = data;
			this._cache.setData(data);
		},

		sort: function(options, grid) {
			// option.length
			var rootIndex = this._cache._struct[''],
				t = this;

			return GridSortService.sort(rootIndex, options, grid);
		},

		//Public-------------------------------------------------------------------
		when: function(args, callback, scope){
			this._oldSize = this.size();
			// execute pending operations and then fetch data
			this._addCmd({
				name: '_cmdRequest',
				scope: this,
				args: arguments,
				async: 1
			});
			return this._exec();
		},

		scan: function(args, callback){
			var d = new $q.defer(),
				start = args.start || 0,
				pageSize = args.pageSize || this._cache.pageSize || 1,
				count = args.count,
				end = count > 0 ? start + count : Infinity,
				scope = args.whenScope || this,
				whenFunc = args.whenFunc || scope.when;
			var f = function(s){
				d.progress(s / (count > 0 ? s + count : scope.size()));
				whenFunc.call(scope, {
					id: [],
					range: [{
						start: s,
						count: pageSize
					}]
				}, function(){
					var i, r, rows = [];
					for(i = s; i < s + pageSize && i < end; ++i){
						r = scope.byIndex(i);
						if(r){
							rows.push(r);
						}else{
							end = -1;
							break;
						}
					}
					if(callback(rows, s) || i == end){
						end = -1;
					}
				}).then(function(){
					if(end == -1){
						d.callback();
					}else{
						f(s + pageSize);
					}
				});
			};
			f(start);
			return d;
		},

		_sizeAll: function(parentId, isWhole){
			var size = this.size(parentId, isWhole),
				count = 0,
				i, childId;

			size = size === -1 ? 0 : size;
			count += size;
			
			for (i = 0; i < size; i++) {
				childId = this.indexToId(i, parentId, isWhole);
				count += this._sizeAll(childId, isWhole);
			}


			return count;
		},

		//Events---------------------------------------------------------------------------------
		onDelete: function(/*id, index*/) {},

		onNew: function(/*id, index, row*/) {},

		onSet: function(/*id, index, row*/) {},

		onSizeChange: function(/*size, oldSize*/) {},

		//Package----------------------------------------------------------------------------
		_msg: function(/* msg */){},

		_addCmd: function(args){
			//Add command to the command queue, and combine same kind of commands if possible.
			var cmds = this._cmdQueue,
				cmd = cmds[cmds.length - 1];
			if(cmd && cmd.name == args.name && cmd.scope == args.scope){
				cmd.args.push(args.args || []);
			}else{
				args.args = [args.args || []];
				cmds.push(args);
			}
		},

		//Private----------------------------------------------------------------------------
		_onSizeChange: function(){
			var t = this,
				oldSize = t._oldSize,
				size = t._oldSize = t.size();
			if(oldSize != size){
				t.onSizeChange(size, oldSize);
			}
		},

		_onParentSizeChange: function(parentId, isAdd) {},

		_cmdRequest: function(){
			var t = this;
			return new $q.all([].map.apply(arguments, [function(args){
				var arg = args[0],
					finish = function(){
						t._onSizeChange();
						//TODO: fire events here
						//args[1] is callback, args[2] is scope
						if(args[1]){
							args[1].call(args[2]);
						}
					};
				if(arg === null || !args.length){
					var d = new $q.defer();
					finish();
					d.callback();
					return d;
				}
				return t._model._call('when', [normArgs(t, arg), finish]);
			}]), 0, 1);
		},

		_exec: function(){
			//Execute commands one by one.
			var t = this,
				c = t._cache,
				d = $q.defer(),
				cmds = t._cmdQueue,
				finish = function(d, err){
					t._busy = 0;
					if(c._checkSize){
						c._checkSize();
					}
					if(err){
						d.reject(err);
					}else{
						d.resolve();
					}
				},
				func = function(){
					if(cmds.some(function(cmd){
						return cmd.name == '_cmdRequest';
					})){
						try{
							while(cmds.length){
								var cmd = cmds.shift(),
									dd = cmd.scope[cmd.name].apply(cmd.scope, cmd.args);
								if(cmd.async){
									$q.when(dd, func, hitch(t, finish, d));
									return;
								}
							}
						}catch(e){
							finish(d, e);
							return;
						}
					}
					finish(d);
				};
			if(t._busy){
				return t._busy && t._busy.promise;
			}
			t._busy = d;
			func();
			return d && d.promise;
		},

		_createExts: function(exts, args){
			//Ensure the given extensions are valid
			exts = array.filter(array.map(exts, function(ext){
				return typeof ext == 'string' ? require(ext) : ext;
			}), function(ext){
				return ext && ext.prototype;
			});
			//Sort the extensions by priority
			exts.sort(function(a, b){
				return a.prototype.priority - b.prototype.priority;
			});
			for(var i = 0, len = exts.length; i < len; ++i){
				//Avoid duplicated extensions
				//IMPORTANT: Assume extensions all have different priority values!
				if(i == exts.length - 1 || exts[i] != exts[i + 1]){
					var ext = new exts[i](this, args);
					this._exts[ext.name] = ext;
				}
			}
		}
	};
	
	return Model;

	}]);
})();
(function(){
	angular.module('aui.grid')
	.factory('Sync', ['$q', 'GridUtil', '$compile', '$parse', '$timeout', function($q, GridUtil) {

		/*=====
			return declare(_Extension, function(){
				// summary:
				//		Base cache class, providing cache data structure and some common cache functions.
				//		Also directly support client side stores.
			});
		=====*/
	/*=====
		return declare([], {
			// summary:
			//		Abstract base class for all model components (including cache)

			onNew: function(){},
			onDelete: function(){},
			onSet: function(){}
		});
	=====*/

		var _Extension = function(model) {
			var t = this,
				i = t.inner = model._model;
			t._cnnts = [];
			t.model = model;
			t.childField = t.model.childField;
			model._model = t;
			if(i){
				t.aspect(i, 'onDelete', '_onDelete');
				t.aspect(i, 'onNew', '_onNew');
				t.aspect(i, 'onSet', '_onSet');
			}
		};

		_Extension.prototype = {
			destroy: function(){
				for(var i = 0, len = this._cnnts.length; i < len; ++i){
					this._cnnts[i].remove();
				}
			},

			aspect: function(obj, e, method, scope, pos){
				var cnnt = aspect[pos || 'after'](obj, e, lang.hitch(scope || this, method), 1);
				this._cnnts.push(cnnt);
				return cnnt;
			},

			//Events----------------------------------------------------------------------
			//Make sure every extension has the oppotunity to decide when to fire an event at its level.
			_onNew: function(){
				this.onNew.apply(this, arguments);
			},

			_onSet: function(){
				this.onSet.apply(this, arguments);
			},

			_onDelete: function(){
				this.onDelete.apply(this, arguments);
			},

			onNew: function(){},
			onDelete: function(){},
			onSet: function(){},

			//Protected-----------------------------------------------------------------
			_call: function(method, args){
				var t = this,
					m = t[method],
					n = t.inner;
				return m ? m.apply(t, args || []) : n && n._call(method, args);
			},

			_mixinAPI: function(){
				var i,
					m = this.model,
					args = arguments,
					api = function(method){
						return function(){
							return m._model._call(method, arguments);
						};
					};
				for(i = args.length - 1; i >= 0; --i){
					m[args[i]] = api(args[i]);
				}
			}
		};

		var hitch = GridUtil.hitch,
			mixin = GridUtil.mixin,
			indexOf = [].indexOf;

		function fetchChildren(self){
			var s = self._struct,
				pid,
				df,
				pids = s[''].slice(1),
				appendChildren = function(pid){
					[].push.apply(pids, s[pid].slice(1));
				};

			while (pids.length) {
				pid = pids.shift();
				df = self._storeFetch({
					parentId: pid
				});

				appendChildren(pid);
				// df.promise && df.promise.then(hitch(null, appendChildren, pid));
			}
		}

		var Sync = function Sync(model, args) {
			var t = this;
			// t = new _Extension(model);
			_Extension.apply(t, [model]);
			t.setData(args.options.data);
			t.columns = mixin({}, args.columnsById || args._columnsById);
			// provide the following APIs to Model
			t._mixinAPI('byIndex', 'byId', 'indexToId', 'idToIndex', 'size', 'treePath', 'rootId', 'parentId',
				'hasChildren', 'children', 'keep', 'free', 'layerId', 'setLayer', 'layerUp');
		};

		Sync.prototype = {
			// Assumption:
			//		The parent id for root level rows is an empty string.
			//
			// Some internal data structures:
			//
			// _struct: the index structure of data
			//		{
			//			'': [undefined, 'id1', 'id2', ...], // root level
			//			'id1': ['', 'child-id1', ...], // children of id1 
			//			'id2': ['', ...],	// children of id2
			//			'child-id1': ['id1', ...], // children of child-id1
			//			...
			//		}
			//
			// _cache: row data cache hashed by row id
			//		{
			//			'id1': {
			//				data: {}, // formatted grid data, hashed by column id
			//				rawData: {}, // raw store data, hashed by column id
			//				item: {}	// original store item, defined by store, usually hashed by field name
			//			},
			//			'id2': {
			//				data: {},
			//				rawData: {},
			//				item: {}
			//			}
			//		}
			//
			// _size: total size for every layer
			//		{
			//			'': 100		// root layer
			//			'id1': 20		// id1 has 20 direct children
			//		}
			//
			// _priority: array of row ids
			//		provide an ordered list to decide which row to be removed from cache when cacheSize limit is reached.
			//

			constructor: function(model, args){
			},

			destroy: function(){
				// this.inherited(arguments);
				this._layer = '';
				this.clear();
			},

			setData: function(data){
				var t = this,
					c = 'aspect',
					old = data.fetch;
				//Disconnect data events.
				t.destroy();
				t._cnnts = [];
				t.data = data;
				if(!old && data.notify){
					//The data implements the dojo.data.Observable API
					t[c](data, 'notify', function(item, id){
						if(item === undefined){
							t._onDelete(id);
						}else if(id === undefined){
							t._onNew(item);
						}else{
							t._onSet(item);
						}
					});
				}
			},

			when: function(args, callback){
				// For client side store, this method is a no-op
				var d = new $q.defer();
				try{
					if(callback){
						callback();
					}
					d.resolve();
				}catch(e){
					d.reject(e);
				}
				return d;
			},

			//Public----------------------------------------------
			clear: function() {
				var t = this;
				t._filled = 0;
				t._priority = [];
				t._struct = {};
				t._cache = {};
				t._size = {};
				//virtual root node, with id ''.
				t._struct[''] = [];
				t._size[''] = -1;
				t.totalSize = undefined;
			},

			layerId: function(){
				return this._layer;
			},

			setLayer: function(id){
				this._layer = id;
				this.model._msg('storeChange');
				this.model._onSizeChange();
			},

			layerUp: function(){
				var pid = this.parentId(this._layer);
				this.setLayer(pid);
			},

			// Technically, byIndex is based on byId API.
			byIndex: function(index, parentId){
				this._init();
				return this._cache[this.indexToId(index, parentId)];
			},

			byId: function(id){
				this._init();
				var row = this._cache[id];
				if (row && !row.data && typeof row._data === 'function') {
					row.data = row._data();
				}
				return this._cache[id];
			},

			indexToId: function(index, parentId){
				this._init();
				var items = this._struct[this.model.isId(parentId) ? parentId : this.layerId()];
				return typeof index === 'number' && index >= 0 ? items && items[index + 1] : undefined;
			},

			idToIndex: function(id){
				this._init();
				var s = this._struct,
					pid = s[id] && s[id][0],
					index = (s[pid] || []).indexOf(id);
				return index > 0 ? index - 1 : -1;
			},

			treePath: function(id){
				this._init();
				var s = this._struct,
					path = [];
				while(id !== undefined){
					path.unshift(id);
					id = s[id] && s[id][0];
				}
				if(path[0] !== ''){
					path = [];
				}else{
					path.pop();
				}
				return path;
			},

			rootId: function(id){
				var path = this.treePath(id);
				if(path.length > 1){
					return path[1];
				}else if(!path.length){
					return null;
				}
				return id;
			},

			parentId: function(id){
				return this.treePath(id).pop();
			},

			hasChildren: function(id){
				var t = this,
					s = t.data,
					cf = t.childField,
					c;

				t._init();
				c = t.byId(id);
				return c && c.rawData && c.rawData[cf] && c.rawData[cf].length;
				// return s.hasChildren && s.hasChildren(id, c && c.item) && s.getChildren;
			},

			getChildren: function(id) {
				if (!this.hasChildren(id)) return [];

				var cache = this.byId(id),
					cf = this.childField;

				return cache.rawData[cf];
			},

			children: function(parentId){
				this._init();
				parentId = this.model.isId(parentId) ? parentId : '';
				var size = this._size[parentId],
					children = [],
					i = 0;
				for(; i < size; ++i){
					children.push(this.indexToId(i, parentId));
				}
				return children;
			},

			size: function(parentId){
				this._init();
				var s = this._size[this.model.isId(parentId) ? parentId : this.layerId()];
				return s >= 0 ? s : -1;
			},

			keep: function(){},
			free: function(){},

			//Events--------------------------------------------
			onBeforeFetch: function(){},
			onAfterFetch: function(){},
			onLoadRow: function(){},

			onSetColumns: function(columns){
				var t = this, id, c, colId, col;
				t.columns = mixin({}, columns);
				for(id in t._cache){
					c = t._cache[id];
					for(colId in columns){
						col = columns[colId];
						c.data = c._data();
						c.data[colId] = t._formatCell(c.rawData, id, col.id);
					}
				}
			},

			//Protected-----------------------------------------
			_init: function() {
				var t = this;
				if (!t._filled) {
					t._storeFetch({ start: 0 });
					fetchChildren(t);
					t.model._onSizeChange();
				}
			},

			_itemToObject: function(item){
				var s = this.data,
					obj = {};
				if(s.fetch){
					array.forEach(s.getAttributes(item), function(attr){
						obj[attr] = s.getValue(item, attr);
					});
					return obj;
				}
				return item;
			},

			_formatCell: function(rawData, rowId, colId){
				var col = this.columns[colId],
					t = this,
					cellData; 

				cellData = col.formatter ? col.formatter(rawData[col.field], rawData, rowId, colId, t.model) : rawData[col.field || colId];
				return (t.columns[colId] && t.columns[colId].encode === true && typeof cellData === 'string')? entities.encode(cellData) : cellData;
			},

			_formatRow: function(rowData, rowId){
				var cols = this.columns, res = {}, colId;
				for(colId in cols){
					res[colId] = this._formatCell(rowData, rowId, colId);
				}
				return res;
			},

			_addRow: function(id, index, rowData, item, parentId){
				var t = this,
					st = t._struct,
					pr = t._priority,
					pid = t.model.isId(parentId) ? parentId : '',
					ids = st[pid],
					i;
				if(!ids){
					throw new Error("Fatal error of _Cache._addRow: parent item " + pid + " of " + id + " is not loaded");
				}
				var oldId = ids[index + 1];
				if(t.model.isId(oldId) && oldId !== id){
					console.error("Error of _Cache._addRow: different row id " + id + " and " + ids[index + 1] + " for same row index " + index);
				}
				ids[index + 1] = id;
				st[id] = st[id] || [pid];
				if(pid === ''){
					i = pr.indexOf(id);
					if(i >= 0){
						pr.splice(i, 1);
					}
					pr.push(id);
				}
				t._cache[id] = {
					_data: hitch(t, t._formatRow, rowData, id),
					// _data: t._formatRow(rowData, id),
					rawData: rowData,
					item: item
				};
				t.onLoadRow(id);
			},

			_storeFetch: function(options, onFetched){
				var t = this,
					s = t.data,
					d = new $q.defer(),
					parentId = t.model.isId(options.parentId) ? options.parentId : '',
					req = mixin({}, t.options || {}, options),
					onError = hitch(d, d.errback),
					results;

				var onBegin = function(size) {
					t._size[parentId] = parseInt(size, 10);
				};
				var onComplete = function(items) {
					//FIXME: store does not support getting total size after filter/query, so we must change the protocal a little.
					try {
						var start = options.start || 0,
							i = 0,
							item;

						for (; item = items[i]; ++i) {
							t._addRow(item.id, start + i, t._itemToObject(item), item, parentId);
						}
						// d.callback();
						d.resolve();
					} catch(e) {
						// d.errback(e);
						d.reject(e);
					}
				};

				t._filled = 1;
				t.onBeforeFetch(req);

				if (parentId === '') {
					onBegin(s.length);
					onComplete(s);
				} else if (t.hasChildren(parentId)) {
					results = t.getChildren(parentId);

					if (results.length){
						onBegin(results.length);
					}
					//  else {
					// 	Deferred.when(results, function(results){
					// 		onBegin(results.length);
					// 	});
					// }
					// Deferred.when(results, onComplete, onError);
					onComplete(results);
				}
				// else{
				// 	d.callback();
				// }
				d.promise.then(function(){
					t.onAfterFetch();
				});
				return d;
			},

			//--------------------------------------------------------------------------
			_onSet: function(item, option) {
				var t = this,
					id = t.data.getIdentity(item),
					index = t.idToIndex(id),
					path = t.treePath(id),
					old = t._cache[id];

				if (path.length) {
					t._addRow(id, index, t._itemToObject(item), item, path.pop());
				}
				if (!option || option.overwrite !== false) { // In new store, add() is using put().
															 // Here to stop t.onSet when calling store.add()
					t.onSet(id, index, t._cache[id], old);
				}
			},

			_onNew: function(item, parentInfo){
				var t = this,
					s = t.data,
					row = t._itemToObject(item),
					parentItem = parentInfo && parentInfo[s.fetch ? 'item' : 'parent'],
					parentId = parentItem ? s.getIdentity(parentItem) : '',
					id = s.getIdentity(item),
					size = t._size[''];
				t.clear();
				t.onNew(id, 0, {
					_data: hitch(t, t._formatRow, row, id),
					rawData: row,
					item: item
				});
				if(!parentItem && size >= 0){
					t._size[''] = size + 1;
					if(t.totalSize >= 0){
						t.totalSize = size + 1;
					}
					t.model._onSizeChange();
				}
				if (parentItem && parentId) {
					t._size[parentId] = t._size[parentId] + 1;
					t.model._onParentSizeChange(parentId, 1/*isAdd*/);
				}
			},

			_onDelete: function(item){
				var t = this,
					s = t.data,
					st = t._struct,
					id = s.fetch ? s.getIdentity(item) : item,
					path = t.treePath(id);
				if(path.length){
					var children, i, j,
						ids = [id],
						parentId = path[path.length - 1],
						sz = t._size,
						size = sz[''],
						index = st[parentId].indexOf(id);
					//This must exist, because we've already have treePath
					st[parentId].splice(index, 1);
					--sz[parentId];

					for(i = 0; i < ids.length; ++i){
						children = st[ids[i]];
						if(children){
							for(j = children.length - 1; j > 0; --j){
								ids.push(children[j]);
							}
						}
					}
					for(i = ids.length - 1; i >= 0; --i){
						j = ids[i];
						delete t._cache[j];
						delete st[j];
						delete sz[j];
						// only fire onDelete if it is a child
						if (i !== (ids.length - 1)) {
							t.onDelete(j, undefined, t.treePath(j));
						}
					}
					i = t._priority.indexOf(id);
					if(i >= 0){
						t._priority.splice(i, 1);
					}
					t.onDelete(id, index - 1, path);
					if(!parentId && size >= 0){
						sz[''] = size - 1;
						if(t.totalSize >= 0){
							t.totalSize = size - 1;
						}
						t.model._onSizeChange();
					}
					if (parentId) {
						t.model._onParentSizeChange(parentId, 0/*isDelete*/);
					}
				}else{
					//FIXME: Don't know what to do if the deleted row was not loaded.
					t.clear();
					t.onDelete(id);
	//                var onBegin = hitch(t, _onBegin),
	//                    req = mixin({}, t.options || {}, {
	//                        start: 0,
	//                        count: 1
	//                    });
	//                setTimeout(function(){
	//                    if(s.fetch){
	//                        s.fetch(mixin(req, {
	//                            onBegin: onBegin
	//                        }));
	//                    }else{
	//                        var results = s.query(req.query, req);
	//                        Deferred.when(results.total, onBegin);
	//                    }
	//                }, 10);
				}
			}
		};

		GridUtil.mixin(Sync.prototype, _Extension.prototype);

		return Sync;
	}]);
})();
(function() {
/*=====
	return declare([], {
		// summary:
		//		This is the logical grid (also the base class of the grid widget), 
		//		providing grid data model and defines a module/plugin framework
		//		so that the whole grid can be as flexible as possible while still convenient enough for
		//		web page developers.

		setStore: function(store){
			// summary:
			//		Change the store for grid.
			// store: dojo.data.*|dojox.data.*|dojo.store.*
			//		The new data store
		},

		setColumns: function(columns){
			// summary:
			//		Change all the column definitions for grid.
			// columns: Array
			//		The new column structure
		},

		row: function(row, isId, parentId){
			// summary:
			//		Get a row object by ID or index.
			//		For asyc store, if the data of this row is not in cache, then null will be returned.
			// row: Integer|String
			//		Row index of row ID
			// isId: Boolean?
			//		If the row parameter is a numeric ID, set this to true
			// returns:
			//		If the params are valid and row data is in cache, return a row object, else return null.
		},

		column: function(column, isId){
			// summary:
			//		Get a column object by ID or index
			// column: Integer|String
			//		Column index or column ID
			// isId: Boolean
			//		If the column parameter is a numeric ID, set this to true
			// returns:
			//		If the params are valid return a column object, else return NULL
		},

		cell: function(row, column, isId, parentId){
			// summary:
			//		Get a cell object
			// row: gridx.core.Row|Integer|String
			//		Row index or row ID or a row object
			// column: gridx.core.Column|Integer|String
			//		Column index or column ID or a column object
			// isId: Boolean?
			//		If the row and coumn params are numeric IDs, set this to true
			// returns:
			//		If the params are valid and the row is in cache return a cell object, else return null.
		},

		columnCount: function(){
			// summary:
			//		Get the number of columns
			// returns:
			//		The count of columns
		},

		rowCount: function(parentId){
			// summary:
			//		Get the number of rows.
			// description:
			//		For async store, the return value is valid only when the grid has fetched something from the store.
			// parentId: String?
			//		If provided, return the child count of the given parent row.
			// returns:
			//		The count of rows. -1 if the size info is not available (using server side store and never fetched any data)
		},

		columns: function(start, count){
			// summary:
			//		Get a range of columns, from index 'start' to index 'start + count'.
			// start: Integer?
			//		The index of the first column in the returned array.
			//		If omitted, defaults to 0, so grid.columns() gets all the columns.
			// count: Integer?
			//		The number of columns to return.
			//		If omitted, all the columns starting from 'start' will be returned.
			// returns:
			//		An array of column objects
		},

		rows: function(start, count, parentId){
			// summary:
			//		Get a range of rows, from index 'start' to index 'start + count'.
			// description:
			//		For async store, if some rows are not in cache, then there will be NULLs in the returned array.
			// start: Integer?
			//		The index of the first row in the returned array.
			//		If omitted, defaults to 0, so grid.rows() gets all the rows.
			// count: Integer?
			//		The number of rows to return.
			//		If omitted, all the rows starting from 'start' will be returned.
			// returns:
			//		An array of row objects
		},

		onModulesLoaded: function(){
			// summary:
			//		Fired when all grid modules are loaded. Can be used as a signal of grid creation complete.
			// tags:
			//		callback
		}
	});
=====*/
angular.module('aui.grid')
.factory('GridCore', ['GridUtil', '$q', 'Model', '$compile', '$parse', '$timeout', function(GridUtil, $q, Model){
	var delegate = GridUtil.delegate,
		mixin = GridUtil.mixin,
		hitch = GridUtil.hitch;

	function getDepends(mod){
		var p = mod.moduleClass.prototype;
		return (p.forced || []).concat(p.ial || []);
	}

	function configColumns(columns){
		var cs = {}, c, i, len;
		if(GridUtil.isArray(columns)){
			for(i = 0, len = columns.length; i < len; ++i){
				c = columns[i];
				c.index = i;
				c.id = c.id || String(i + 1);
				cs[c.id] = c;
			}
		}
		return cs;
	}

	function mixinAPI(base, apiPath){
		if(apiPath){
			for(var path in apiPath){
				var bp = base[path],
					ap = apiPath[path];
				if(bp && lang.isObject(bp) && !angular.isFunction(bp)){
					mixinAPI(bp, ap);
				}else{
					base[path] = ap;
				}
			}
		}
	}

	function normalizeModules(self){
		var mods = self.modules,
			len = mods.length,
			modules = [],
			i, m;
		for(i = 0; i < len; ++i){
			m = mods[i];
			if(angular.isString(m)){
				try{
					m = require(m);
				}catch(e){
					console.error(e);
				}
			}
			if(lang.isArray(m)){
				modules = modules.concat(m);
			}else{
				modules.push(m);
			}
		}
		mods = [];
		len = modules.length;
		for(i = 0; i < len; ++i){
			m = modules[i];
			if(angular.isFunction(m)){
				m = {
					moduleClass: m
				};
			}
			if(m){
				var mc = m.moduleClass;
				if(angular.isString(mc)){
					try{
						mc = m.moduleClass = require(mc);
					}catch(e){
						console.error(e);
					}
				}
				if(angular.isFunction(mc)){
					mods.push(m);
					continue;
				}
			}
			console.error("The " + (i + 1 - self.coreModules.length) +
				"-th declared module can NOT be found, please require it before using it:", m);
		}
		self.modules = mods;
	}
	
	function checkForced(self){
		var registeredMods = _Module._modules,
			modules = self.modules, i, j, k, p, deps, depName, err;
		for(i = 0; i < modules.length; ++i){
			p = modules[i].moduleClass.prototype;
			deps = (p.forced || []).concat(p.required || []);
			for(j = 0; j < deps.length; ++j){
				depName = deps[j];
				for(k = modules.length - 1; k >= 0; --k){
					if(modules[k].moduleClass.prototype.name === depName){
						break;
					}
				}
				if(k < 0){
					if(registeredMods[depName]){
						modules.push({
							moduleClass: registeredMods[depName]
						});
					}else{
						err = 1;	//1 as true
						console.error("Forced/Required dependent module '" + depName +
							"' is NOT found for '" + p.name + "' module.");
					}
				}
			}
		}
		if(err){
			throw new Error("Some forced/required dependent modules are NOT found.");
		}
	}

	function removeDuplicate(self){
		var i = 0, m, mods = {}, modules = [];
		for(; m = self.modules[i]; ++i){
			mods[m.moduleClass.prototype.name] = m;
		}
		for(i in mods){
			modules.push(mods[i]);
		}
		self.modules = modules;
	}

	function checkModelExtensions(self){
		var modules = self.modules,
			i, modExts;
		for(i = modules.length - 1; i >= 0; --i){
			modExts = modules[i].moduleClass.prototype.modelExtensions;
			if(modExts){
				[].push.apply(self.modelExtensions, modExts);
			}
		}
	}

	function arr(self, total, type, start, count, pid){
		var i = start || 0, end = count >= 0 ? start + count : total, r = [];
		for(; i < end && i < total; ++i){
			r.push(self[type](i, 0, pid));
		}
		return r;
	}

	function mixin(self, component, name){
		var m, a, mods = self._modules;
		for(m in mods){
			m = mods[m].mod;
			a = m[name + 'Mixin'];
			if(angular.isFunction(a)){
				a = a.apply(m);
			}
			lang.mixin(component, a || {});
		}
		return component;
	}

	function initMod(self, deferredStartup, key){
		var mods = self._modules,
			m = mods[key],
			mod = m.mod,
			d = mod.loaded;
		if(!m.done){
			m.done = 1;
			new DeferredList(array.map(array.filter(m.deps, function(depModName){
				return mods[depModName];
			}), hitch(self, initMod, self, deferredStartup)), 0, 1).then(function(){
				if(mod.load){
					mod.load(m.args, deferredStartup);
				}else if(d.fired < 0){
					d.callback();
				}
			});
		}
		return d;
	}

	function GridCore() {}

	GridCore.prototype = {
		subscribe: function(names/** string| array **/, func, context) {
			if (angular.isString(names)) names = [names];
			var t = this;

			names.forEach(function(name) {
				if (!t.topics.hasOwnProperty(name)) {
					t.topics[name] = [];
				}
				t.topics[name].push([func, context]);
			})
		},

		publish: function(name) {
			if (this.topics.hasOwnProperty(name) && this.topics[name].length) {
				this.topics[name].forEach(function(func) {
					func[0].apply(func[1], []);
				});
			}
		},

		setStore: function(store){
			if(this.store !== store){
				this.store = store;
				this.model.setStore(store);
			}
		},

		setData: function(data){
			this.model.setData(data);
		},

		setColumns: function(columns){
			var t = this;
			t.structure = columns;
			//make a shallow copy of columns here so one structure can be used in different grids.
			t._columns = columns.map(function(col){
				return GridUtil.mixin({}, col);
			});
			t._columnsById = configColumns(t._columns);
			
			if(t.edit){			//FIX ME: this is ugly
								//this will not run in the first setColumns function
				t.edit._init();
			}
			if(t.model){
				t.model._cache.onSetColumns(t._columnsById);
			}
		},

		row: function(row, isId, parentId){
			var t = this;
			if(typeof row === "number" && !isId){
				row = t.model.indexToId(row, parentId);
			}
			if(t.model.byId(row)){
				t._rowObj = t._rowObj || mixin(t, new Row(t), "row");
				return delegate(t._rowObj, {
					id: row
				});
			}
			return null;
		},

		column: function(column, isId){
			var t = this, c, a, obj = {};
			if(typeof column === "number" && !isId){
				c = t._columns[column];
				column = c && c.id;
			}
			c = t._columnsById[column];
			if(c){
				t._colObj = t._colObj || mixin(t, new Column(t), "column");
				for(a in c){
					if(t._colObj[a] === undefined){
						obj[a] = c[a];
					}
				}
				return delegate(t._colObj, obj);
			}
			return null;
		},

		cell: function(row, column, isId, parentId){
			var t = this, r = row instanceof Row ? row : t.row(row, isId, parentId);
			if(r){
				var c = column instanceof Column ? column : t.column(column, isId);
				if(c){
					t._cellObj = t._cellObj || mixin(t, new Cell(t), "cell");
					return delegate(t._cellObj, {
						row: r,
						column: c
					});
				}
			}
			return null;
		},

		columnCount: function(){
			return this._columns.length;
		},

		rowCount: function(parentId){
			return this.model.size(parentId);
		},

		columns: function(start, count){
			return arr(this, this._columns.length, 'column', start, count);	//gridx.core.Column[]
		},

		rows: function(start, count, parentId){
			return arr(this, this.rowCount(parentId), 'row', start, count, parentId);	//gridx.core.Row[]
		},

		onModulesLoaded: function(){},

		registerApi: function(moduleName, apiName, func) {
			if (!this.api) return;

			if (!this.api[moduleName]) this.api[moduleName] = {};

			this.api[moduleName][apiName] = func;
		},
		//Private-------------------------------------------------------------------------------------
		_init: function(){
			var t = this, s,
				// d = t._deferStartup = new Deferred();
				d = t._deferStartup = $q.defer();
			t.modules = t.modules || [];
			t.modelExtensions = t.modelExtensions || [];
			t.topics = t.topics || {};

			t.registerApi('core', 'sort', hitch(t, t.sort));
			t.registerApi('core', 'refresh', hitch(t, t.refresh));

			if(t.touch){
				if(t.touchModules){
					t.modules = t.modules.concat(t.touchModules);
				}
			}else if(t.desktopModules){
				t.modules = t.modules.concat(t.desktopModules);
			}

			s = t.store;

			// Deferred.when(s, function(){
				t.setColumns(t.options.columnStructs);
				
				// normalizeModules(t);
				// checkForced(t);
				// removeDuplicate(t);
				// checkModelExtensions(t);

				//Create model before module creation, so that all modules can use the logic grid from very beginning.
				t.model = new Model(t);
				t.model.when({}, function() {console.log('data load done')});
				t.when = hitch(t.model, t.model.when);
				t._create();
				t._preload();
				// t._load(d).then(function(){
				// 	t.onModulesLoaded();
				// });
			// });
		},

		_uninit: function(){
			var t = this, mods = t._modules, m;
			for(m in mods){
				mods[m].mod.destroy();
			}
			if(t.model){
				t.model.destroy();
			}
		},

		_create: function(){
			var t = this,
				i = 0, mod,
				mods = t._modules = {};
			for(; mod = t.modules[i]; ++i){
				var m, cls = mod.moduleClass,
					key = cls.prototype.name;
				if(!mods[key]){
					mods[key] = {
						args: mod,
						mod: m = new cls(t, mod),
						deps: getDepends(mod)
					};
					if(m.getAPIPath){
						mixinAPI(t, m.getAPIPath());
					}
				}
			}
		},

		_preload: function(){
			var m, mods = this._modules;
			for(m in mods){
				m = mods[m];
				if(m.mod.preload){
					m.mod.preload(m.args);
				}
			}
		},

		_load: function(deferredStartup){
			var dl = [], m;
			for(m in this._modules){
				dl.push(initMod(this, deferredStartup, m));
			}
			return new DeferredList(dl, 0, 1);
		},

		//used when creating grid without store
		_defaultData: [
			{id: 1, name: 'Dojo'},
			{id: 2, name: 'jQuery'},
			{id: 3, name: 'ExtJS'},
			{id: 4, name: 'YUI'}
		],

		_parseData: function(data){
			var t = this;

			if(typeof data ==='object' && data.constructor === Array){
				this.store = new Memory({data: data});
			}else{					//use default data
				this.store = new Memory({
					data: this._defaultData
				});
			}
			if(!t.structure){
				this.structure = this._parseStructure(data);
			}
			return 1;
		},

		_parseStructure: function(data){
			if(!data || typeof data !== 'object'){
				return [
					{id: 1, name: 'id', field: 'id'},
					{id: 2, name: 'name', field: 'name'}
				];
			}
			
			var s = {},
				len = data.length,
				keys, i, j, kl, key,
				struct = [];

			for(i = 0; i < len; i++){
				keys = Object.keys(data[i]);
				kl = keys.length;
				for(j = 0; j < kl; j++){
					s[keys[j]] = 1;
				}
			}

			for(key in s){
				struct.push({id: key, name: key, field: key});
			}

			return struct;
		}
	};

	return GridCore;
}]);
})();

(function() {
	angular.module('aui.grid')
	.service('GridPaginationService', ['$q', '$compile', '$parse', '$timeout', function() {
		var s = {
			rowMixin: {
				getPage: function(){
					// summary:
					//		Get the page index this row belongs to.
					return this.grid.pagination.pageOfIndex(this.index());
				},

				indexInPage: function(){
					// summary:
					//		Get the index of this row in its page.
					return this.grid.pagination.indexInPage(this.index());
				}
			},

			preload: function(){
				this.grid.view.paging = true;
			},

			init: function(grid){
				var t = this;
					// finish = function(){
					// 	t._updateBody(1);
					// 	t.connect(t.model, 'onSizeChange', '_onSizeChange');
					// 	t.loaded.callback();
					// };
				t._pageSize = t.arg('initialPageSize') || t._pageSize;
				t._page = t.arg('initialPage', t._page, function(arg){
					return arg >= 0;
				});
				t.model.when({}).then(finish, finish);
			},

			// [Public API] --------------------------------------------------------
			// GET functions
			pageSize: function(){
				var s = this._pageSize;
				return s > 0 ? s : this.model.size();
			},

			isAll: function(){
				return this._pageSize === 0;
			},

			pageCount: function(){
				return this.isAll() ? 1 : Math.max(Math.ceil(this.model.size() / this.pageSize()), 1);	//Integer
			},

			currentPage: function(){
				return this._page;
			},

			firstIndexInPage: function(page){
				if(!page && page !== 0){
					page = this._page;
				}else if(!(page >= 0)){
					return -1;	//Integer
				}
				var index = page * this.pageSize();
				return index < this.model.size() ? index : -1;
			},

			lastIndexInPage: function(page){
				var t = this,
					firstIndex = t.firstIndexInPage(page);
				if(firstIndex >= 0){
					var lastIndex = firstIndex + parseInt(t.pageSize(), 10) - 1,
						size = t.model.size();
					return lastIndex < size ? lastIndex : size - 1;
				}
				return -1;
			},

			pageOfIndex: function(index){
				return this.isAll() ? 0 : Math.floor(index / this.pageSize());
			},

			indexInPage: function(index){
				return this.isAll() ? index : index % this.pageSize();
			},

			filterIndexesInPage: function(indexes, page){
				var first = this.firstIndexInPage(page),
					end = this.lastIndexInPage(page);
				return first < 0 ? [] : array.filter(indexes, function(index){
					return index >= first && index <= end;
				});
			},

			//SET functions
			gotoPage: function(page){
				var t = this, oldPage = t._page;
				if(page != oldPage && t.firstIndexInPage(page) >= 0){
					t._page = page;
					t._updateBody();
					t.onSwitchPage(page, oldPage);
				}
			},

			setPageSize: function(size){
				var t = this, oldSize = t._pageSize;
				if(size != oldSize && size >= 0){
					var index = t.firstIndexInPage(),
						oldPage = -1;
					t._pageSize = size;
					if(t._page >= t.pageCount()){
						oldPage = t._page;
						t._page = t.pageOfIndex(index);
					}
					t._updateBody();
					t.onChangePageSize(size, oldSize);
					if(oldPage >= 0){
						t.onSwitchPage(t._page, oldPage);
					}
				}
			},

			// [Events] ----------------------------------------------------------------
			onSwitchPage: function(/*currentPage, originalPage*/){},

			onChangePageSize: function(/*currentSize, originalSize*/){},
			
			// [Private] -------------------------------------------------------
			_page: 0,

			_pageSize: 10,

			_updateBody: function(noRefresh){
				var t = this,
					size = t.model.size(),
					count = t.pageSize(),
					start = t.firstIndexInPage();
				if(size === 0 || start < 0){
					start = 0;
					count = 0;
				}else if(size - start < count){
					count = size - start;
				}
				t.grid.view.updateRootRange(start, count, 1);
				if(!noRefresh){
					t.grid.body.lazyRefresh();
				}
			},

			_onSizeChange: function(size){
				var t = this;
				if(size === 0){
					t._page = 0;
					t.grid.view.updateRootRange(0, 0);
				}else{
					var first = t.firstIndexInPage();
					if(first < 0 && t._page !== 0){
						var oldPage = t._page;
						t._page = 0;
						t.onSwitchPage(0, oldPage);
					}
					t._updateBody();
				}
			}
		}

		return s;
	}]);

})();
(function() {
	'use strict';
	
	var module = angular.module('aui.grid');
	module.factory('GridSortService', ['GridUtil', '$q', function(GridUtil, $q) {
		var hitch = GridUtil.hitch;

		var service = {
			init: function(grid) {
				// grid.registerApi('sort', 'sort', hitch(this, this.sort, grid))
			},

			basicSort: function(list, options) {

			},

			sort: function(list, options, grid) {
				// technically, sort should be an async process
				// there would be server-side sorting
				var field, descending = false, option,
					cols = grid._columnsById,
					cache = grid.model._cache._cache,
					da, db, optionsLen = options.length,
					def = $q.defer();

				if (list[0] === undefined) list.shift();
				list.sort(function(a, b) {
					for (var i = 0; i < optionsLen; i++) {
						option = options[i];
						field = cols[option.colId].field;
						descending = option.descending ? -1 : 1;
						da = cache[a].rawData[field];
						db = cache[b].rawData[field];
						if (da > db) {
							return 1 * descending;
						}
						if (da < db) {
							return -1 * descending;
						}
					}
					return 0;
				});
				list.unshift(undefined);
				def.resolve();
				return def.promise;
			}
		};

		return service;
	}]);
})();

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
			}
		}

		return s;
	}]);

})();
angular.module('aui.grid').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('aui-grid/aui-grid-body',
    "<div class=\"gridxMain\" role=\"presentation\"><div class=\"gridxBodyEmpty\" role=\"alert\" tabindex=\"-1\" ng-show=\"renderedRows.length === 0\">this is the empty body</div><div class=\"gridxBody\" role=\"presentation\" tabindex=\"0\" ng-class=\"{gridxBodyRowHoverEffect: grid.enableRowHoverEffect}\"><div aui-grid-row ng-repeat=\"row in renderedRows\" row=\"row\"></div></div><!-- \t<div class=\"gridxVScroller\"tabindex=\"-1\">\r" +
    "\n" +
    "\t\t<div style='width: 1px;'></div>\r" +
    "\n" +
    "\t</div> --></div>"
  );


  $templateCache.put('aui-grid/aui-grid-cell',
    "aui-grid-cell.html"
  );


  $templateCache.put('aui-grid/aui-grid-footer',
    "<div class=\"gridxFooter\" data-dojo-attach-point=\"footerNode\"><!-- \t<div class=\"gridxHScroller\">\r" +
    "\n" +
    "\t\t<div class=\"gridxHScrollerInner\" data-dojo-attach-point=\"hScrollerNode\" tabindex=\"-1\" style=\"\">\r" +
    "\n" +
    "\t\t\t<div style=\"\"></div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div> --></div>"
  );


  $templateCache.put('aui-grid/aui-grid-header',
    "<div class=\"gridxHeader\" role=\"presentation\"><div class=\"gridxHeaderRow\"><div class=\"gridxHeaderRowInner\" role=\"row\" ng-class=\"{hasVScroller: grid.hasVScroller}\"><table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><td ng-repeat=\"cell in headerCells\" aria-readonly=\"true\" role=\"gridcell\" tabindex=\"-1\" aria-describedby=\"grid-id\" colid=\"{{cell.colId}}\" class=\"gridxCell {{cell.domClass}}\" style=\"{{cell.style}}\" ng-class=\"{sortable: cell.sortable}\">{{cell.content}}<div role=\"presentation\" tabindex=\"0\" class=\"gridxArrowButtonNode\" ng-show=\"cell.sorting > 0\"><div class=\"gridxArrowButtonChar\">&#9662;</div></div><div role=\"presentation\" tabindex=\"0\" class=\"gridxArrowButtonNode\" ng-show=\"cell.sorting < 0\"><div class=\"gridxArrowButtonChar\">&#9652;</div></div></td></tr></tbody></table></div></div></div>"
  );


  $templateCache.put('aui-grid/aui-grid-pagination-bar',
    "<div class=\"gridx-pagination-bar\"><div class=\"gridx-pagination-bar-container\"><div class=\"gridx-pagination-bar-control\"><button type=\"button\" ng-click=\"paginationApi.goto(1)\" class=\"firstPage\" ng-disabled=\"cantPageBackward()\"><div class=\"first-triangle\"><div class=\"first-bar\"></div></div></button> <button type=\"button\" ng-click=\"paginationApi.previous()\" class=\"previous\" ng-disabled=\"cantPageBackward()\"><div class=\"first-triangle prev-triangle\"></div></button> <input type=\"number\" ng-model=\"grid.currentPage\" class=\"currentPage\" min=\"1\" max=\"{{ paginationApi.pageCount() }}\" required> <span class=\"gridx-pagination-max-pages-number\" ng-show=\"paginationApi.pageCount() > 0\">/ {{ paginationApi.pageCount() }}</span> <button type=\"button\" ng-click=\"paginationApi.next()\" class=\"next\" ng-disabled=\"cantPageForward()\"><div class=\"last-triangle next-triangle\"></div></button> <button type=\"button\" ng-click=\"paginationApi.goto(paginationApi.pageCount())\" class=\"last\" ng-disabled=\"cantPageToLast()\"><div class=\"last-triangle\"><div class=\"last-bar\"></div></div></button></div><div class=\"gridx-pagination-bar-sizes\"><select ng-model=\"grid.paginationPageSize\" ng-options=\"o as o for o in paginationPageSizes\"></select><!-- <span class=\"ui-grid-pager-row-count-label\">&nbsp;{{sizesLabel}}</span> --><span class=\"gridx-pagination-count-label\">&nbsp;items per page</span></div></div><div class=\"ui-grid-pager-count-container\"><div class=\"ui-grid-pager-count\"><span ng-show=\"grid.options.totalItems > 0\">{{showingLow}} - {{showingHigh}} of {{grid.options.totalItems}} {{totalItemsLabel}}</span></div></div></div>"
  );


  $templateCache.put('aui-grid/aui-grid-row',
    "<div class=\"gridxRow\" role=\"row\" visualindex=\"0\" rowid=\"0\" rowindex=\"0\" parentid=\"\"><table class=\"gridxRowTable\" role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><td ng-repeat=\"col in columns\" class=\"gridxCell\" aui-grid-cell field=\"col.field\" row=\"row\" col-id=\"col.id\" col=\"col\"></td></tr></tbody></table></div>"
  );


  $templateCache.put('aui-grid/aui-grid',
    "<div class=\"gridx\" role=\"grid\" tabindex=\"0\" aria-readonly=\"true\" aria-label=\"grid\"><div class=\"gridxLoad\"></div><div aui-grid-header></div><div aui-grid-body></div><div aui-grid-footer></div><span data-dojo-attach-point=\"lastFocusNode\" tabindex=\"0\"></span></div>"
  );

}]);

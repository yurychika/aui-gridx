(function () {
	'use strict';
	angular.module('aui.grid.i18n', []);
	angular.module('aui.grid', ['aui.grid.i18n']);
})();
(function() {
	'use strict';

	var module = angular.module('aui.grid');

	module.controller('auiGridController',
		['$scope', '$element', '$attrs', 'Grid', 'GridBody', function ($scope, $element, $attrs, Grid, GridBody) {
			var grid;
			$scope.grid = new Grid($scope.auiGrid);
			grid = this.grid = $scope.grid;
			grid.body = new GridBody('basic', grid);
			console.log(grid.body.emptyMessage);
			// console.log('Grid instance:', $scope.grid);
			// console.log($scope.auiGrid.data);

			var dataWatchCollectionDereg = $scope.$parent.$watchCollection(function() { return $scope.auiGrid.data; }, dataWatchFunction);

			function dataWatchFunction(newData) {
				newData = newData || [];
				grid.setData(newData);
				grid.model.when({}, function() {
					grid.redraw();
				});
				console.log('in data watch function;');
			}
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
				console.log(arguments);
				// console.log($scope.auiGrid);
				// console.log
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
			scope: {
				auiGrid: '=',
				getExternalScopes: '&?externalScopes' //optional functionwrapper around any needed external scope instances
			},
			replace: true,
			require: ['^auiGrid'],
			transclude: true,
			// compile: function() {
			// 	console.log('in aui-grid compile');
			// },
			// controller: 'auiGridController',
			link: function($scope, $elem, $attrs, controllers) {
				var gridCtrl = controllers[0];

				$scope.grid = gridCtrl.grid;
				var grid = $scope.grid;
				$scope.columns = gridCtrl._columns;
				$scope.domNode = $elem[0];
				$scope.innerNode = $scope.domNode.querySelectorAll('.gridxHeaderRowInner')[0];
				$scope.headerCells = [];
				// var $colMenu 
				var temp;

				angular.forEach(grid._columns, function(col) {
					temp = {};
					temp.id = grid.id + col.id;
					temp.domClass = (GridUtil.isFunction(col.headerClass) ? col.headerClass(col) : col.headerClass) || '';
					temp.style = 'width:' +  col.width + ';min-width:' + col.width + ';';
					temp.style += (GridUtil.isFunction(col.headerStyle) ? col.headerStyle(col) : col.headerStyle) || '';
					temp.content = (GridUtil.isFunction(col.headerFormatter) ? col.headerFormatter(col) : col.name);
					$scope.headerCells.push(temp);
				});

				console.log($scope.headerCells);
				return;

				// t._build();
				// var t = this,
				// 	g = t.grid,
				// 	f = g.focus,
				// 	sb = ['<table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>'];
				// array.forEach(g._columns, function(col){
				// 	col._domId = (g.id + '-' + col.id).replace(/\s+/, '');
				// 	sb.push('<td id="', col._domId,
				// 		'" role="columnheader" aria-readonly="true" tabindex="-1" colid="', col.id,
				// 		'" class="gridxCell ',
				// 		f && f.currentArea() == 'header' && col.id == t._focusHeaderId ? t._focusClass : '',
				// 		(lang.isFunction(col.headerClass) ? col.headerClass(col) : col.headerClass) || '',
				// 		'" style="width:', col.width, ';min-width:', col.width, ';',
				// 		g.getTextDirStyle(col.id, col.name),
				// 		(lang.isFunction(col.headerStyle) ? col.headerStyle(col) : col.headerStyle) || '',
				// 		'"><div class="gridxSortNode">',
				// 		(lang.isFunction(col.headerFormatter) ? col.headerFormatter(col) : col.name) || '',
				// 		'</div></td>');
				// });
				// sb.push('</tr></table>');
				// t.innerNode.innerHTML = sb.join('');
				// domClass.toggle(t.domNode, 'gridxHeaderRowHidden', t.arg('hidden'));
				// g.headerNode.appendChild(t.domNode);
				// //Add this.domNode to be a part of the grid header
				// g.vLayout.register(t, 'domNode', 'headerNode');
				// t._initFocus();

					// destroy: function(){
					// 	this.inherited(arguments);
					// 	domConstruct.destroy(this.domNode);
					// },

					// columnMixin: {
					// 	headerNode: function(){
					// 		return this.grid.header.getHeaderNode(this.id);
					// 	}
					// },

					// //Public-----------------------------------------------------------------------------
					// hidden: false,

					// getHeaderNode: function(id){
					// 	return query("[colid='" + this.grid._escapeId(id) + "']", this.domNode)[0];
					// },

					// refresh: function(){
					// 	this._build();
					// 	this._onHScroll(this._scrollLeft);
					// 	this.grid.vLayout.reLayout();
					// 	this.onRender();
					// },

					// onRender: function(){},

					// onMoveToHeaderCell: function(){},
					
					// //Private-----------------------------------------------------------------------------
					// _scrollLeft: 0,

					// _build: function(){
					// },

					// _onHScroll: function(left){
					// 	if((has('webkit') || has('ie') < 8) && !this.grid.isLeftToRight()){
					// 		left = this.innerNode.scrollWidth - this.innerNode.offsetWidth - left;
					// 	}
					// 	this.innerNode.scrollLeft = this._scrollLeft = left;
					// },

					// _onEvent: function(eventName, e){
					// 	var g = this.grid,
					// 		evtCell = 'onHeaderCell' + eventName,
					// 		evtRow = 'onHeader' + eventName;
					// 		this._decorateEvent(e);
							
					// 	if(e.columnIndex >= 0){
					// 		g[evtCell](e);
					// 		on.emit(e.target, 'headerCell' + eventName, e);
					// 	}
					// 	g[evtRow](e);
					// 	on.emit(e.target, 'header' + eventName, e);
					// },

					// _decorateEvent: function(e){
					// 	var n = query(e.target).closest('.gridxCell', this.domNode)[0],
					// 		c = n && this.grid._columnsById[n.getAttribute('colid')];
					// 	if(c){
					// 		e.headerCellNode = n;
					// 		e.columnId = c.id;
					// 		e.columnIndex = c.index;
					// 	}
					// },

					// // Focus
					// _focusHeaderId: null,

					// _focusClass: "gridxHeaderCellFocus",

					// _initFocus: function(){
					// 	var t = this, g = t.grid;
					// 	if(g.focus){
					// 		g.focus.registerArea({
					// 			name: 'header',
					// 			priority: 0,
					// 			focusNode: t.innerNode,
					// 			scope: t,
					// 			doFocus: t._doFocus,
					// 			doBlur: t._blurNode,
					// 			onBlur: t._blurNode,
					// 			connects: g.touch ? [
					// 				t.aspect(g, 'onHeaderCellTouchStart', function(evt){
					// 					domClass.add(evt.headerCellNode, t._focusClass);
					// 				}),
					// 				t.aspect(g, 'onHeaderCellTouchEnd', function(evt){
					// 					domClass.remove(evt.headerCellNode, t._focusClass);
					// 				})
					// 			] : [
					// 				t.aspect(g, 'onHeaderCellKeyDown', '_onKeyDown'),
					// 				t.connect(g, 'onHeaderCellMouseDown', function(evt){
					// 					t._focusNode(t.getHeaderNode(evt.columnId));
					// 				})
					// 			]
					// 		});
					// 	}
					// },

					// _doFocus: function(evt, step){
					// 	var t = this;
					// 	if(!t.hidden){
					// 		var n = t._focusHeaderId && t.getHeaderNode(t._focusHeaderId),
					// 			r = t._focusNode(n || query('.gridxCell', t.domNode)[0]);
					// 		t.grid.focus.stopEvent(r && evt);
					// 		return r;
					// 	}
					// 	return false;
					// },
					
					// _focusNode: function(node){
					// 	if(node){
					// 		var t = this, g = t.grid,
					// 			fid = t._focusHeaderId = node.getAttribute('colid');
					// 		if(fid){
					// 			t._blurNode();
								
					// 			g.body._focusCellCol = g._columnsById[fid].index;

					// 			domClass.add(node, t._focusClass);
					// 			//If no timeout, the header and body may be mismatch.
					// 			setTimeout(function(){
					// 				//For webkit browsers, when moving column using keyboard, the header cell will lose this focus class,
					// 				//although it was set correctly before this setTimeout. So re-add it here.
					// 				if(has('webkit')){
					// 					domClass.add(node, t._focusClass);
					// 				}
					// 				node.focus();
					// 				if(has('ie') < 8){
					// 					t.innerNode.scrollLeft = t._scrollLeft;
					// 				}
					// 				if(g.hScroller){
					// 					g.hScroller.scrollToColumn(fid, t.innerNode);
					// 				}
					// 			}, 0);

					// 			return true;
					// 		}
					// 	}
					// 	return false;
					// },

					// _blurNode: function(){
					// 	var t = this, n = query('.' + t._focusClass, t.innerNode)[0];
					// 	if(n){
					// 		domClass.remove(n, t._focusClass);
					// 	}
					// 	return true;
					// },

					// _onKeyDown: function(evt){
					// 	var t = this, g = t.grid, col,
					// 		dir = g.isLeftToRight() ? 1 : -1,
					// 		delta = evt.keyCode == keys.LEFT_ARROW ? -dir : dir;
					// 	if(t._focusHeaderId && !g._isCtrlKey(evt) && !evt.altKey &&
					// 		(evt.keyCode == keys.LEFT_ARROW || evt.keyCode == keys.RIGHT_ARROW)){
					// 		//Prevent scrolling the whole page.
					// 		g.focus.stopEvent(evt);
					// 		col = g._columnsById[t._focusHeaderId];
					// 		col = g._columns[col.index + delta];
					// 		if(col){
					// 			t._focusNode(t.getHeaderNode(col.id));
					// 			t.onMoveToHeaderCell(col.id, evt);
					// 		}
					// 	}
					// }
				}
			};
		}]);
})();

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

(function() {
	'use strict';

	var module = angular.module('aui.grid');

	module.directive('auiGridRow', ['GridUtil', function(GridUtil) {
		return {
			templateUrl: 'aui-grid/aui-grid-row',
			replace: true,
			require: ['^auiGrid'],
			transclude: true,
			link: function($scope, $elem, $attrs, controllers) {
				var gridCtrl = controllers[0];

				$scope.grid = gridCtrl.grid;
				var grid = $scope.grid;
				$scope.columns = gridCtrl._columns;
				$scope.domNode = $elem[0];
				$scope.innerNode = $scope.domNode.querySelectorAll('.gridxHeaderRowInner')[0];
				$scope.headerCells = [];
				// var $colMenu 
				var temp;

				// angular.forEach(grid._columns, function(col) {
				// 	temp = {};
				// 	temp.id = grid.id + col.id;
				// 	temp.domClass = (GridUtil.isFunction(col.headerClass) ? col.headerClass(col) : col.headerClass) || '';
				// 	temp.style = 'width:' +  col.width + ';min-width:' + col.width + ';';
				// 	temp.style += (GridUtil.isFunction(col.headerStyle) ? col.headerStyle(col) : col.headerStyle) || '';
				// 	temp.content = (GridUtil.isFunction(col.headerFormatter) ? col.headerFormatter(col) : col.name);
				// 	$scope.headerCells.push(temp);
				// });

				// console.log($scope.headerCells);
				// return;
			}
		};
	}]);
})();

(function(){
angular.module('aui.grid')
.factory('Grid', ['$q', '$compile', '$parse', '$timeout', 'GridCore',
	function($q, $compile, $parse, $timeout, GridCore) {
		console.log('in side grid constuctor');
		console.log('Grid core', GridCore);
		var dummyFunc = function(){};
		var version = {
			// summary:
			//		Version number of the Dojo Toolkit
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
			toString: function(){
				return this.major + "." + this.minor + "." + this.patch + this.flag;
			}
		};
		var Grid = function Grid(options){
			var self = this;

			this.name = 'aui gridx';
			this.isIE = false;
			this.options = options;
			this.postCreate();
		};

		Grid.prototype = GridCore.prototype;

		Grid.prototype.version = version;

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

		Grid.prototype.redraw = function() {
			// debugger;
			this.body.render();
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
		// Grid.prototype.coreModules = [
		// 	//Put default modules here!
		// 	Header,
		// 	View,
		// 	Body,
		// 	VLayout,
		// 	HLayout,
		// 	VScroller,
		// 	HScroller,
		// 	ColumnWidth,
		// 	Focus
		// ],

		Grid.prototype.coreExtensions = [
			//Put default extensions here!
			// Query
		],
	
		Grid.prototype.postCreate = function(){
			// summary:
			//		Override to initialize grid modules
			// tags:
			//		protected extension
			var t = this;
			// t.inherited(arguments);
			// if(t.touch === undefined){
			// 	t.touch = has('ios') || has('android');
			// }
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
	
		Grid.prototype.startup = function(){
			// summary:
			//		Startup this grid widget
			// tags:
			//		public extension
			if(!this._started){
				// this.inherited(arguments);
				// this._deferStartup.callback();
			}
		},
	
		Grid.prototype.destroy = function(){
			// summary:
			//		Destroy this grid widget
			// tags:
			//		public extension
			// this._uninit();
			// this.inherited(arguments);
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
.factory('GridBody', ['$q', '$compile', '$parse', '$timeout',
	function($q, $compile, $parse, $timeout) {
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
				var g = this.grid;
				var size = g.model.size(), i = 0,
					rr = this.renderedRows,
					cache = g.model._cache._cache;

				rr.splice(0, rr.length);
				for(i in cache) {
					rr.push(cache[i].item);
				}
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
	.factory('Model', ['$q', 'GridUtil', 'Sync', '$compile', '$parse', '$timeout', function($q, GridUtil, Sync) {
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

	var isArrayLike = GridUtil.isArray,
		isString = GridUtil.isString;
		hitch = GridUtil.hitch;

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
			}else if(isArrayLike(a)){
				for(i = a.length - 1; i >= 0; --i){
					if(isIndex(a[i])){
						rgs.push({
							start: a[i],
							count: 1
						});
					}else if(isRange(a[i])){
						rgs.push(a[i]);
					}else if(isString(a)){
						ids.push(a[i]);
					}
				}
			}else if(isString(a)){
				ids.push(a);
			}
		};
		if(args && (args.index || args.range || args.id)){
			f(args.index);
			f(args.range);
			if(isArrayLike(args.id)){
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
	var Model = function Model(args) {
		var t = this,
			g = args,
			cacheClass = args.cacheClass || Sync;
		cacheClass = typeof cacheClass == 'string' ? require(cacheClass) : cacheClass;
		t.store = args.store;
		t._exts = {};
		t._cmdQueue = [];
		t._model = t._cache = new cacheClass(t, args);
		// t._createExts(args.modelExtensions || [], args);
		var m = t._model;
		// t._cnnts = [
		// 	aspect.after(m, "onDelete", lang.hitch(t, "onDelete"), 1),
		// 	aspect.after(m, "onNew", lang.hitch(t, "onNew"), 1),
		// 	aspect.after(m, "onSet", lang.hitch(t, "onSet"), 1)
		// ];
	};

	Model.prototype = {
		constructor: function(args){
		},
	
		destroy: function(){
			this._cnnts.forEach(function(cnnt){
				cnnt.remove();
			});
			for(var n in this._exts){
				this._exts[n].destroy();
			}
			this._cache.destroy();
		},

		clearCache: function(){
			this._cache.clear();
		},

		isId: isId,

		setData: function(data){
			this.data = data;
			this._cache.setData(data);
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
				d = new $q.defer(),
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
				return t._busy;
			}
			t._busy = d;
			func();
			return d;
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
				pids = s[''].slice(1),
				pid,
				appendChildren = function(pid){
					[].push.apply(pids, s[pid].slice(1));
				};
			while(pids.length){
				pid = pids.shift();
				self._storeFetch({
					parentId: pid
				}).then(lang.partial(appendChildren, pid));
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
				}else{
					// t[c](data, old ? "onSet" : "put", "_onSet");
					// t[c](data, old ? "onNew" : "add", "_onNew");
					// t[c](data, old ? "onDelete" : "remove", "_onDelete");
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
			clear: function(){
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
					c;
				t._init();
				c = t.byId(id);
				return s.hasChildren && s.hasChildren(id, c && c.item) && s.getChildren;
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
			_init: function(){
				var t = this;
				if(!t._filled){
					t._storeFetch({ start: 0 });
					if(t.data.getChildren){
						fetchChildren(t);
					}
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

				cellData = col.formatter ? col.formatter(rawData, rowId) : rawData[col.field || colId];
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
	//            console.debug("\tFETCH parent: ",
	//                    options.parentId, ", start: ",
	//                    options.start || 0, ", count: ",
	//                    options.count, ", end: ",
	//                    options.count && (options.start || 0) + options.count - 1, ", options:",
	//                    this.options);
				var t = this,
					s = t.data,
					d = new $q.defer(),
					parentId = t.model.isId(options.parentId) ? options.parentId : '',
					req = mixin({}, t.options || {}, options),
					onError = hitch(d, d.errback),
					results;
				function onBegin(size){
					t._size[parentId] = parseInt(size, 10);
				}
				function onComplete(items){
					//FIXME: store does not support getting total size after filter/query, so we must change the protocal a little.
					if(items.ioArgs && items.ioArgs.xhr){
						var range = results.ioArgs.xhr.getResponseHeader("Content-Range");
						if(range && (range = range.match(/(.+)\//))){
							t.totalSize = +range[1];
						}else{
							t.totalSize = undefined;
						}
					}
					try{
						var start = options.start || 0,
							i = 0,
							item;
						for(; item = items[i]; ++i){
							t._addRow(item.id, start + i, t._itemToObject(item), item, parentId);
						}
						// d.callback();
						d.resolve();
					}catch(e){
						// d.errback(e);
						d.reject(e);
					}
				}
				t._filled = 1;
				t.onBeforeFetch(req);
				if(parentId === ''){
					// if(s.fetch){
					// 	s.fetch(mixin(req, {
					// 		onBegin: onBegin,
					// 		onComplete: onComplete,
					// 		onError: onError
					// 	}));
					// }else{
					// results = s.query(req.query || {}, req);
					// Deferred.when(results.total, onBegin);
					// Deferred.when(results, onComplete, onError);
					onBegin(s.length);
					onComplete(s);
					// }
				}else if(t.hasChildren(parentId)){
					results = s.getChildren(t.byId(parentId).item, req);
					if('total' in results){
						Deferred.when(results.total, onBegin);
					}else{
						Deferred.when(results, function(results){
							onBegin(results.length);
						});
					}
					Deferred.when(results, onComplete, onError);
				}else{
					d.callback();
				}
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
		isFunc = GridUtil.isFunction,
		isString = GridUtil.isString,
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
				if(bp && lang.isObject(bp) && !isFunc(bp)){
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
			if(isString(m)){
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
			if(isFunc(m)){
				m = {
					moduleClass: m
				};
			}
			if(m){
				var mc = m.moduleClass;
				if(isString(mc)){
					try{
						mc = m.moduleClass = require(mc);
					}catch(e){
						console.error(e);
					}
				}
				if(isFunc(mc)){
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
			if(isFunc(a)){
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
		setStore: function(store){
			if(this.store !== store){
				this.store = store;
				this.model.setStore(store);
			}
		},

		setData: function(data){
			var c;

			this.model.setData(data);
			// this.model.when({}, function(){console.log('in model when set data');});
			// if(!skipAutoParseColumn){
			// 	c = this.model._parseStructure(data);
			// 	this.setColumns(c);
			// }
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

		//Private-------------------------------------------------------------------------------------
		_init: function(){
			var t = this, s,
				// d = t._deferStartup = new Deferred();
				d = t._deferStartup = $q.defer();
			t.modules = t.modules || [];
			t.modelExtensions = t.modelExtensions || [];

			if(t.touch){
				if(t.touchModules){
					t.modules = t.modules.concat(t.touchModules);
				}
			}else if(t.desktopModules){
				t.modules = t.modules.concat(t.desktopModules);
			}

			// if(!t.store){
			// 	s = t._parseData(t.data);
			// }else{
				s = t.store;
			// }

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
					var args = [].slice(arguments, [2]);
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
angular.module('aui.grid').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('aui-grid/aui-grid-body',
    "<div class=\"gridxMain\" role=\"presentation\"><div class=\"gridxBodyEmpty\" role=\"alert\" tabindex=\"-1\" ng-show=\"isEmpty\">this is the empty body</div><div class=\"gridxBody\" role=\"presentation\" tabindex=\"0\"><div aui-grid-row ng-repeat=\"row in renderedRows\" row=\"row\"></div></div><!-- \t<div class=\"gridxVScroller\"tabindex=\"-1\">\r" +
    "\n" +
    "\t\t<div style='width: 1px;'></div>\r" +
    "\n" +
    "\t</div> --></div>"
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
    "<div class=\"gridxHeader\" role=\"presentation\"><!-- this is the header for {{grid.name}} --><div class=\"gridxHeaderRow\"><div class=\"gridxHeaderRowInner\" role=\"row\" style><table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><td ng-repeat=\"cell in headerCells\" aria-readonly=\"true\" role=\"gridcell\" tabindex=\"-1\" aria-describedby=\"grid-id\" colid=\"{{cell.id}}\" class=\"gridxCell {{cell.domClass}}\" style=\"{{cell.style}}\">{{cell.content}}</td></tr></tbody></table></div></div></div>"
  );


  $templateCache.put('aui-grid/aui-grid-row',
    "<!-- <div class=\"gridxRow\" ng-repeat='row in renderedRows' role=\"row\" visualindex=\"0\" rowid=\"0\" rowindex=\"0\" parentid=\"\" data-rowheight=\"53\">\r" +
    "\n" +
    "\t<table class=\"gridxRowTable\" role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\r" +
    "\n" +
    "\t\t<tbody>\r" +
    "\n" +
    "\t\t\t<tr>\r" +
    "\n" +
    "\t\t\t\t<td ng-repeat='(key, value) in row' class='gridxCell'>{{value}}</td>\r" +
    "\n" +
    "\t\t\t</tr>\r" +
    "\n" +
    "\t\t</tbody>\r" +
    "\n" +
    "\t</table>\r" +
    "\n" +
    "</div> --><div>hello world</div>"
  );


  $templateCache.put('aui-grid/aui-grid',
    "<div class=\"gridx\" role=\"grid\" tabindex=\"0\" aria-readonly=\"true\" aria-label=\"grid\"><div class=\"gridxLoad\"></div><div aui-grid-header></div><div aui-grid-body></div><!-- <div aui-grid-footer></div> --><span data-dojo-attach-point=\"lastFocusNode\" tabindex=\"0\"></span></div>"
  );

}]);

(function () {
	'use strict';
	angular.module('aui.grid.i18n', []);
	angular.module('aui.grid', ['aui.grid.i18n']);
})();
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

		Grid.prototype.getTextDir = function(colId, text){
			var col = this._columnsById[colId],
				textDir = (col && col.textDir) || this.textDir;
			return textDir = (textDir === "auto") ? _BidiSupport.prototype._checkContextual(text) : textDir;
		},

		Grid.prototype.getTextDirStyle = function(colId, text){
			var textDir = this.getTextDir(colId, text);
			return textDir ? " direction:" + textDir + ";" : "";
		},

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
			t.connect(metrics, 'onFontResize', function(){
				t.resize();
			});
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
		},

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
		},
	
		Grid.prototype._isConnected = function(eventName){
			return this[eventName] !== dummyFunc;
		},
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
			array.forEach(this._cnnts, function(cnnt){
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

		setStore: function(store){
			this.store = store;
			this._cache.setStore(store);
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
			var d = new Deferred(),
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
			return new DeferredList(array.map(arguments, function(args){
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
					var d = new Deferred();
					finish();
					d.callback();
					return d;
				}
				return t._model._call('when', [normArgs(t, arg), finish]);
			}), 0, 1);
		},

		_exec: function(){
			//Execute commands one by one.
			var t = this,
				c = t._cache,
				d = new Deferred(),
				cmds = t._cmdQueue,
				finish = function(d, err){
					t._busy = 0;
					if(c._checkSize){
						c._checkSize();
					}
					if(err){
						d.errback(err);
					}else{
						d.callback();
					}
				},
				func = function(){
					if(array.some(cmds, function(cmd){
						return cmd.name == '_cmdRequest';
					})){
						try{
							while(cmds.length){
								var cmd = cmds.shift(),
									dd = cmd.scope[cmd.name].apply(cmd.scope, cmd.args);
								if(cmd.async){
									Deferred.when(dd, func, lang.partial(finish, d));
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
			t.setStore(args.options.data);
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

			setStore: function(store){
				var t = this,
					c = 'aspect',
					old = store.fetch;
				//Disconnect store events.
				t.destroy();
				t._cnnts = [];
				t.store = store;
				if(!old && store.notify){
					//The store implements the dojo.store.Observable API
					t[c](store, 'notify', function(item, id){
						if(item === undefined){
							t._onDelete(id);
						}else if(id === undefined){
							t._onNew(item);
						}else{
							t._onSet(item);
						}
					});
				}else{
					// t[c](store, old ? "onSet" : "put", "_onSet");
					// t[c](store, old ? "onNew" : "add", "_onNew");
					// t[c](store, old ? "onDelete" : "remove", "_onDelete");
				}
			},

			when: function(args, callback){
				// For client side store, this method is a no-op
				var d = new Deferred();
				try{
					if(callback){
						callback();
					}
					d.callback();
				}catch(e){
					d.errback(e);
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
					index = indexOf(s[pid] || [], id);
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
					s = t.store,
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
					if(t.store.getChildren){
						fetchChildren(t);
					}
					t.model._onSizeChange();
				}
			},

			_itemToObject: function(item){
				var s = this.store,
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
					i = indexOf(pr, id);
					if(i >= 0){
						pr.splice(i, 1);
					}
					pr.push(id);
				}
				t._cache[id] = {
					_data: hitch(t, t._formatRow, rowData, id),
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
					s = t.store,
					d = new Deferred(),
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
							t._addRow(s.getIdentity(item), start + i, t._itemToObject(item), item, parentId);
						}
						d.callback();
					}catch(e){
						d.errback(e);
					}
				}
				t._filled = 1;
				t.onBeforeFetch(req);
				if(parentId === ''){
					if(s.fetch){
						s.fetch(mixin(req, {
							onBegin: onBegin,
							onComplete: onComplete,
							onError: onError
						}));
					}else{
						results = s.query(req.query || {}, req);
						Deferred.when(results.total, onBegin);
						Deferred.when(results, onComplete, onError);
					}
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
				d.then(function(){
					t.onAfterFetch();
				});
				return d;
			},

			//--------------------------------------------------------------------------
			_onSet: function(item, option) {
				var t = this,
					id = t.store.getIdentity(item),
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
					s = t.store,
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
					s = t.store,
					st = t._struct,
					id = s.fetch ? s.getIdentity(item) : item,
					path = t.treePath(id);
				if(path.length){
					var children, i, j,
						ids = [id],
						parentId = path[path.length - 1],
						sz = t._size,
						size = sz[''],
						index = indexOf(st[parentId], id);
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
					i = indexOf(t._priority, id);
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

		setData: function(data, skipAutoParseColumn){
			var c;

			this.model.setData(data);
			if(!skipAutoParseColumn){
				c = this.model._parseStructure(data);
				this.setColumns(c);
			}
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
				t.when = hitch(t.model, t.model.when);
				t._create();
				t._preload();
				t._load(d).then(function(){
					t.onModulesLoaded();
				});
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

			isFunction: function() {},

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
angular.module('aui.grid').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('aui-grid/aui-grid',
    "<div>hello world</div>"
  );

}]);

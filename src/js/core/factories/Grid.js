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

		Grid.prototype.sortOptions = [];

		Grid.prototype.getOption = function(name) {
			return this._options.getOption(name);
		};

		Grid.prototype._setTextDirAttr = function(textDir) {
			// summary:
			//		 Seamlessly changes grid 'textDir' property on the fly.
			// textDir:
			//		Grid text direction
			if(this.textDir != textDir) {
				this.textDir = textDir;
				this.header.refresh();
				if(this.edit) {
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

		Grid.prototype.getTextDir = function(colId, text) {
			var col = this._columnsById[colId],
				textDir = (col && col.textDir) || this.textDir;
			return textDir = (textDir === "auto") ? _BidiSupport.prototype._checkContextual(text) : textDir;
		};

		Grid.prototype.getTextDirStyle = function(colId, text) {
			var textDir = this.getTextDir(colId, text);
			return textDir ? " direction:" + textDir + ";" : "";
		};

		Grid.prototype.enforceTextDirWithUcc = function(colId, text) {
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

		Grid.prototype.destroy = function() {
			// summary:
			//		Destroy this grid widget
			// tags:
			//		public extension
			// this._uninit();
			// this.inherited(arguments);
		},

		Grid.prototype.sort = function(options) {
			var t = this,
				columns = t._columnsById,
				optionsLen = options.length, i;

			for (i = 0; i < optionsLen; i++) {
				if (columns[options[i].colId].enableSorting === false) {
					return console.warn(options[i].colId, 'can not be sorted');
				}
			}

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

		Grid.prototype.resize = function(changeSize) {
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

		Grid.prototype._getSortOptions = function() {
			var cols = this._columns,
				options = [];

			cols.forEach(function(col) {
				if(col.sort && col.enableSorting !== false) {
					col.sort.colId = col.id;
					options.push(col.sort);
				}
			});

			options.sort(function(a, b) {
				a.priority = a.priority || Infinity;
				b.priority = b.priority || Infinity;

				return a.priority - b.priority;
			});

			return options.map(function(item) {
				return {colId: item.colId, descending: item.descending};
			});
		},

		Grid.prototype._escapeId = function(id) {
			return String(id).replace(/\\/g, "\\\\").replace(/\"/g, "\\\"").replace(/\'/g, "\\\'");
		},

		Grid.prototype._encodeHTML = function(id) {
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
	
		Grid.prototype._initEvents = function(objNames, evtNames) {
			var i = 0, j, comp, evt, evtName;
			while(comp = objNames[i++]){
				for(j = 0; evt = evtNames[j++];){
					evtName = 'on' + comp + evt;
					this[evtName] = this[evtName] || dummyFunc;
				}
			}
		};

		Grid.prototype._connectEvents = function(node, connector, scope) {
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
	
		Grid.prototype._isConnected = function(eventName) {
			return this[eventName] !== dummyFunc;
		};
		//event handling end

		Grid.prototype._isCtrlKey = function(evt) {
			// summary:
			//		On Mac Ctrl+click also opens a context menu. So call this to check ctrlKey instead of directly call evt.ctrlKey
			//		if you need to implement some handler for Ctrl+click.
			return has('mac') ? evt.metaKey : evt.ctrlKey;
		};

		return Grid;
	}]);
})();

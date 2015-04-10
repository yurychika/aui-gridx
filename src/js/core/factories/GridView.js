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

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
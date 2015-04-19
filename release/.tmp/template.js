angular.module('aui.grid').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('aui-grid/aui-grid-body',
    "<div class=\"gridxMain\" role=\"presentation\"><div class=\"gridxBodyEmpty\" role=\"alert\" tabindex=\"-1\" ng-show=\"isEmpty\">this is the empty body</div><div class=\"gridxBody\" role=\"presentation\" tabindex=\"0\"><div aui-grid-row ng-repeat=\"row in renderedRows\" row=\"row\"></div></div><!-- \t<div class=\"gridxVScroller\"tabindex=\"-1\">\r" +
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
    "<div class=\"gridxHeader\" role=\"presentation\"><div class=\"gridxHeaderRow\"><div class=\"gridxHeaderRowInner\" role=\"row\" style><table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><td ng-repeat=\"cell in headerCells\" aria-readonly=\"true\" role=\"gridcell\" tabindex=\"-1\" aria-describedby=\"grid-id\" colid=\"{{cell.id}}\" class=\"gridxCell {{cell.domClass}}\" style=\"{{cell.style}}\">{{cell.content}}</td></tr></tbody></table></div></div></div>"
  );


  $templateCache.put('aui-grid/aui-grid-pagination-bar',
    "<div class=\"gridx-pagination-bar\"><div class=\"gridx-pagination-bar-container\"><div class=\"gridx-pagination-bar-control\"><button type=\"button\" ng-click=\"paginationApi.goto(0)\" class=\"firstPage\" ng-disabled=\"cantPageBackward()\"><!-- <div class=\"first-triangle\"><div class=\"first-bar\"></div></div> -->first</button> <button type=\"button\" ng-click=\"paginationApi.previous()\" class=\"previous\" ng-disabled=\"cantPageBackward()\"><!-- <div class=\"first-triangle prev-triangle\"></div> -->prev</button> <input type=\"number\" ng-model=\"grid.currentPage\" class=\"currentPage\" min=\"1\" max=\"{{ paginationApi.getTotalPages() }}\" required> <span class=\"ui-grid-pager-max-pages-number\" ng-show=\"paginationApi.pageCount() > 0\">/ {{ paginationApi.pageCount() }}</span> <button type=\"button\" ng-click=\"paginationApi.next()\" class=\"next\" ng-disabled=\"cantPageForward()\"><!-- <div class=\"last-triangle next-triangle\"></div> -->next</button> <button type=\"button\" ng-click=\"paginationApi.goto(paginationApi.pageCount() - 1)\" class=\"last\" ng-disabled=\"cantPageToLast()\"><!-- <div class=\"last-triangle\"><div class=\"last-bar\"></div></div> -->last</button></div><div class=\"gridx-pagination-bar-sizes\"><select ng-model=\"grid.paginationPageSize\" ng-options=\"o as o for o in paginationPageSizes\"></select><span class=\"ui-grid-pager-row-count-label\">&nbsp;{{sizesLabel}}</span></div></div><div class=\"ui-grid-pager-count-container\"><div class=\"ui-grid-pager-count\"><span ng-show=\"grid.options.totalItems > 0\">{{showingLow}} - {{showingHigh}} of {{grid.options.totalItems}} {{totalItemsLabel}}</span></div></div></div>"
  );


  $templateCache.put('aui-grid/aui-grid-row',
    "<div class=\"gridxRow\" role=\"row\" visualindex=\"0\" rowid=\"0\" rowindex=\"0\" parentid=\"\"><table class=\"gridxRowTable\" role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><td ng-repeat=\"col in columns\" class=\"gridxCell\" aui-grid-cell field=\"col.field\" row=\"row\" col-id=\"col.id\" col=\"col\"></td></tr></tbody></table></div>"
  );


  $templateCache.put('aui-grid/aui-grid',
    "<div class=\"gridx\" role=\"grid\" tabindex=\"0\" aria-readonly=\"true\" aria-label=\"grid\"><div class=\"gridxLoad\"></div><div aui-grid-header></div><div aui-grid-body></div><div aui-grid-footer></div><span data-dojo-attach-point=\"lastFocusNode\" tabindex=\"0\"></span></div>"
  );

}]);

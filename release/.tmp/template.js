angular.module('aui.grid').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('aui-grid/aui-grid-body',
    "<div class=\"gridxMain\" role=\"presentation\"><div class=\"gridxBodyEmpty\" role=\"alert\" tabindex=\"-1\" ng-show=\"isEmpty\">this is the empty body</div><div class=\"gridxBody\" role=\"presentation\" tabindex=\"0\"><div class=\"gridxRow\" ng-repeat=\"row in renderedRows\" role=\"row\" visualindex=\"0\" rowid=\"0\" rowindex=\"0\" parentid=\"\" data-rowheight=\"53\"><table class=\"gridxRowTable\" role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr><td ng-repeat=\"(key, value) in row\" class=\"gridxCell\">{{value}}</td></tr></tbody></table></div></div><!-- \t<div class=\"gridxVScroller\"tabindex=\"-1\">\r" +
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


  $templateCache.put('aui-grid/aui-grid',
    "<div class=\"gridx\" role=\"grid\" tabindex=\"0\" aria-readonly=\"true\" aria-label=\"grid\"><div class=\"gridxLoad\"></div><div aui-grid-header></div><div aui-grid-body></div><!-- <div aui-grid-footer></div> --><span data-dojo-attach-point=\"lastFocusNode\" tabindex=\"0\"></span></div>"
  );

}]);

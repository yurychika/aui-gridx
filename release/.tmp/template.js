angular.module('aui.grid').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('aui-grid/aui-grid-footer',
    "<div class=\"gridxFooter\" data-dojo-attach-point=\"footerNode\">this is the footer<!-- \t<div class=\"gridxHScroller\">\r" +
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
    "<div class=\"gridxHeader\" role=\"presentation\">this is the header<div class=\"gridxHeaderRowInner\" role=\"row\" style><table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tbody></tbody></table></div></div>"
  );


  $templateCache.put('aui-grid/aui-grid',
    "<div class=\"gridx\" role=\"grid\" tabindex=\"0\" aria-readonly=\"true\" aria-label=\"grid\"><div class=\"gridxLoad\" data-dojo-attach-point=\"loadingNode\"></div><div aui-grid-header></div><div class=\"gridxMain\" role=\"presentation\" data-dojo-attach-point=\"mainNode\"><div class=\"gridxBodyEmpty\" role=\"alert\" tabindex=\"-1\" data-dojo-attach-point=\"emptyNode\"></div><div class=\"gridxBody\" role=\"presentation\" tabindex=\"0\" data-dojo-attach-point=\"bodyNode\"></div><div class=\"gridxVScroller\" data-dojo-attach-point=\"vScrollerNode\" tabindex=\"-1\"><div style=\"width: 1px\"></div></div></div><div aui-grid-footer></div><span data-dojo-attach-point=\"lastFocusNode\" tabindex=\"0\"></span></div>"
  );

}]);

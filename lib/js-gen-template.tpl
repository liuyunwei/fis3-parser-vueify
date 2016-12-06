var __vueify_style_dispose__ = require("./insert-css").insert("<%%>");

(function(){
	<%=data.script%>

})();

if (module.exports.__esModule) module.exports = module.exports.default

var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports);
<%if(data.hasTemplate) {%>
if (__vue__options__.functional) {console.warn("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = <%=data.render%>;
__vue__options__.staticRenderFns = <%=data.staticRenderFns%>;
<%}%>
<%if(data.scopeId){%>
__vue__options__._scopeId = "<%=data.scopeId%>";
<%}%>

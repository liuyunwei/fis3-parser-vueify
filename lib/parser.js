var vueTemplateCompiler = require("vue-template-compiler");
var validateTemplate = require('vue-template-validator');
var objectAssign = require('object-assign');
var _ = require("lodash");



var defaultOptions = {
	/* a template to gen the js file, it user underscore's template*/
	jsGenTemplateContent: require("fs").readFileSync("./js-gen-template.tpl").toString(),
	/* if extract the style file out */
	extractCss: true
};

var options = {};

var applyConfig = function(config){
	options = objectAssign({}, defaultOptions, config );
};


var parse = function(content, file, options){
	//
};

module.exports = function(content, file, settings){
	applyConfig(settings);

	return parse(content, file, options);

};
var vueTemplateCompiler = require("vue-template-compiler");
var validateTemplate = require('vue-template-validator');
var objectAssign = require('object-assign');
var _ = require("lodash");
var genId = require("./gen-id");
var styleScope = require("./style-scope");
var chalk = require("chalk");
var fs = require("fs");
var path = require("path");
var templateCompile = require("./template-compile");
var deindent = require("de-indent");

var defaultOptions = {
	/* a template to gen the js file, it user underscore's template*/
	jsGenTemplateContent: require("fs").readFileSync(path.resolve(__dirname, "./js-gen-template.tpl")).toString(),
	/* if extract the style file out */
	extractCss: true,
	scopeIdPrefix: "data-v-",
	genIdFunction: genId
};

var options = {};

var applyConfig = function(config){
	options = objectAssign({}, defaultOptions, config );
};

function getContent (part, filePath) {
  return part.src
    ? loadSrc(part.src, filePath)
    : part.content
};

function loadSrc (src, filePath) {
  var dir = path.dirname(filePath)
  var srcPath = path.resolve(dir, src)
  compiler.emit('dependency', srcPath)
  try {
    return fs.readFileSync(srcPath, 'utf-8')
  } catch (e) {
    console.error(chalk.red(
      'Failed to load src: "' + src +
      '" from file: "' + filePath + '"'
    ))
  }
};

var parse = function(content, file, opt){
	content = content.toString();
	var parts = vueTemplateCompiler.parseComponent(content, { pad: true });
	var scopeId = opt.scopeIdPrefix + genId(file.subpath);


	// process the style tag
	// check for scoped style nodes
	var hasScopeStyle = parts.styles.some(function(style){return style.scoped});
	parts.styles.forEach(function(style, index){
		var cssContent = getContent(style);
		//fis process
		cssContent = fis.compile.partial(cssContent, file, {
	    	ext: style.lang || "css",
	    	isCssLike: true
	    });
		// scoped process
		if(style.scoped) {
			cssContent = styleScope(scopeId, cssContent);
		}

		style.content = cssContent;

		if(opt.extractCss) {
			var styleFileName = file.realpathNoExt + '-auto-' + index + '.css';
			var styleFile = fis.file.wrap(styleFileName);
			styleFile.cache = file.cache;
			styleFile.isCssLike = true;
			styleFile.useHash = file.useHash;
			styleFile.setContent(cssContent);

			fis.compile.process(styleFile);

      		styleFile.links.forEach(function(derived) {
        		file.addLink(derived);
      		});
      		file.derived.push(styleFile);
      		file.addRequire(styleFile.getId());
		}
	});

	// process the script tag
	if(parts.script){
		// in case of <script src="" />
		var jsContent = getContent(parts.script);
		jsContent = fis.compile.partial(jsContent, file, {
			ext: parts.script.lang || "js",
			isJsLike: true
		});
		parts.script.content = jsContent;
	}


	// process the template tag
	if(parts.template){
		var template = parts.template;
		var templateContent = getContent(template);
		validateTemplate(templateContent).forEach(function(msg) {
	       	console.error(chalk.red(
		    	msg + " file:" + file.filename  
	    	))
	    });
		templateContent = deindent(templateContent);
	    templateContent = templateContent.replace(/(^[\r\n]*)|([\r\n]*$)/g, '');
		templateContent = fis.compile.partial(templateContent, file, {
	    	ext: parts.template.lang || "html",
	    	isHtmlLike: true
	    });

		template.content = templateContent;
		var templateResult = templateCompile(templateContent);
		template.render = templateResult.render;
		template.staticRenderFns = templateResult.staticRenderFns;
	}


	var tplData = {
		data: parts,
		options: opt,
		hasScopeStyle: hasScopeStyle,
		scopeId: scopeId
	};
	var genJsTemplateCompile = _.template(opt.jsGenTemplateContent);
	return genJsTemplateCompile(tplData);

};

module.exports = function(content, file, settings){
	applyConfig(settings);

	return parse(content, file, options);

};
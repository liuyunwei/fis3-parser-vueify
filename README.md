# fis3-parser-vueify
parse the .vue file for fis3

** NOTE: 还在开发中，暂时仅支持vue2

## 用途
> 使用fis3作为构建工具时，用来解析 .vue的文件，作为一个parser plugin。


## 与vueify的不同
* 不编译异构语言，比如jade，es2015，这些内容的编译需要结合fis的其他插件来进行。这样做就保持了插件单纯，不破坏fis的文件处理流程，不影响其他组件的工作
* 会对资源进行fis的管理替换，具体请看fis的文档
* 对scopeId进行了优化，因为fis3开发中通常将css抽出来，稳定的scopeId有利于缓存.
* 未来将会添加对 css module的支持，更好的更其他生态结合
* vueify是异步的，fis3是同步的构建流程，所以该插件是同步的

## 与fis3-parser-vue的不同
* fis3-parser-vue直接了 vueify的同步版本，其差异类似vueify

## 与fis3-parser-vue-component的不同
* fis3-parser-vue-component对<template></template>的处理，是直接嵌入了字符串，未编译，有效率问题，该插件将会编译，只需要引入 vue.runtime即可工作
* fis3-parser-vue-component对css scoped管理采用手动的替换方式，与原设计开发存在差异
* 支持jsx的render

##快速使用

 - `npm install --save-dev fis3-parser-vueify`
 - 在`fis-conf.js`中加入

    

```js
var vueify = require("fis3-parser-vueify");
fis.match('src/**.vue', {
  isMod: true,
  rExt: 'js',
  useSameNameRequire: true,
  parser: fis.plugin(vueify, {
    //extractCss: false //默认是将css抽取出来的,
  })  
});
  
```
- 更多与fis相关的内容可以参考代码中的test目录，为测试项目，并结合fis的文档。


## 插件配置项

### extractCss {boolean}
是否将css文件抽取为单独的文件。`true` （抽出）， `false`（内联）。默认值为`true`，如果需要内联，请配置为`false`。
建议抽出，更好的利用静态文件的缓存。
> 如果需要内联时，项目需要依赖 vueify-insert-css。所以需要在项目根目录中 ` npm install --save vueify-insert-css `

### jsGenTemplateContent
生成js文件的模板，用以覆盖文件/lib/js-gen-template.tpl中的内容。多数情况下不需要配置该内容，高级用法。
用的是underscore的模板语法，具体编译结果提供的数据包含以下内容，
```js
{
	data: {
			styles: [{
				content: '' //编译后的css的内容
				}],
			script: {
				content: '' //编译后的js内容
				},
			template:{  //vue编译后的模板函数内容
				staticRenderFns: '', 
				render: ''
			}
		},
	options: {
		//这里包含了所有配置项，如 extractCss。并且包括用户自己传入的配置
	},
	scopeId: "data-v-dsfdsfads"
}
```

### scopeIdPrefix
scopeId的前缀，默认为 `data-v-`

### genIdFunction
生成scopeId的方法，此方法接受filePath作为参数。默认为`/lib/gen-id.js`。
因为scopeId将会影响编译css的内容，从而影响css文件最终的md5签名。所以此处的函数最好是纯函数，以更好地利用缓存。bad case：用文件了列表编号作为id，这不是个好的方式，添加删除文件时就会引起其他不相干文件的编号改变。

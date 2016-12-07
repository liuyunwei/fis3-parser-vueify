# fis3-parser-vueify
parse the .vue file for fis3

**NOTE: 还在开发中，请不要使用，暂时仅支持vue2

##用途
>使用fis3作为构建工具时，用来解析 .vue的文件，作为一个parser plugin。


##与vueify的不同
>不编译异构语言，比如jade，es2015，这些内容的编译需要结合fis的其他插件来进行。这样做就保持了插件单纯，不破坏fis的文件处理流程，不影响其他组件的工作
>会对资源进行fis的管理替换，具体请看fis的文档
>对scopeId进行了优化，因为fis3开发中通常将css抽出来，稳定的scopeId有利于缓存.
>未来将会添加对 css module的支持，更好的更其他生态结合
>vueify是异步的，fis3是同步的构建流程，所以该插件是同步的

##与fis3-parser-vue的不同
>fis3-parser-vue直接了 vueify的同步版本，其差异类似vueify

##与fis3-parser-vue-component的不同
>fis3-parser-vue-component对<template></template>的处理，是直接嵌入了字符串，未编译，有效率问题，该插件将会编译，只需要引入 vue.runtime即可工作
>fis3-parser-vue-component对css scoped管理采用手动的替换方式，与原设计开发存在差异
>支持jsx的render



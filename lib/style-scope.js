/*copy from vueify*/
var postcss = require('postcss')
var selectorParser = require('postcss-selector-parser')
var cache = require('lru-cache')(100)
var assign = require('object-assign')

var currentId
var addId = postcss.plugin('add-id', function () {
  return function (root) {
    root.each(function rewriteSelector (node) {
      if (!node.selector) {
        // handle media queries
        if (node.type === 'atrule' && node.name === 'media') {
          node.each(rewriteSelector)
        }
        return
      }
      node.selector = selectorParser(function (selectors) {
        selectors.each(function (selector) {
          var node = null
          selector.each(function (n) {
            if (n.type !== 'pseudo') node = n
          })
          selector.insertAfter(node, selectorParser.attribute({
            attribute: currentId
          }))
        })
      }).process(node.selector).result
    })
  }
});


/**
 * Add attribute selector to css
 *
 * @param {String} id
 * @param {String} cssContent
 * @param {Object} options
 * @return {css}
 */

module.exports = function (id, cssContent, options) {
  var key = id + '!!' + fis.util.md5(cssContent);
  var val = cache.get(key)
  if(val) {
    return val;
  }

  currentId = id
  return postcss([addId]).process(cssContent, options).toString();
  
}


import Vue from  'vue';

import Index from '../../component/index';


require(["./xx.js"], function(a){
  console.log("async done", a);
});

var app = new Vue({
  el: '#app',
  methods: {

  },

  created() {
    console.log('created');
  },
  render(h) {
    return (<Index></Index>);
  }
});

/**
 * @require '../../less/index.less'
 */

'use strict';

var Mt = require("./mt.js");
var Block = require("../../lib/js/block.js");

function tst(param) {
  for(var i = (console.log("hi"), 0) ,i_finish = (console.log("hello"), 3); i <= i_finish; ++i){
    
  }
  
}

function test2(param) {
  var v = 0;
  v = 3;
  v = 10;
  for(var i = 0; i <= 1; ++i){
    
  }
  return v;
}

var suites_000 = /* tuple */[
  "for_order",
  (function (param) {
      return /* Eq */Block.__(0, [
                10,
                test2(undefined)
              ]);
    })
];

var suites = /* :: */[
  suites_000,
  /* [] */0
];

Mt.from_pair_suites("For_side_effect_test", suites);

exports.tst = tst;
exports.test2 = test2;
exports.suites = suites;
/*  Not a pure module */

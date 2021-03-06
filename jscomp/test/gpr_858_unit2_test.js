'use strict';

var Curry = require("../../lib/js/curry.js");
var Caml_builtin_exceptions = require("../../lib/js/caml_builtin_exceptions.js");

var delayed = {
  contents: (function (param) {
      
    })
};

for(var i = 1; i <= 2; ++i){
  var f = (function(i){
  return function f(n, j) {
    if (j !== 0) {
      var prev = delayed.contents;
      delayed.contents = (function (param) {
          Curry._1(prev, undefined);
          return f(((n + 1 | 0) + i | 0) - i | 0, j - 1 | 0);
        });
      return ;
    }
    if (i === n) {
      return ;
    }
    throw [
          Caml_builtin_exceptions.assert_failure,
          /* tuple */[
            "gpr_858_unit2_test.ml",
            6,
            13
          ]
        ];
  }
  }(i));
  f(0, i);
}

Curry._1(delayed.contents, undefined);

/*  Not a pure module */

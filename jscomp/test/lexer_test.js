'use strict';

var Mt = require("./mt.js");
var List = require("../../lib/js/list.js");
var Block = require("../../lib/js/block.js");
var Curry = require("../../lib/js/curry.js");
var Lexing = require("../../lib/js/lexing.js");
var Arith_lexer = require("./arith_lexer.js");
var Arith_parser = require("./arith_parser.js");
var Arith_syntax = require("./arith_syntax.js");
var Number_lexer = require("./number_lexer.js");
var Caml_builtin_exceptions = require("../../lib/js/caml_builtin_exceptions.js");

function get_tokens(lex, str) {
  var buf = Lexing.from_string(str);
  var _acc = /* [] */0;
  while(true) {
    var acc = _acc;
    var v = Curry._1(lex, buf);
    if (v === /* EOF */7) {
      return List.rev(acc);
    }
    _acc = /* :: */[
      v,
      acc
    ];
    continue ;
  };
}

function f(param) {
  return get_tokens(Arith_lexer.lexeme, param);
}

function from_tokens(lst) {
  var l = {
    contents: lst
  };
  return (function (param) {
      var match = l.contents;
      if (match) {
        l.contents = match[1];
        return match[0];
      }
      throw Caml_builtin_exceptions.end_of_file;
    });
}

var lexer_suites_000 = /* tuple */[
  "arith_token",
  (function (param) {
      return /* Eq */Block.__(0, [
                get_tokens(Arith_lexer.lexeme, "x + 3 + 4 + y"),
                /* :: */[
                  /* IDENT */Block.__(1, ["x"]),
                  /* :: */[
                    /* PLUS */0,
                    /* :: */[
                      /* NUMERAL */Block.__(0, [3]),
                      /* :: */[
                        /* PLUS */0,
                        /* :: */[
                          /* NUMERAL */Block.__(0, [4]),
                          /* :: */[
                            /* PLUS */0,
                            /* :: */[
                              /* IDENT */Block.__(1, ["y"]),
                              /* [] */0
                            ]
                          ]
                        ]
                      ]
                    ]
                  ]
                ]
              ]);
    })
];

var lexer_suites_001 = /* :: */[
  /* tuple */[
    "simple token",
    (function (param) {
        return /* Eq */Block.__(0, [
                  Arith_lexer.lexeme(Lexing.from_string("10")),
                  /* NUMERAL */Block.__(0, [10])
                ]);
      })
  ],
  /* :: */[
    /* tuple */[
      "number_lexer",
      (function (param) {
          var v = {
            contents: /* [] */0
          };
          var add = function (t) {
            v.contents = /* :: */[
              t,
              v.contents
            ];
            
          };
          Number_lexer.token(add, Lexing.from_string("32 + 32 ( ) * / "));
          return /* Eq */Block.__(0, [
                    List.rev(v.contents),
                    /* :: */[
                      "number",
                      /* :: */[
                        "32",
                        /* :: */[
                          "new line",
                          /* :: */[
                            "+",
                            /* :: */[
                              "new line",
                              /* :: */[
                                "number",
                                /* :: */[
                                  "32",
                                  /* :: */[
                                    "new line",
                                    /* :: */[
                                      "(",
                                      /* :: */[
                                        "new line",
                                        /* :: */[
                                          ")",
                                          /* :: */[
                                            "new line",
                                            /* :: */[
                                              "*",
                                              /* :: */[
                                                "new line",
                                                /* :: */[
                                                  "/",
                                                  /* :: */[
                                                    "new line",
                                                    /* :: */[
                                                      "eof",
                                                      /* [] */0
                                                    ]
                                                  ]
                                                ]
                                              ]
                                            ]
                                          ]
                                        ]
                                      ]
                                    ]
                                  ]
                                ]
                              ]
                            ]
                          ]
                        ]
                      ]
                    ]
                  ]);
        })
    ],
    /* :: */[
      /* tuple */[
        "simple number",
        (function (param) {
            return /* Eq */Block.__(0, [
                      Arith_syntax.str(Arith_parser.toplevel(Arith_lexer.lexeme, Lexing.from_string("10"))),
                      "10."
                    ]);
          })
      ],
      /* :: */[
        /* tuple */[
          "arith",
          (function (param) {
              return /* Eq */Block.__(0, [
                        Arith_syntax.str(Arith_parser.toplevel(Arith_lexer.lexeme, Lexing.from_string("x + 3 + 4 + y"))),
                        "x+3.+4.+y"
                      ]);
            })
        ],
        /* [] */0
      ]
    ]
  ]
];

var lexer_suites = /* :: */[
  lexer_suites_000,
  lexer_suites_001
];

Mt.from_pair_suites("Lexer_test", lexer_suites);

exports.get_tokens = get_tokens;
exports.f = f;
exports.from_tokens = from_tokens;
exports.lexer_suites = lexer_suites;
/*  Not a pure module */



import * as Sys from "./sys.js";
import * as List from "./list.js";
import * as $$Array from "./array.js";
import * as Block from "./block.js";
import * as Bytes from "./bytes.js";
import * as Curry from "./curry.js";
import * as $$Buffer from "./buffer.js";
import * as Printf from "./printf.js";
import * as $$String from "./string.js";
import * as Caml_io from "./caml_io.js";
import * as Caml_obj from "./caml_obj.js";
import * as Caml_array from "./caml_array.js";
import * as Caml_bytes from "./caml_bytes.js";
import * as Pervasives from "./pervasives.js";
import * as Caml_format from "./caml_format.js";
import * as Caml_string from "./caml_string.js";
import * as Caml_primitive from "./caml_primitive.js";
import * as Caml_exceptions from "./caml_exceptions.js";
import * as Caml_js_exceptions from "./caml_js_exceptions.js";
import * as Caml_external_polyfill from "./caml_external_polyfill.js";
import * as Caml_builtin_exceptions from "./caml_builtin_exceptions.js";

var Bad = Caml_exceptions.create("Arg.Bad");

var Help = Caml_exceptions.create("Arg.Help");

var Stop = Caml_exceptions.create("Arg.Stop");

function assoc3(x, _l) {
  while(true) {
    var l = _l;
    if (l) {
      var match = l[0];
      if (Caml_obj.caml_equal(match[0], x)) {
        return match[1];
      }
      _l = l[1];
      continue ;
    }
    throw Caml_builtin_exceptions.not_found;
  };
}

function split(s) {
  var i = $$String.index(s, /* "=" */61);
  var len = s.length;
  return /* tuple */[
          $$String.sub(s, 0, i),
          $$String.sub(s, i + 1 | 0, len - (i + 1 | 0) | 0)
        ];
}

function make_symlist(prefix, sep, suffix, l) {
  if (l) {
    return List.fold_left((function (x, y) {
                  return x + (sep + y);
                }), prefix + l[0], l[1]) + suffix;
  } else {
    return "<none>";
  }
}

function help_action(param) {
  throw [
        Stop,
        /* Unknown */Block.__(0, ["-help"])
      ];
}

function add_help(speclist) {
  var add1;
  try {
    assoc3("-help", speclist);
    add1 = /* [] */0;
  }
  catch (exn){
    if (exn === Caml_builtin_exceptions.not_found) {
      add1 = /* :: */[
        /* tuple */[
          "-help",
          /* Unit */Block.__(0, [help_action]),
          " Display this list of options"
        ],
        /* [] */0
      ];
    } else {
      throw exn;
    }
  }
  var add2;
  try {
    assoc3("--help", speclist);
    add2 = /* [] */0;
  }
  catch (exn$1){
    if (exn$1 === Caml_builtin_exceptions.not_found) {
      add2 = /* :: */[
        /* tuple */[
          "--help",
          /* Unit */Block.__(0, [help_action]),
          " Display this list of options"
        ],
        /* [] */0
      ];
    } else {
      throw exn$1;
    }
  }
  return Pervasives.$at(speclist, Pervasives.$at(add1, add2));
}

function usage_b(buf, speclist, errmsg) {
  Curry._1(Printf.bprintf(buf, /* Format */[
            /* String */Block.__(2, [
                /* No_padding */0,
                /* Char_literal */Block.__(12, [
                    /* "\n" */10,
                    /* End_of_format */0
                  ])
              ]),
            "%s\n"
          ]), errmsg);
  return List.iter((function (param) {
                var doc = param[2];
                if (doc.length === 0) {
                  return ;
                }
                var spec = param[1];
                var key = param[0];
                if (spec.tag === /* Symbol */11) {
                  return Curry._3(Printf.bprintf(buf, /* Format */[
                                  /* String_literal */Block.__(11, [
                                      "  ",
                                      /* String */Block.__(2, [
                                          /* No_padding */0,
                                          /* Char_literal */Block.__(12, [
                                              /* " " */32,
                                              /* String */Block.__(2, [
                                                  /* No_padding */0,
                                                  /* String */Block.__(2, [
                                                      /* No_padding */0,
                                                      /* Char_literal */Block.__(12, [
                                                          /* "\n" */10,
                                                          /* End_of_format */0
                                                        ])
                                                    ])
                                                ])
                                            ])
                                        ])
                                    ]),
                                  "  %s %s%s\n"
                                ]), key, make_symlist("{", "|", "}", spec[0]), doc);
                } else {
                  return Curry._2(Printf.bprintf(buf, /* Format */[
                                  /* String_literal */Block.__(11, [
                                      "  ",
                                      /* String */Block.__(2, [
                                          /* No_padding */0,
                                          /* Char_literal */Block.__(12, [
                                              /* " " */32,
                                              /* String */Block.__(2, [
                                                  /* No_padding */0,
                                                  /* Char_literal */Block.__(12, [
                                                      /* "\n" */10,
                                                      /* End_of_format */0
                                                    ])
                                                ])
                                            ])
                                        ])
                                    ]),
                                  "  %s %s\n"
                                ]), key, doc);
                }
              }), add_help(speclist));
}

function usage_string(speclist, errmsg) {
  var b = $$Buffer.create(200);
  usage_b(b, speclist, errmsg);
  return $$Buffer.contents(b);
}

function usage(speclist, errmsg) {
  return Curry._1(Printf.eprintf(/* Format */[
                  /* String */Block.__(2, [
                      /* No_padding */0,
                      /* End_of_format */0
                    ]),
                  "%s"
                ]), usage_string(speclist, errmsg));
}

var current = {
  contents: 0
};

function bool_of_string_opt(x) {
  try {
    return Pervasives.bool_of_string(x);
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn[0] === Caml_builtin_exceptions.invalid_argument) {
      return ;
    }
    throw exn;
  }
}

function int_of_string_opt(x) {
  try {
    return Caml_format.caml_int_of_string(x);
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn[0] === Caml_builtin_exceptions.failure) {
      return ;
    }
    throw exn;
  }
}

function float_of_string_opt(x) {
  try {
    return Caml_format.caml_float_of_string(x);
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn[0] === Caml_builtin_exceptions.failure) {
      return ;
    }
    throw exn;
  }
}

function parse_and_expand_argv_dynamic_aux(allow_expand, current, argv, speclist, anonfun, errmsg) {
  var initpos = current.contents;
  var convert_error = function (error) {
    var b = $$Buffer.create(200);
    var progname = initpos < argv.contents.length ? Caml_array.caml_array_get(argv.contents, initpos) : "(?)";
    switch (error.tag | 0) {
      case /* Unknown */0 :
          var s = error[0];
          switch (s) {
            case "--help" :
            case "-help" :
                break;
            default:
              Curry._2(Printf.bprintf(b, /* Format */[
                        /* String */Block.__(2, [
                            /* No_padding */0,
                            /* String_literal */Block.__(11, [
                                ": unknown option '",
                                /* String */Block.__(2, [
                                    /* No_padding */0,
                                    /* String_literal */Block.__(11, [
                                        "'.\n",
                                        /* End_of_format */0
                                      ])
                                  ])
                              ])
                          ]),
                        "%s: unknown option '%s'.\n"
                      ]), progname, s);
          }
          break;
      case /* Wrong */1 :
          Curry._4(Printf.bprintf(b, /* Format */[
                    /* String */Block.__(2, [
                        /* No_padding */0,
                        /* String_literal */Block.__(11, [
                            ": wrong argument '",
                            /* String */Block.__(2, [
                                /* No_padding */0,
                                /* String_literal */Block.__(11, [
                                    "'; option '",
                                    /* String */Block.__(2, [
                                        /* No_padding */0,
                                        /* String_literal */Block.__(11, [
                                            "' expects ",
                                            /* String */Block.__(2, [
                                                /* No_padding */0,
                                                /* String_literal */Block.__(11, [
                                                    ".\n",
                                                    /* End_of_format */0
                                                  ])
                                              ])
                                          ])
                                      ])
                                  ])
                              ])
                          ])
                      ]),
                    "%s: wrong argument '%s'; option '%s' expects %s.\n"
                  ]), progname, error[1], error[0], error[2]);
          break;
      case /* Missing */2 :
          Curry._2(Printf.bprintf(b, /* Format */[
                    /* String */Block.__(2, [
                        /* No_padding */0,
                        /* String_literal */Block.__(11, [
                            ": option '",
                            /* String */Block.__(2, [
                                /* No_padding */0,
                                /* String_literal */Block.__(11, [
                                    "' needs an argument.\n",
                                    /* End_of_format */0
                                  ])
                              ])
                          ])
                      ]),
                    "%s: option '%s' needs an argument.\n"
                  ]), progname, error[0]);
          break;
      case /* Message */3 :
          Curry._2(Printf.bprintf(b, /* Format */[
                    /* String */Block.__(2, [
                        /* No_padding */0,
                        /* String_literal */Block.__(11, [
                            ": ",
                            /* String */Block.__(2, [
                                /* No_padding */0,
                                /* String_literal */Block.__(11, [
                                    ".\n",
                                    /* End_of_format */0
                                  ])
                              ])
                          ])
                      ]),
                    "%s: %s.\n"
                  ]), progname, error[0]);
          break;
      
    }
    usage_b(b, speclist.contents, errmsg);
    if (Caml_obj.caml_equal(error, /* Unknown */Block.__(0, ["-help"])) || Caml_obj.caml_equal(error, /* Unknown */Block.__(0, ["--help"]))) {
      return [
              Help,
              $$Buffer.contents(b)
            ];
    } else {
      return [
              Bad,
              $$Buffer.contents(b)
            ];
    }
  };
  current.contents = current.contents + 1 | 0;
  while(current.contents < argv.contents.length) {
    try {
      var s = Caml_array.caml_array_get(argv.contents, current.contents);
      if (s.length >= 1 && Caml_string.get(s, 0) === /* "-" */45) {
        var match;
        try {
          match = /* tuple */[
            assoc3(s, speclist.contents),
            undefined
          ];
        }
        catch (exn){
          if (exn === Caml_builtin_exceptions.not_found) {
            try {
              var match$1 = split(s);
              match = /* tuple */[
                assoc3(match$1[0], speclist.contents),
                match$1[1]
              ];
            }
            catch (exn$1){
              if (exn$1 === Caml_builtin_exceptions.not_found) {
                throw [
                      Stop,
                      /* Unknown */Block.__(0, [s])
                    ];
              }
              throw exn$1;
            }
          } else {
            throw exn;
          }
        }
        var follow = match[1];
        var no_arg = (function(s,follow){
        return function no_arg(param) {
          if (follow === undefined) {
            return ;
          }
          throw [
                Stop,
                /* Wrong */Block.__(1, [
                    s,
                    follow,
                    "no argument"
                  ])
              ];
        }
        }(s,follow));
        var get_arg = (function(s,follow){
        return function get_arg(param) {
          if (follow !== undefined) {
            return follow;
          }
          if ((current.contents + 1 | 0) < argv.contents.length) {
            return Caml_array.caml_array_get(argv.contents, current.contents + 1 | 0);
          }
          throw [
                Stop,
                /* Missing */Block.__(2, [s])
              ];
        }
        }(s,follow));
        var consume_arg = (function(follow){
        return function consume_arg(param) {
          if (follow !== undefined) {
            return ;
          } else {
            current.contents = current.contents + 1 | 0;
            return ;
          }
        }
        }(follow));
        var treat_action = (function(s){
        return function treat_action(f) {
          switch (f.tag | 0) {
            case /* Unit */0 :
                return Curry._1(f[0], undefined);
            case /* Bool */1 :
                var arg = get_arg(undefined);
                var s$1 = bool_of_string_opt(arg);
                if (s$1 !== undefined) {
                  Curry._1(f[0], s$1);
                } else {
                  throw [
                        Stop,
                        /* Wrong */Block.__(1, [
                            s,
                            arg,
                            "a boolean"
                          ])
                      ];
                }
                return consume_arg(undefined);
            case /* Set */2 :
                no_arg(undefined);
                f[0].contents = true;
                return ;
            case /* Clear */3 :
                no_arg(undefined);
                f[0].contents = false;
                return ;
            case /* String */4 :
                var arg$1 = get_arg(undefined);
                Curry._1(f[0], arg$1);
                return consume_arg(undefined);
            case /* Set_string */5 :
                f[0].contents = get_arg(undefined);
                return consume_arg(undefined);
            case /* Int */6 :
                var arg$2 = get_arg(undefined);
                var x = int_of_string_opt(arg$2);
                if (x !== undefined) {
                  Curry._1(f[0], x);
                } else {
                  throw [
                        Stop,
                        /* Wrong */Block.__(1, [
                            s,
                            arg$2,
                            "an integer"
                          ])
                      ];
                }
                return consume_arg(undefined);
            case /* Set_int */7 :
                var arg$3 = get_arg(undefined);
                var x$1 = int_of_string_opt(arg$3);
                if (x$1 !== undefined) {
                  f[0].contents = x$1;
                } else {
                  throw [
                        Stop,
                        /* Wrong */Block.__(1, [
                            s,
                            arg$3,
                            "an integer"
                          ])
                      ];
                }
                return consume_arg(undefined);
            case /* Float */8 :
                var arg$4 = get_arg(undefined);
                var x$2 = float_of_string_opt(arg$4);
                if (x$2 !== undefined) {
                  Curry._1(f[0], x$2);
                } else {
                  throw [
                        Stop,
                        /* Wrong */Block.__(1, [
                            s,
                            arg$4,
                            "a float"
                          ])
                      ];
                }
                return consume_arg(undefined);
            case /* Set_float */9 :
                var arg$5 = get_arg(undefined);
                var x$3 = float_of_string_opt(arg$5);
                if (x$3 !== undefined) {
                  f[0].contents = x$3;
                } else {
                  throw [
                        Stop,
                        /* Wrong */Block.__(1, [
                            s,
                            arg$5,
                            "a float"
                          ])
                      ];
                }
                return consume_arg(undefined);
            case /* Tuple */10 :
                return List.iter(treat_action, f[0]);
            case /* Symbol */11 :
                var symb = f[0];
                var arg$6 = get_arg(undefined);
                if (List.mem(arg$6, symb)) {
                  Curry._1(f[1], arg$6);
                  return consume_arg(undefined);
                }
                throw [
                      Stop,
                      /* Wrong */Block.__(1, [
                          s,
                          arg$6,
                          "one of: " + make_symlist("", " ", "", symb)
                        ])
                    ];
            case /* Rest */12 :
                var f$1 = f[0];
                while(current.contents < (argv.contents.length - 1 | 0)) {
                  Curry._1(f$1, Caml_array.caml_array_get(argv.contents, current.contents + 1 | 0));
                  consume_arg(undefined);
                };
                return ;
            case /* Expand */13 :
                if (!allow_expand) {
                  throw [
                        Caml_builtin_exceptions.invalid_argument,
                        "Arg.Expand is is only allowed with Arg.parse_and_expand_argv_dynamic"
                      ];
                }
                var arg$7 = get_arg(undefined);
                var newarg = Curry._1(f[0], arg$7);
                consume_arg(undefined);
                var before = $$Array.sub(argv.contents, 0, current.contents + 1 | 0);
                var after = $$Array.sub(argv.contents, current.contents + 1 | 0, (argv.contents.length - current.contents | 0) - 1 | 0);
                argv.contents = Caml_array.caml_array_concat(/* :: */[
                      before,
                      /* :: */[
                        newarg,
                        /* :: */[
                          after,
                          /* [] */0
                        ]
                      ]
                    ]);
                return ;
            
          }
        }
        }(s));
        treat_action(match[0]);
      } else {
        Curry._1(anonfun, s);
      }
    }
    catch (raw_m){
      var m = Caml_js_exceptions.internalToOCamlException(raw_m);
      if (m[0] === Bad) {
        throw convert_error(/* Message */Block.__(3, [m[1]]));
      }
      if (m[0] === Stop) {
        throw convert_error(m[1]);
      }
      throw m;
    }
    current.contents = current.contents + 1 | 0;
  };
  
}

function parse_and_expand_argv_dynamic(current, argv, speclist, anonfun, errmsg) {
  return parse_and_expand_argv_dynamic_aux(true, current, argv, speclist, anonfun, errmsg);
}

function parse_argv_dynamic(currentOpt, argv, speclist, anonfun, errmsg) {
  var current$1 = currentOpt !== undefined ? currentOpt : current;
  return parse_and_expand_argv_dynamic_aux(false, current$1, {
              contents: argv
            }, speclist, anonfun, errmsg);
}

function parse_argv(currentOpt, argv, speclist, anonfun, errmsg) {
  var current$1 = currentOpt !== undefined ? currentOpt : current;
  return parse_argv_dynamic(current$1, argv, {
              contents: speclist
            }, anonfun, errmsg);
}

function parse(l, f, msg) {
  try {
    return parse_argv(undefined, Sys.argv, l, f, msg);
  }
  catch (raw_msg){
    var msg$1 = Caml_js_exceptions.internalToOCamlException(raw_msg);
    if (msg$1[0] === Bad) {
      Curry._1(Printf.eprintf(/* Format */[
                /* String */Block.__(2, [
                    /* No_padding */0,
                    /* End_of_format */0
                  ]),
                "%s"
              ]), msg$1[1]);
      return Pervasives.exit(2);
    }
    if (msg$1[0] === Help) {
      Curry._1(Printf.printf(/* Format */[
                /* String */Block.__(2, [
                    /* No_padding */0,
                    /* End_of_format */0
                  ]),
                "%s"
              ]), msg$1[1]);
      return Pervasives.exit(0);
    }
    throw msg$1;
  }
}

function parse_dynamic(l, f, msg) {
  try {
    return parse_argv_dynamic(undefined, Sys.argv, l, f, msg);
  }
  catch (raw_msg){
    var msg$1 = Caml_js_exceptions.internalToOCamlException(raw_msg);
    if (msg$1[0] === Bad) {
      Curry._1(Printf.eprintf(/* Format */[
                /* String */Block.__(2, [
                    /* No_padding */0,
                    /* End_of_format */0
                  ]),
                "%s"
              ]), msg$1[1]);
      return Pervasives.exit(2);
    }
    if (msg$1[0] === Help) {
      Curry._1(Printf.printf(/* Format */[
                /* String */Block.__(2, [
                    /* No_padding */0,
                    /* End_of_format */0
                  ]),
                "%s"
              ]), msg$1[1]);
      return Pervasives.exit(0);
    }
    throw msg$1;
  }
}

function parse_expand(l, f, msg) {
  try {
    var argv = {
      contents: Sys.argv
    };
    var spec = {
      contents: l
    };
    var current$1 = {
      contents: current.contents
    };
    return parse_and_expand_argv_dynamic(current$1, argv, spec, f, msg);
  }
  catch (raw_msg){
    var msg$1 = Caml_js_exceptions.internalToOCamlException(raw_msg);
    if (msg$1[0] === Bad) {
      Curry._1(Printf.eprintf(/* Format */[
                /* String */Block.__(2, [
                    /* No_padding */0,
                    /* End_of_format */0
                  ]),
                "%s"
              ]), msg$1[1]);
      return Pervasives.exit(2);
    }
    if (msg$1[0] === Help) {
      Curry._1(Printf.printf(/* Format */[
                /* String */Block.__(2, [
                    /* No_padding */0,
                    /* End_of_format */0
                  ]),
                "%s"
              ]), msg$1[1]);
      return Pervasives.exit(0);
    }
    throw msg$1;
  }
}

function second_word(s) {
  var len = s.length;
  var loop = function (_n) {
    while(true) {
      var n = _n;
      if (n >= len) {
        return len;
      }
      if (Caml_string.get(s, n) !== /* " " */32) {
        return n;
      }
      _n = n + 1 | 0;
      continue ;
    };
  };
  var n;
  try {
    n = $$String.index(s, /* "\t" */9);
  }
  catch (exn){
    if (exn === Caml_builtin_exceptions.not_found) {
      var exit = 0;
      var n$1;
      try {
        n$1 = $$String.index(s, /* " " */32);
        exit = 2;
      }
      catch (exn$1){
        if (exn$1 === Caml_builtin_exceptions.not_found) {
          return len;
        }
        throw exn$1;
      }
      if (exit === 2) {
        return loop(n$1 + 1 | 0);
      }
      
    } else {
      throw exn;
    }
  }
  return loop(n + 1 | 0);
}

function max_arg_len(cur, param) {
  var kwd = param[0];
  if (param[1].tag === /* Symbol */11) {
    return Caml_primitive.caml_int_max(cur, kwd.length);
  } else {
    return Caml_primitive.caml_int_max(cur, kwd.length + second_word(param[2]) | 0);
  }
}

function replace_leading_tab(s) {
  var seen = {
    contents: false
  };
  return $$String.map((function (c) {
                if (c !== 9 || seen.contents) {
                  return c;
                } else {
                  seen.contents = true;
                  return /* " " */32;
                }
              }), s);
}

function align(limitOpt, speclist) {
  var limit = limitOpt !== undefined ? limitOpt : Pervasives.max_int;
  var completed = add_help(speclist);
  var len = List.fold_left(max_arg_len, 0, completed);
  var len$1 = len < limit ? len : limit;
  return List.map((function (param) {
                var spec = param[1];
                var kwd = param[0];
                if (param[2] === "") {
                  return param;
                }
                if (spec.tag === /* Symbol */11) {
                  var msg = param[2];
                  var cutcol = second_word(msg);
                  var n = Caml_primitive.caml_int_max(0, len$1 - cutcol | 0) + 3 | 0;
                  var spaces = Caml_bytes.bytes_to_string(Bytes.make(n, /* " " */32));
                  return /* tuple */[
                          kwd,
                          spec,
                          "\n" + (spaces + replace_leading_tab(msg))
                        ];
                }
                var msg$1 = param[2];
                var cutcol$1 = second_word(msg$1);
                var kwd_len = kwd.length;
                var diff = (len$1 - kwd_len | 0) - cutcol$1 | 0;
                if (diff <= 0) {
                  return /* tuple */[
                          kwd,
                          spec,
                          replace_leading_tab(msg$1)
                        ];
                }
                var spaces$1 = Caml_bytes.bytes_to_string(Bytes.make(diff, /* " " */32));
                var prefix = $$String.sub(replace_leading_tab(msg$1), 0, cutcol$1);
                var suffix = $$String.sub(msg$1, cutcol$1, msg$1.length - cutcol$1 | 0);
                return /* tuple */[
                        kwd,
                        spec,
                        prefix + (spaces$1 + suffix)
                      ];
              }), completed);
}

function trim_cr(s) {
  var len = s.length;
  if (len > 0 && Caml_string.get(s, len - 1 | 0) === /* "\r" */13) {
    return $$String.sub(s, 0, len - 1 | 0);
  } else {
    return s;
  }
}

function read_aux(trim, sep, file) {
  var ic = Pervasives.open_in_bin(file);
  var buf = $$Buffer.create(200);
  var words = {
    contents: /* [] */0
  };
  var stash = function (param) {
    var word = $$Buffer.contents(buf);
    var word$1 = trim ? trim_cr(word) : word;
    words.contents = /* :: */[
      word$1,
      words.contents
    ];
    buf.position = 0;
    
  };
  var read = function (param) {
    try {
      var c = Caml_external_polyfill.resolve("caml_ml_input_char")(ic);
      if (c === sep) {
        stash(undefined);
        return read(undefined);
      } else {
        $$Buffer.add_char(buf, c);
        return read(undefined);
      }
    }
    catch (exn){
      if (exn === Caml_builtin_exceptions.end_of_file) {
        if (buf.position > 0) {
          return stash(undefined);
        } else {
          return ;
        }
      }
      throw exn;
    }
  };
  read(undefined);
  Caml_external_polyfill.resolve("caml_ml_close_channel")(ic);
  return $$Array.of_list(List.rev(words.contents));
}

function read_arg(param) {
  return read_aux(true, /* "\n" */10, param);
}

function read_arg0(param) {
  return read_aux(false, /* "\000" */0, param);
}

function write_aux(sep, file, args) {
  var oc = Pervasives.open_out_bin(file);
  $$Array.iter((function (s) {
          return Curry._2(Printf.fprintf(oc, /* Format */[
                          /* String */Block.__(2, [
                              /* No_padding */0,
                              /* Char */Block.__(0, [/* End_of_format */0])
                            ]),
                          "%s%c"
                        ]), s, sep);
        }), args);
  Caml_io.caml_ml_flush(oc);
  return Caml_external_polyfill.resolve("caml_ml_close_channel")(oc);
}

function write_arg(param, param$1) {
  return write_aux(/* "\n" */10, param, param$1);
}

function write_arg0(param, param$1) {
  return write_aux(/* "\000" */0, param, param$1);
}

export {
  parse ,
  parse_dynamic ,
  parse_argv ,
  parse_argv_dynamic ,
  parse_and_expand_argv_dynamic ,
  parse_expand ,
  Help ,
  Bad ,
  usage ,
  usage_string ,
  align ,
  current ,
  read_arg ,
  read_arg0 ,
  write_arg ,
  write_arg0 ,
  
}
/* No side effect */

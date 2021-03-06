'use strict';

var Caml_external_polyfill = require("../../lib/js/caml_external_polyfill.js");
var Caml_builtin_exceptions = require("../../lib/js/caml_builtin_exceptions.js");

function to_buffer(buff, ofs, len, v, flags) {
  if (ofs < 0 || len < 0 || ofs > (buff.length - len | 0)) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "Marshal.to_buffer: substring out of bounds"
        ];
  }
  return Caml_external_polyfill.resolve("caml_output_value_to_buffer")(buff, ofs, len, v, flags);
}

exports.to_buffer = to_buffer;
/* No side effect */

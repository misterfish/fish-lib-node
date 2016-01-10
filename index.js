var ref$, curry, join, last, map, each, compact, keys, values, sprintf, sysMod, sysSet, sysOk, sysExec, sysSpawn, sys, shellQuote, speak, bullet, bulletSet, bulletGet, log, info, green, brightGreen, blue, brightBlue, red, brightRed, yellow, brightYellow, cyan, brightCyan, magenta, brightMagenta, squeak, errSet, icomplain, complain, iwarn, ierror, warn, error, aerror, types, ofNumber, ofObject, okNumber, isArray, isObject, isString, isBoolean, isFunction, isInteger, isIntegerStrict, isNumber, isNumberStrict, isIntegerPositive, isIntegerNonNegative, isBuffer, ofNum, ofObj, okNum, isArr, isObj, isStr, isBool, isFunc, isInt, isIntStrict, isNum, isNumStrict, isIntPos, isIntNonNeg, isBuf, util, shuffleArray, mergeObjects, ord, chr, range, times, array, toArray, opt, getopt, config, Identifier, k, v, slice$ = [].slice;
ref$ = require("prelude-ls"), curry = ref$.curry, join = ref$.join, last = ref$.last, map = ref$.map, each = ref$.each, compact = ref$.compact, keys = ref$.keys, values = ref$.values;
sprintf = require('sprintf');
ref$ = sysMod = require('./sys'), sysSet = ref$.sysSet, sysOk = ref$.sysOk, sysExec = ref$.sysExec, sysSpawn = ref$.sysSpawn, sys = ref$.sys, shellQuote = ref$.shellQuote;
ref$ = speak = require('./speak'), bullet = ref$.bullet, bulletSet = ref$.bulletSet, bulletGet = ref$.bulletGet, log = ref$.log, info = ref$.info, green = ref$.green, brightGreen = ref$.brightGreen, blue = ref$.blue, brightBlue = ref$.brightBlue, red = ref$.red, brightRed = ref$.brightRed, yellow = ref$.yellow, brightYellow = ref$.brightYellow, cyan = ref$.cyan, brightCyan = ref$.brightCyan, magenta = ref$.magenta, brightMagenta = ref$.brightMagenta;
ref$ = squeak = require('./squeak'), errSet = ref$.errSet, icomplain = ref$.icomplain, complain = ref$.complain, iwarn = ref$.iwarn, ierror = ref$.ierror, warn = ref$.warn, error = ref$.error, aerror = ref$.aerror;
ref$ = types = require('./types'), ofNumber = ref$.ofNumber, ofObject = ref$.ofObject, okNumber = ref$.okNumber, isArray = ref$.isArray, isObject = ref$.isObject, isString = ref$.isString, isBoolean = ref$.isBoolean, isFunction = ref$.isFunction, isInteger = ref$.isInteger, isIntegerStrict = ref$.isIntegerStrict, isNumber = ref$.isNumber, isNumberStrict = ref$.isNumberStrict, isIntegerPositive = ref$.isIntegerPositive, isIntegerNonNegative = ref$.isIntegerNonNegative, isBuffer = ref$.isBuffer, ofNum = ref$.ofNum, ofObj = ref$.ofObj, okNum = ref$.okNum, isArr = ref$.isArr, isObj = ref$.isObj, isStr = ref$.isStr, isBool = ref$.isBool, isFunc = ref$.isFunc, isInt = ref$.isInt, isIntStrict = ref$.isIntStrict, isNum = ref$.isNum, isNumStrict = ref$.isNumStrict, isIntPos = ref$.isIntPos, isIntNonNeg = ref$.isIntNonNeg, isBuf = ref$.isBuf;
ref$ = util = require('./util'), shuffleArray = ref$.shuffleArray, mergeObjects = ref$.mergeObjects, ord = ref$.ord, chr = ref$.chr, range = ref$.range, times = ref$.times, array = ref$.array, toArray = ref$.toArray;
getopt = (opt = require('./opt')).getopt;
config = {
  pkg: {
    confSet: confSet
  }
};
sysMod.init({
  pkg: config.pkg
});
squeak.init({
  pkg: config.pkg
});
Identifier = {};
function importAll(target){
  var k, ref$, v, results$ = [];
  for (k in ref$ = module.exports) {
    v = ref$[k];
    results$.push(target[k] = v);
  }
  return results$;
}
function importKind(target){
  var kinds, doit, i$, len$, elem, lresult$, j$, len1$, kind, results$ = [];
  kinds = slice$.call(arguments, 1);
  doit = function(kind){
    var identifiers, k, v, results$ = [];
    identifiers = Identifier[kind];
    if (identifiers == null) {
      return iwarn('bad import:', brightRed(kind), {
        stackRewind: 1
      });
    }
    for (k in identifiers) {
      v = identifiers[k];
      results$.push(target[k] = v);
    }
    return results$;
  };
  for (i$ = 0, len$ = kinds.length; i$ < len$; ++i$) {
    elem = kinds[i$];
    lresult$ = [];
    if (isArray(elem)) {
      for (j$ = 0, len1$ = elem.length; j$ < len1$; ++j$) {
        kind = elem[j$];
        lresult$.push(doit(kind));
      }
    } else {
      lresult$.push(doit(elem));
    }
    results$.push(lresult$);
  }
  return results$;
}
function confSet(arg$){
  var source, target, name, ref$, k, v, results$ = [];
  source = arg$.source, target = arg$.target, name = (ref$ = arg$.name) != null ? ref$ : 'unknown';
  for (k in source) {
    v = source[k];
    if (!target.hasOwnProperty(k)) {
      error("Invalid opt for " + yellow(name) + ": " + brightRed(k));
    }
    results$.push(target[k] = v);
  }
  return results$;
}
Identifier.all = {};
Identifier.main = {
  importAll: importAll,
  importKind: importKind,
  getopt: getopt,
  sprintf: sprintf
};
Identifier.speak = {
  bullet: bullet,
  bulletSet: bulletSet,
  bulletGet: bulletGet,
  log: log,
  info: info,
  green: green,
  brightGreen: brightGreen,
  blue: blue,
  brightBlue: brightBlue,
  red: red,
  brightRed: brightRed,
  yellow: yellow,
  brightYellow: brightYellow,
  cyan: cyan,
  brightCyan: brightCyan,
  magenta: magenta,
  brightMagenta: brightMagenta
};
Identifier.squeak = {
  icomplain: icomplain,
  complain: complain,
  iwarn: iwarn,
  ierror: ierror,
  warn: warn,
  error: error,
  aerror: aerror,
  errSet: errSet
};
Identifier.color = {
  red: red,
  brightRed: brightRed,
  green: green,
  brightGreen: brightGreen,
  yellow: yellow,
  brightYellow: brightYellow,
  blue: blue,
  brightBlue: brightBlue,
  magenta: magenta,
  brightMagenta: brightMagenta,
  cyan: cyan,
  brightCyan: brightCyan
};
Identifier.types = {
  ofNumber: ofNumber,
  ofObject: ofObject,
  okNumber: okNumber,
  isArray: isArray,
  isObject: isObject,
  isString: isString,
  isBoolean: isBoolean,
  isFunction: isFunction,
  isInteger: isInteger,
  isIntegerStrict: isIntegerStrict,
  isNumber: isNumber,
  isNumberStrict: isNumberStrict,
  isIntegerPositive: isIntegerPositive,
  isIntegerNonNegative: isIntegerNonNegative,
  isBuffer: isBuffer,
  ofNum: ofNum,
  ofObj: ofObj,
  okNum: okNum,
  isArr: isArr,
  isObj: isObj,
  isStr: isStr,
  isBool: isBool,
  isFunc: isFunc,
  isInt: isInt,
  isIntStrict: isIntStrict,
  isNum: isNum,
  isNumStrict: isNumStrict,
  isIntPos: isIntPos,
  isIntNonNeg: isIntNonNeg,
  isBuf: isBuf
};
Identifier.sys = {
  sysSet: sysSet,
  sys: sys,
  sysExec: sysExec,
  sysSpawn: sysSpawn,
  sysOk: sysOk,
  shellQuote: shellQuote
};
Identifier.util = {
  shuffleArray: shuffleArray,
  mergeObjects: mergeObjects,
  ord: ord,
  chr: chr,
  range: range,
  times: times,
  array: array,
  toArray: toArray
};
['main', 'speak', 'squeak', 'color', 'util', 'types', 'sys'].forEach(function(it){
  return import$(Identifier.all, Identifier[it]);
});
for (k in ref$ = Identifier.all) {
  v = ref$[k];
  module.exports[k] = v;
}
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
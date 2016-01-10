var ref$, curry, join, last, map, each, compact, keys, values, sprintf, sysMod, sysSet, sysOk, sysExec, sysSpawn, sys, shellQuote, speak, bullet, bulletSet, bulletGet, log, info, green, brightGreen, blue, brightBlue, red, brightRed, yellow, brightYellow, cyan, brightCyan, magenta, brightMagenta, squeak, errSet, icomplain, complain, iwarn, ierror, warn, error, aerror, types, isStr, isString, isBool, isBoolean, isObj, isObject, isFunc, isFunction, isArr, isArray, isNum, isNumber, isInt, isInteger, isPositiveInt, isNonNegativeInt, isANum, isANumber, isBuffer, config, Identifier, k, v, toString$ = {}.toString, slice$ = [].slice;
ref$ = require("prelude-ls"), curry = ref$.curry, join = ref$.join, last = ref$.last, map = ref$.map, each = ref$.each, compact = ref$.compact, keys = ref$.keys, values = ref$.values;
sprintf = require('sprintf');
ref$ = sysMod = require('./sys'), sysSet = ref$.sysSet, sysOk = ref$.sysOk, sysExec = ref$.sysExec, sysSpawn = ref$.sysSpawn, sys = ref$.sys, shellQuote = ref$.shellQuote;
ref$ = speak = require('./speak'), bullet = ref$.bullet, bulletSet = ref$.bulletSet, bulletGet = ref$.bulletGet, log = ref$.log, info = ref$.info, green = ref$.green, brightGreen = ref$.brightGreen, blue = ref$.blue, brightBlue = ref$.brightBlue, red = ref$.red, brightRed = ref$.brightRed, yellow = ref$.yellow, brightYellow = ref$.brightYellow, cyan = ref$.cyan, brightCyan = ref$.brightCyan, magenta = ref$.magenta, brightMagenta = ref$.brightMagenta;
ref$ = squeak = require('./squeak'), errSet = ref$.errSet, icomplain = ref$.icomplain, complain = ref$.complain, iwarn = ref$.iwarn, ierror = ref$.ierror, warn = ref$.warn, error = ref$.error, aerror = ref$.aerror;
ref$ = types = require('./types'), isStr = ref$.isStr, isString = ref$.isString, isBool = ref$.isBool, isBoolean = ref$.isBoolean, isObj = ref$.isObj, isObject = ref$.isObject, isFunc = ref$.isFunc, isFunction = ref$.isFunction, isArr = ref$.isArr, isArray = ref$.isArray, isNum = ref$.isNum, isNumber = ref$.isNumber, isInt = ref$.isInt, isInteger = ref$.isInteger, isPositiveInt = ref$.isPositiveInt, isNonNegativeInt = ref$.isNonNegativeInt, isANum = ref$.isANum, isANumber = ref$.isANumber, ref$['void'], isBuffer = ref$.isBuffer;
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
Identifier = {
  main: {},
  color: {},
  util: {},
  sys: {}
};
function shuffle(input){
  var l, out, locations, res$, i$, to$, i, locationsNumKeys;
  l = input.length;
  out = [];
  res$ = {};
  for (i$ = 0, to$ = l - 1; i$ <= to$; ++i$) {
    i = i$;
    res$[i] = 42;
  }
  locations = res$;
  locationsNumKeys = l;
  times(l, function(){
    var key, m, val;
    key = keys(locations)[m = Math.floor(Math.random() * locationsNumKeys)];
    delete locations[key];
    val = input[key];
    out.push(val);
    return locationsNumKeys--;
  });
  return out;
}
function mergeObjects(){
  var i$, len$, obj, k, v, resultObj$ = {};
  for (i$ = 0, len$ = arguments.length; i$ < len$; ++i$) {
    obj = arguments[i$];
    for (k in obj) {
      v = obj[k];
      if (toString$.call(obj).slice(8, -1) === 'Object') {
        resultObj$[k] = v;
      }
    }
  }
  return resultObj$;
}
function ord(it){
  if (!isStr(it)) {
    return icomplain('Bad call');
  }
  if (it.length > 1) {
    warn("Ignoring extra chars (got '" + green(it.substr(0, 1)) + brightRed(it.substr(1)) + "' ");
  }
  return it.charCodeAt(0);
}
function chr(it){
  if (!isNum(it)) {
    return icomplain('Bad call');
  }
  return String.fromCharCode(it);
}
/* 
 * a and b are integers.
 * step by +1 or -1 to get from a to b, inclusive.
 */
function range(a, b, func){
  var i$, i, results$ = [];
  if (!(isInt(a) && isInt(b))) {
    return icomplain('Bad call');
  }
  for (i$ = a; i$ <= b; ++i$) {
    i = i$;
    results$.push(func(i));
  }
  return results$;
}
function times(n, func){
  var i$, i, results$ = [];
  if (!isPositiveInt(n)) {
    return icomplain('Bad call');
  }
  for (i$ = 1; i$ <= n; ++i$) {
    i = i$;
    results$.push(func(i - 1));
  }
  return results$;
}
function importAll(target){
  var k, ref$, v, results$ = [];
  for (k in ref$ = module.exports) {
    v = ref$[k];
    results$.push(target[k] = v);
  }
  return results$;
}
/*
 * Expand elements of kinds if they are arrays.
 * So this is called as:
 * 
 * fish-lib-ls.import-kind global,
 *    <[ main color util ]>
 * 
 * or
 * 
 * fish-lib-ls.import-kind global,
 *    'main' 'color' 'util'
 */
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
function array(){
  var i$, x$, len$, results$ = [];
  for (i$ = 0, len$ = arguments.length; i$ < len$; ++i$) {
    x$ = arguments[i$];
    results$.push(x$);
  }
  return results$;
}
function toArray(){
  var i$, x$, ref$, len$, results$ = [];
  for (i$ = 0, len$ = (ref$ = arguments[0]).length; i$ < len$; ++i$) {
    x$ = ref$[i$];
    results$.push(x$);
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
Identifier.util = {
  mergeObjects: mergeObjects,
  times: times,
  range: range,
  shuffle: shuffle,
  ord: ord,
  chr: chr,
  array: array,
  toArray: toArray
};
Identifier.types = {
  isInt: isInt,
  isInteger: isInteger,
  isPositiveInt: isPositiveInt,
  isNonNegativeInt: isNonNegativeInt,
  isNum: isNum,
  isNumber: isNumber,
  isArray: isArray,
  isArr: isArr,
  isObj: isObj,
  isObject: isObject,
  isStr: isStr,
  isString: isString,
  isBool: isBool,
  isBoolean: isBoolean,
  isFunc: isFunc,
  isFunction: isFunction,
  isANum: isANum,
  isANumber: isANumber,
  isBuffer: isBuffer
};
Identifier.sys = {
  sysSet: sysSet,
  sys: sys,
  sysExec: sysExec,
  sysSpawn: sysSpawn,
  sysOk: sysOk,
  shellQuote: shellQuote
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
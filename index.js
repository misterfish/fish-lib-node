// Generated by LiveScript 1.6.0
(function(){
  var ref$, curry, join, last, map, each, compact, keys, values, sprintf, sysMod, sysGet, sysSet, sysOk, sysExec, sysSpawn, sys, shellQuote, speak, bullet, bulletSet, bulletGet, log, info, infoStr, green, brightGreen, blue, brightBlue, red, brightRed, yellow, brightYellow, cyan, brightCyan, magenta, brightMagenta, disableColors, forceColors, squeak, squeakSet, squeakGet, icomplain, complain, aerror, iwarn, iwarnStr, ierror, ierrorStr, warn, warnStr, error, errorStr, icomplainOpts, complainOpts, iwarnOpts, ierrorOpts, warnOpts, errorOpts, aerrorOpts, types, ok, defined, ofNumber, ofObject, okNumber, isArray, isObject, isString, isBoolean, isFunction, isInteger, isIntegerStrict, isNumber, isNumberStrict, isIntegerPositive, isIntegerPositiveStrict, isIntegerNonNegative, isIntegerNonNegativeStrict, isBuffer, ofNum, ofObj, okNum, isArr, isObj, isStr, isBool, isFunc, isInt, isIntStrict, isNum, isNumStrict, isIntPos, isIntPosStrict, isIntNonNeg, isIntNonNegStrict, isBuf, util, shuffleArray, ord, chr, range, times, array, toArray, flatArray, opt, getopt, config, Identifier, k, v;
  ref$ = require('prelude-ls'), curry = ref$.curry, join = ref$.join, last = ref$.last, map = ref$.map, each = ref$.each, compact = ref$.compact, keys = ref$.keys, values = ref$.values;
  sprintf = require('sprintf-js').sprintf;
  ref$ = sysMod = require('./sys'), sysGet = ref$.sysGet, sysSet = ref$.sysSet, sysOk = ref$.sysOk, sysExec = ref$.sysExec, sysSpawn = ref$.sysSpawn, sys = ref$.sys, shellQuote = ref$.shellQuote;
  ref$ = speak = require('./speak'), bullet = ref$.bullet, bulletSet = ref$.bulletSet, bulletGet = ref$.bulletGet, log = ref$.log, info = ref$.info, infoStr = ref$.infoStr, green = ref$.green, brightGreen = ref$.brightGreen, blue = ref$.blue, brightBlue = ref$.brightBlue, red = ref$.red, brightRed = ref$.brightRed, yellow = ref$.yellow, brightYellow = ref$.brightYellow, cyan = ref$.cyan, brightCyan = ref$.brightCyan, magenta = ref$.magenta, brightMagenta = ref$.brightMagenta, disableColors = ref$.disableColors, forceColors = ref$.forceColors;
  ref$ = squeak = require('./squeak'), squeakSet = ref$.squeakSet, squeakGet = ref$.squeakGet, icomplain = ref$.icomplain, complain = ref$.complain, aerror = ref$.aerror, iwarn = ref$.iwarn, iwarnStr = ref$.iwarnStr, ierror = ref$.ierror, ierrorStr = ref$.ierrorStr, warn = ref$.warn, warnStr = ref$.warnStr, error = ref$.error, errorStr = ref$.errorStr, icomplainOpts = ref$.icomplainOpts, complainOpts = ref$.complainOpts, iwarnOpts = ref$.iwarnOpts, ierrorOpts = ref$.ierrorOpts, warnOpts = ref$.warnOpts, errorOpts = ref$.errorOpts, aerrorOpts = ref$.aerrorOpts;
  ref$ = types = require('./types'), ok = ref$.ok, defined = ref$.defined, ofNumber = ref$.ofNumber, ofObject = ref$.ofObject, okNumber = ref$.okNumber, isArray = ref$.isArray, isObject = ref$.isObject, isString = ref$.isString, isBoolean = ref$.isBoolean, isFunction = ref$.isFunction, isInteger = ref$.isInteger, isIntegerStrict = ref$.isIntegerStrict, isNumber = ref$.isNumber, isNumberStrict = ref$.isNumberStrict, isIntegerPositive = ref$.isIntegerPositive, isIntegerPositiveStrict = ref$.isIntegerPositiveStrict, isIntegerNonNegative = ref$.isIntegerNonNegative, isIntegerNonNegativeStrict = ref$.isIntegerNonNegativeStrict, isBuffer = ref$.isBuffer, ofNum = ref$.ofNum, ofObj = ref$.ofObj, okNum = ref$.okNum, isArr = ref$.isArr, isObj = ref$.isObj, isStr = ref$.isStr, isBool = ref$.isBool, isFunc = ref$.isFunc, isInt = ref$.isInt, isIntStrict = ref$.isIntStrict, isNum = ref$.isNum, isNumStrict = ref$.isNumStrict, isIntPos = ref$.isIntPos, isIntPosStrict = ref$.isIntPosStrict, isIntNonNeg = ref$.isIntNonNeg, isIntNonNegStrict = ref$.isIntNonNegStrict, isBuf = ref$.isBuf;
  ref$ = util = require('./util'), shuffleArray = ref$.shuffleArray, ord = ref$.ord, chr = ref$.chr, range = ref$.range, times = ref$.times, array = ref$.array, toArray = ref$.toArray, flatArray = ref$.flatArray;
  if (!isPhantom()) {
    getopt = (opt = require('./opt')).getopt;
  }
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
    var k, ref$, v;
    for (k in ref$ = module.exports) {
      v = ref$[k];
      target[k] = v;
    }
    return this;
  }
  function importKind(target){
    var kinds, res$, i$, to$, doit, len$, elem, j$, len1$, kind;
    res$ = [];
    for (i$ = 1, to$ = arguments.length; i$ < to$; ++i$) {
      res$.push(arguments[i$]);
    }
    kinds = res$;
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
      if (isArray(elem)) {
        for (j$ = 0, len1$ = elem.length; j$ < len1$; ++j$) {
          kind = elem[j$];
          doit(kind);
        }
      } else {
        doit(elem);
      }
    }
    return this;
  }
  function confSet(arg$){
    var source, target, name, ref$, k, v;
    source = arg$.source, target = arg$.target, name = (ref$ = arg$.name) != null ? ref$ : 'unknown';
    for (k in source) {
      v = source[k];
      if (!target.hasOwnProperty(k)) {
        error("Invalid opt for " + yellow(name) + ": " + brightRed(k));
      }
      target[k] = v;
    }
    return this;
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
    infoStr: infoStr,
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
    aerror: aerror,
    iwarn: iwarn,
    iwarnStr: iwarnStr,
    ierror: ierror,
    ierrorStr: ierrorStr,
    warn: warn,
    warnStr: warnStr,
    error: error,
    errorStr: errorStr,
    squeakSet: squeakSet,
    squeakGet: squeakGet,
    icomplainOpts: icomplainOpts,
    complainOpts: complainOpts,
    iwarnOpts: iwarnOpts,
    ierrorOpts: ierrorOpts,
    warnOpts: warnOpts,
    errorOpts: errorOpts,
    aerrorOpts: aerrorOpts
  };
  Identifier.color = {
    disableColors: disableColors,
    forceColors: forceColors,
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
    ok: ok,
    defined: defined,
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
    isIntegerPositiveStrict: isIntegerPositiveStrict,
    isIntegerNonNegative: isIntegerNonNegative,
    isIntegerNonNegativeStrict: isIntegerNonNegativeStrict,
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
    isIntPosStrict: isIntPosStrict,
    isIntNonNeg: isIntNonNeg,
    isIntNonNegStrict: isIntNonNegStrict,
    isBuf: isBuf
  };
  Identifier.sys = {
    sysGet: sysGet,
    sysSet: sysSet,
    sys: sys,
    sysExec: sysExec,
    sysSpawn: sysSpawn,
    sysOk: sysOk,
    shellQuote: shellQuote
  };
  Identifier.util = {
    shuffleArray: shuffleArray,
    ord: ord,
    chr: chr,
    range: range,
    times: times,
    array: array,
    toArray: toArray,
    flatArray: flatArray
  };
  ['main', 'speak', 'squeak', 'color', 'util', 'types', 'sys'].forEach(function(it){
    return import$(Identifier.all, Identifier[it]);
  });
  for (k in ref$ = Identifier.all) {
    v = ref$[k];
    module.exports[k] = v;
  }
  function isPhantom(){
    if ((typeof window != 'undefined' && window !== null) && window.callPhantom && window._phantom) {
      return true;
    }
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);

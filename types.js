var squeak, speak, our, ofNum, ofObj, okNum, isNum, isNumStrict, isObj, isStr, isBool, isFunc, isArr, isInt, isIntStrict, isBuf, isIntPos, isIntPosStrict, isIntNonNeg, isIntNonNegStrict, toString$ = {}.toString, out$ = typeof exports != 'undefined' && exports || this;
squeak = require('./squeak');
speak = require('./speak');
our = {
  typeCheck: {
    n: isNumber,
    ns: isNumberStrict,
    i: isInteger,
    is: isIntegerStrict,
    ip: isIntegerPositive,
    ips: isIntegerPositiveStrict,
    iN: isIntegerNonNegative,
    iNs: isIntegerNonNegativeStrict,
    s: isString,
    o: isObject,
    a: isArray,
    f: isFunction
  }
};
function ok(n, spec){
  var func;
  if (n == null) {
    return false;
  }
  if (spec == null) {
    return true;
  }
  func = our.typeCheck[spec];
  if (!func) {
    return squeak.iwarn('bad spec', speak.brightRed(spec));
  }
  return func.call(null, n);
}
function defined(n){
  return n != null;
}
function ofNumber(it){
  return toString$.call(it).slice(8, -1) === 'Number';
}
function ofObject(it){
  return typeof it === 'object';
}
function okNumber(it){
  var nan, infinity, isOfNum;
  nan = isNaN(it);
  infinity = it === Infinity;
  isOfNum = ofNumber(it);
  return {
    nan: nan,
    infinity: infinity,
    isOfNum: isOfNum,
    ok: isOfNum && !nan && !infinity
  };
}
function isNumber(it){
  return isNumberPriv(it, {
    strict: false
  });
}
function isNumberStrict(it){
  return isNumberPriv(it, {
    strict: true
  });
}
function isObject(it){
  return toString$.call(it).slice(8, -1) === 'Object';
}
function isString(it){
  return toString$.call(it).slice(8, -1) === 'String';
}
function isBoolean(it){
  return toString$.call(it).slice(8, -1) === 'Boolean';
}
function isFunction(it){
  return toString$.call(it).slice(8, -1) === 'Function';
}
function isArray(it){
  return toString$.call(it).slice(8, -1) === 'Array';
}
function isInteger(it){
  return isIntegerPriv(it, {
    strict: false
  });
}
function isIntegerStrict(it){
  return isIntegerPriv(it, {
    strict: true
  });
}
function isIntegerPositive(it){
  return isInt(it) && it > 0;
}
function isIntegerPositiveStrict(it){
  return isIntStrict(it) && it > 0;
}
function isIntegerNonNegative(it){
  return isInt(it) && it >= 0;
}
function isIntegerNonNegativeStrict(it){
  return isIntStrict(it) && it >= 0;
}
function isBuffer(){
  return Buffer.isBuffer.apply(this, arguments);
}
function isNumberPriv(n, arg$){
  var strict;
  strict = (arg$ != null
    ? arg$
    : {}).strict;
  if (isString(n)) {
    if (strict) {
      return false;
    } else {
      n = +n;
    }
  }
  return okNumber(n).ok;
}
function isIntegerPriv(n, arg$){
  var strict;
  strict = (arg$ != null
    ? arg$
    : {}).strict;
  if (isString(n)) {
    if (strict) {
      return false;
    } else {
      n = +n;
    }
  }
  return okNumber(n).ok && n === Math.floor(n);
}
ofNum = ofNumber;
ofObj = ofObject;
okNum = okNumber;
isNum = isNumber;
isNumStrict = isNumberStrict;
isObj = isObject;
isStr = isString;
isBool = isBoolean;
isFunc = isFunction;
isArr = isArray;
isInt = isInteger;
isIntStrict = isIntegerStrict;
isBuf = isBuffer;
isIntPos = isIntegerPositive;
isIntPosStrict = isIntegerPositiveStrict;
isIntNonNeg = isIntegerNonNegative;
isIntNonNegStrict = isIntegerNonNegativeStrict;
out$.ok = ok;
out$.defined = defined;
out$.ofNumber = ofNumber;
out$.ofObject = ofObject;
out$.okNumber = okNumber;
out$.isArray = isArray;
out$.isObject = isObject;
out$.isString = isString;
out$.isBoolean = isBoolean;
out$.isFunction = isFunction;
out$.isInteger = isInteger;
out$.isIntegerStrict = isIntegerStrict;
out$.isNumber = isNumber;
out$.isNumberStrict = isNumberStrict;
out$.isIntegerPositive = isIntegerPositive;
out$.isIntegerPositiveStrict = isIntegerPositiveStrict;
out$.isIntegerNonNegative = isIntegerNonNegative;
out$.isIntegerNonNegativeStrict = isIntegerNonNegativeStrict;
out$.isBuffer = isBuffer;
out$.ofNum = ofNum;
out$.ofObj = ofObj;
out$.okNum = okNum;
out$.isArr = isArr;
out$.isObj = isObj;
out$.isStr = isStr;
out$.isBool = isBool;
out$.isFunc = isFunc;
out$.isInt = isInt;
out$.isIntStrict = isIntStrict;
out$.isNum = isNum;
out$.isNumStrict = isNumStrict;
out$.isIntPos = isIntPos;
out$.isIntPosStrict = isIntPosStrict;
out$.isIntNonNeg = isIntNonNeg;
out$.isIntNonNegStrict = isIntNonNegStrict;
out$.isBuf = isBuf;
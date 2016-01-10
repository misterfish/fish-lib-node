var out$ = typeof exports != 'undefined' && exports || this, toString$ = {}.toString;
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
out$.isIntegerNonNegative = isIntegerNonNegative;
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
out$.isIntNonNeg = isIntNonNeg;
out$.isBuf = isBuf;
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
    ok: ofNum && !nan && !infinity
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
function isIntegerNonNegative(it){
  return isInt(it) && it >= 0;
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
function ofNum(){
  return ofNumber.apply(this, arguments);
}
function ofObj(){
  return ofObject.apply(this, arguments);
}
function okNum(){
  return okNumber.apply(this, arguments);
}
function isNum(){
  return isNumber.apply(this, arguments);
}
function isObj(){
  return isObject.apply(this, arguments);
}
function isStr(){
  return isString.apply(this, arguments);
}
function isBool(){
  return isBoolean.apply(this, arguments);
}
function isFunc(){
  return isFunction.apply(this, arguments);
}
function isArr(){
  return isArray.apply(this, arguments);
}
function isInt(){
  return isInteger.apply(this, arguments);
}
function isBuf(){
  return isBuffer.apply(this, arguments);
}
function isIntPos(){
  return isIntegerPositive.apply(this, arguments);
}
function isIntNonNeg(){
  return isIntegerNonNegative.apply(this, arguments);
}
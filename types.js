var out$ = typeof exports != 'undefined' && exports || this, toString$ = {}.toString;
out$.ofNumber = ofNumber;
out$.ofString = ofString;
out$.ofObject = ofObject;
out$.ofBoolean = ofBoolean;
out$.ofArray = ofArray;
out$.okNumber = okNumber;
out$.isNumber = isNumber;
out$.isObject = isObject;
out$.isString = isString;
out$.isStr = isStr;
out$.isBool = isBool;
out$.isBoolean = isBoolean;
out$.isObj = isObj;
out$.isFunc = isFunc;
out$.isFunction = isFunction;
out$.isArr = isArr;
out$.isArray = isArray;
out$.isNum = isNum;
out$.isNumber = isNumber;
out$.isInt = isInt;
out$.isInteger = isInteger;
out$.isPositiveInt = isPositiveInt;
out$.isNonNegativeInt = isNonNegativeInt;
out$.isBuffer = isBuffer;
function ofNumber(it){
  return toString$.call(it).slice(8, -1) === 'Number';
}
function ofString(it){
  return toString$.call(it).slice(8, -1) === 'String';
}
function ofObject(it){
  return typeof it === 'object';
}
function ofBoolean(it){
  return toString$.call(it).slice(8, -1) === 'Boolean';
}
function ofArray(it){
  return toString$.call(it).slice(8, -1) === 'Array';
}
function okNumber(it){
  var nan, infinity, ofNum;
  nan = isNaN(it);
  infinity = it === Infinity;
  ofNum = ofNumber(it);
  return {
    nan: nan,
    infinity: infinity,
    ofNum: ofNum,
    ok: ofNum && !nan && !infinity
  };
}
function isObject(it){
  return toString$.call(it).slice(8, -1) === 'Object';
}
function isString(it){
  return toString$.call(it).slice(8, -1) === 'String';
}
function ofNum(){
  return ofNumber.apply(this, arguments);
}
function ofStr(){
  return ofString.apply(this, arguments);
}
function ofObj(){
  return ofObject.apply(this, arguments);
}
function ofBool(){
  return ofBoolean.apply(this, arguments);
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
function isStr(it){
  return isString(it);
}
function isBool(it){
  return isBoolean(it);
}
function isBoolean(it){
  return toString$.call(it).slice(8, -1) === 'Boolean';
}
function isFunc(it){
  return isFunction(it);
}
function isFunction(it){
  return toString$.call(it).slice(8, -1) === 'Function';
}
function isArr(it){
  return isArray(it);
}
function isArray(){
  return ofArray.apply(this, arguments);
}
/*
 * Checks the type of the argument, in the same way as is-str, is-arr, etc.
 * Use is-a-number to test strings such as '3.1'.
 *
 * If it's a Number, returns an object with property 'nan' (alias 'is-nan')
 * based on whether it's NaN (not a number).
 * 
 * Returns false otherwise.
 */
function isNumber(it){
  return isNumberPriv(it, {
    strict: false
  });
}
function isNumberPriv(n, arg$){
  var strict;
  strict = (arg$ != null
    ? arg$
    : {}).strict;
  if (ofString(n)) {
    if (strict) {
      return false;
    } else {
      n = +n;
    }
  }
  return okNumber(n).ok;
}
function isInt(it){
  return isInteger(it);
}
function isInteger(it){
  return isNum(it) && it === Math.floor(it);
}
function isPositiveInt(it){
  return isInt(it) && it > 0;
}
function isNonNegativeInt(it){
  return isInt(it) && it >= 0;
}
function isBuffer(){
  return Buffer.isBuffer.apply(this, arguments);
}
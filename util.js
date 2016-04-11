var ref$, isIntegerPositive, isInt, isNum, isStr, isFunc, aerror, warn, green, brightRed, out$ = typeof exports != 'undefined' && exports || this, slice$ = [].slice;
out$.shuffleArray = shuffleArray;
out$.mergeObjects = mergeObjects;
out$.ord = ord;
out$.chr = chr;
out$.range = range;
out$.times = times;
out$.array = array;
out$.toArray = toArray;
out$.flatArray = flatArray;
ref$ = require('./types'), isIntegerPositive = ref$.isIntegerPositive, isInt = ref$.isInt, isNum = ref$.isNum, isStr = ref$.isStr, isFunc = ref$.isFunc;
ref$ = require('./squeak'), aerror = ref$.aerror, warn = ref$.warn;
ref$ = require('./speak'), green = ref$.green, brightRed = ref$.brightRed;
function shuffleArray(input){
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
    var key, m;
    key = keys(locations)[m = Math.floor(Math.random() * locationsNumKeys)];
    delete locations[key];
    out.push(input[key]);
    return locationsNumKeys--;
  });
  return out;
}
function mergeObjects(){
  var obj, i$, len$, k, v, resultObj$ = {};
  obj = slice$.call(arguments);
  for (i$ = 0, len$ = arguments.length; i$ < len$; ++i$) {
    obj = arguments[i$];
    for (k in obj) {
      v = obj[k];
      resultObj$[k] = v;
    }
  }
  return resultObj$;
}
function ord(it){
  if (!isStr(it)) {
    return aerror();
  }
  if (it.length > 1) {
    warn("Ignoring extra chars (got '" + green(it.substr(0, 1)) + brightRed(it.substr(1)) + "' ");
  }
  return it.charCodeAt(0);
}
function chr(it){
  if (!isNum(it)) {
    return aerror();
  }
  return String.fromCharCode(it);
}
function range(a, b, func){
  var i$, i, results$ = [], results1$ = [];
  if (!(isInt(a) && isInt(b))) {
    return aerror();
  }
  if (func && !isFunc(func)) {
    return aerror('bad function');
  }
  if (func) {
    for (i$ = a; i$ <= b; ++i$) {
      i = i$;
      results$.push(func(i));
    }
    return results$;
  } else {
    for (i$ = a; i$ <= b; ++i$) {
      results1$.push(i$);
    }
    return results1$;
  }
}
function times(n, func){
  var i$, i, results$ = [];
  if (!isIntegerPositive(n)) {
    return aerror();
  }
  for (i$ = 1; i$ <= n; ++i$) {
    i = i$;
    results$.push(func(i - 1));
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
function flatArray(){
  var vals, ret, recursing;
  vals = slice$.call(arguments);
  ret = [];
  recursing = false;
  vals.forEach(function(it){
    var v;
    if (isArray(it)) {
      recursing = true;
      v = it;
    } else {
      v = [it];
    }
    return v.forEach(function(it){
      return ret.push(it);
    });
  });
  if (recursing) {
    return flatArray.apply(null, ret);
  } else {
    return ret;
  }
}
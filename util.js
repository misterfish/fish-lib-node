var types, squeak, speak, out$ = typeof exports != 'undefined' && exports || this, slice$ = [].slice;
out$.ord = ord;
out$.chr = chr;
out$.range = range;
out$.times = times;
out$.array = array;
out$.toArray = toArray;
out$.flatArray = flatArray;
types = require('./types');
squeak = require('./squeak');
speak = require('./speak');
function ord(it){
  if (!types.isStr(it)) {
    squeak.aerror(it);
  }
  if (it.length > 1) {
    squeak.warn(sprintf("Ignoring extra chars (got '%s%s')", speak.green(it.substr(0, 1)), speak.brightRed(it.substr(1))));
  }
  return it.charCodeAt(0);
}
function chr(it){
  if (!types.isNum(it)) {
    squeak.aerror(it);
  }
  return String.fromCharCode(it);
}
function range(a, b, func){
  var i$, i, results$ = [], results1$ = [];
  if (!(types.isInt(a) && types.isInt(b))) {
    squeak.aerror();
  }
  if (func && !types.isFunc(func)) {
    squeak.aerror('bad function');
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
  if (!types.isIntPos(n)) {
    return squeak.aerror();
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
    if (types.isArray(it)) {
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
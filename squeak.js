var ref$, last, join, map, main, isObj, isArr, bullet, bulletGet, green, brightRed, yellow, red, array, util, our, out$ = typeof exports != 'undefined' && exports || this, slice$ = [].slice;
out$.init = init;
out$.errSet = errSet;
out$.icomplain = icomplain;
out$.complain = complain;
out$.iwarn = iwarn;
out$.ierror = ierror;
out$.warn = warn;
out$.error = error;
out$.aerror = aerror;
ref$ = require("prelude-ls"), last = ref$.last, join = ref$.join, map = ref$.map;
main = require.main;
main.exports;
ref$ = require('./types'), isObj = ref$.isObj, isArr = ref$.isArr;
ref$ = require('./speak'), bullet = ref$.bullet, bulletGet = ref$.bulletGet, green = ref$.green, brightRed = ref$.brightRed, yellow = ref$.yellow, red = ref$.red;
array = require('./util').array;
util = void 8;
our = {
  pkg: {
    confSet: void 8
  },
  opts: {
    printStackTrace: void 8,
    complain: 'error',
    error: 'fatal',
    apiError: 'fatal'
  }
};
function icomplain(){
  var msg, opts, func;
  msg = slice$.call(arguments);
  opts = last(msg);
  if (isObj(opts)) {
    msg.pop();
  } else {
    opts = {};
  }
  func = our.opts.complain === 'error' ? ierror : iwarn;
  opts.stackRewind == null && (opts.stackRewind = 0);
  opts.stackRewind += 2;
  return func.apply(null, msg.concat([opts]));
}
function complain(){
  var msg, opts, func;
  msg = slice$.call(arguments);
  opts = last(msg);
  if (isObj(opts)) {
    msg.pop();
  } else {
    opts = {};
  }
  func = our.opts.complain === 'error' ? error : warn;
  opts.stackRewind == null && (opts.stackRewind = 0);
  opts.stackRewind += 2;
  return func.apply(null, msg.concat([opts]));
}
function iwarn(){
  var msg, opts;
  msg = slice$.call(arguments);
  opts = last(msg);
  if (isObj(opts)) {
    msg.pop();
  } else {
    opts = {};
  }
  return pcomplain((opts.msg = msg, opts.type = 'iwarn', opts.internal = true, opts));
}
function ierror(){
  var msg, opts;
  msg = slice$.call(arguments);
  opts = last(msg);
  if (isObj(opts)) {
    msg.pop();
  } else {
    opts = {};
  }
  return pcomplain((opts.msg = msg, opts.type = 'ierror', opts.internal = true, opts));
}
function warn(){
  var msg, opts;
  msg = slice$.call(arguments);
  opts = last(msg);
  if (isObj(opts)) {
    msg.pop();
  } else {
    opts = {};
  }
  return pcomplain((opts.msg = msg, opts.type = 'warn', opts.internal = false, opts));
}
function error(){
  var msg, opts;
  msg = slice$.call(arguments);
  opts = last(msg);
  if (isObj(opts)) {
    msg.pop();
  } else {
    opts = {};
  }
  return pcomplain((opts.msg = msg, opts.type = 'error', opts.internal = false, opts));
}
function aerror(){
  var msg, opts;
  msg = slice$.call(arguments);
  opts = last(msg);
  if (isObj(opts)) {
    msg.pop();
  } else {
    opts = {};
  }
  return pcomplain((opts.msg = msg, opts.type = 'aerror', opts.internal = false, opts));
}
function init(arg$){
  var pkg, ref$;
  pkg = (ref$ = (arg$ != null
    ? arg$
    : {}).pkg) != null
    ? ref$
    : {};
  return import$(our.pkg, pkg);
}
function errSet(opts){
  return our.pkg.confSet({
    source: opts,
    target: our.opts,
    name: 'err'
  });
}
function pcomplain(arg$){
  var msg, type, internal, printStackTrace, code, stackRewind, ref$, printStackTraceOpt, printFileAndLine, error, allow, throws, that, bulletColor, stack, funcname, filename, lineNum, msgStr;
  msg = arg$.msg, type = arg$.type, internal = arg$.internal, printStackTrace = arg$.printStackTrace, code = arg$.code, stackRewind = (ref$ = arg$.stackRewind) != null ? ref$ : 0;
  if (!util) {
    util = require('util');
  }
  printStackTraceOpt = printStackTrace;
  if (!isArr(msg)) {
    return iwarn('bad param msg');
  }
  msg = map(function(it){
    if (isObj(it)) {
      return util.inspect(it);
    } else {
      return it;
    }
  }, msg);
  printFileAndLine = false;
  if (type === 'aerror') {
    if (!msg.length) {
      msg.push("bad call.");
    }
    msg.unshift("Api error:");
    error = true;
    printFileAndLine = true;
    printStackTrace = true;
    allow = our.opts.apiError === 'allow';
    throws = our.opts.apiError === 'throw';
  } else if (type === 'ierror') {
    if (!msg.length) {
      msg.push("something's wrong.");
    }
    msg.unshift("Internal error:");
    printFileAndLine = true;
    printStackTrace = true;
    allow = our.opts.error === 'allow';
    throws = our.opts.error === 'throw';
  } else if (type === 'iwarn') {
    if (!msg.length) {
      msg.push("something's wrong.");
    }
    msg.unshift("Internal warning:");
    printFileAndLine = true;
    printStackTrace = true;
    allow = true;
    throws = false;
  } else if (type === 'error') {
    if (!msg.length) {
      msg.push("something's wrong.");
    }
    msg.unshift("Error:");
    printFileAndLine = false;
    printStackTrace = false;
    allow = our.opts.error === 'allow';
    throws = our.opts.error === 'throw';
  } else if (type === 'warn') {
    if (!msg.length) {
      msg.push("something's wrong.");
    }
    msg.unshift("Warning:");
    printFileAndLine = false;
    printStackTrace = false;
    allow = true;
    throws = false;
  }
  if ((that = printStackTraceOpt) != null) {
    printStackTrace = that;
  }
  if ((that = our.opts.printStackTrace) != null) {
    printStackTrace = that;
  }
  if (throws) {
    yellow = green = brightRed = red = function(it){
      if (isArr(it)) {
        return it[0];
      } else {
        return it;
      }
    };
  }
  if (allow) {
    bulletColor = brightRed;
  } else {
    bulletColor = red;
  }
  if (printStackTrace || printFileAndLine) {
    ref$ = getStack(stackRewind), stack = ref$[0], funcname = ref$[1], filename = ref$[2], lineNum = ref$[3];
  }
  msg[0] = function(){
    var ind, spa, bul;
    ind = repeatString$(' ', bulletGet('indent'));
    spa = repeatString$(' ', bulletGet('spacing'));
    bul = bulletColor([
      bullet(), {
        warnOnError: false
      }
    ]);
    return ind + bul + spa + msg[0];
  }();
  if (printFileAndLine) {
    msg.push("(" + (yellow([
      filename, {
        warnOnError: false
      }
    ]) + "") + function(){
      if (funcname) {
        return ":" + (green([
          funcname, {
            warnOnError: false
          }
        ]) + "");
      } else {
        return '';
      }
    }() + ":" + (brightRed([
      lineNum, {
        warnOnError: false
      }
    ]) + "") + ")");
  }
  if (printStackTrace) {
    msg.push("\n");
    if (typeof m != 'undefined' && m !== null) {
      msg.push(m[2]);
    } else {
      msg.push(stack);
    }
  }
  msg.push("\n");
  msgStr = join(' ', msg);
  if (throws) {
    throw new Error(msgStr);
  }
  process.stderr.write(join(' ', msg));
  if (!allow) {
    code == null && (code = 1);
    process.exit(code);
  }
}
function getStack(stackRewind){
  var stack, ref$, funcname, filename, lineNum;
  stack = (new Error).stack;
  if (stack == null) {
    stack = '';
  }
  stack = stack.replace(/^\s*\S+\s+/, '   ');
  ref$ = function(){
    var regex, myStack, m;
    regex = repeatString$(".*\n", 3 + stackRewind);
    myStack = stack.replace(RegExp('^' + regex), '');
    if (m = myStack.match(/^\s+at\s+(\S+)\s*\((.+?):(\d+):\d+\)/)) {
      return [m[1], m[2], m[3]];
    } else if (m = myStack.match(/^\s+at\s+(.+?):(\d+):\d+/)) {
      return [void 8, m[1], m[2]];
    } else {
      return ["«unknown-file»", "«unknown-line»"];
    }
  }(), funcname = ref$[0], filename = ref$[1], lineNum = ref$[2];
  return [stack, funcname, filename, lineNum];
}
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
function repeatString$(str, n){
  for (var r = ''; n > 0; (n >>= 1) && (str += str)) if (n & 1) r += str;
  return r;
}
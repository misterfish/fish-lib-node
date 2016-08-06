var ref$, last, join, map, types, speak, util, nodeUtil, our, out$ = typeof exports != 'undefined' && exports || this;
out$.init = init;
out$.squeakSet = squeakSet;
out$.icomplain = icomplain;
out$.complain = complain;
out$.iwarn = iwarn;
out$.ierror = ierror;
out$.warn = warn;
out$.error = error;
out$.aerror = aerror;
ref$ = require("prelude-ls"), last = ref$.last, join = ref$.join, map = ref$.map;
types = require('./types');
speak = require('./speak');
util = require('./util');
nodeUtil = void 8;
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
  var msg, res$, i$, to$, opts, func;
  res$ = [];
  for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
    res$.push(arguments[i$]);
  }
  msg = res$;
  opts = last(msg);
  if (types.isObj(opts)) {
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
  var msg, res$, i$, to$, opts, func;
  res$ = [];
  for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
    res$.push(arguments[i$]);
  }
  msg = res$;
  opts = last(msg);
  if (types.isObj(opts)) {
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
  var args, res$, i$, to$, opts;
  res$ = [];
  for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
    res$.push(arguments[i$]);
  }
  args = res$;
  opts = last(args);
  if (types.isObj(opts)) {
    args.pop();
  } else {
    opts = {};
  }
  return pcomplain((opts.msg = args, opts.type = 'iwarn', opts.internal = true, opts));
}
function ierror(){
  var args, res$, i$, to$, opts;
  res$ = [];
  for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
    res$.push(arguments[i$]);
  }
  args = res$;
  opts = last(args);
  if (types.isObj(opts)) {
    args.pop();
  } else {
    opts = {};
  }
  return pcomplain((opts.msg = args, opts.type = 'ierror', opts.internal = true, opts));
}
function warn(){
  var args, res$, i$, to$, opts;
  res$ = [];
  for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
    res$.push(arguments[i$]);
  }
  args = res$;
  opts = last(args);
  if (types.isObj(opts)) {
    args.pop();
  } else {
    opts = {};
  }
  return pcomplain((opts.msg = args, opts.type = 'warn', opts.internal = false, opts));
}
function error(){
  var args, res$, i$, to$, opts;
  res$ = [];
  for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
    res$.push(arguments[i$]);
  }
  args = res$;
  opts = last(args);
  if (types.isObj(opts)) {
    args.pop();
  } else {
    opts = {};
  }
  return pcomplain((opts.msg = args, opts.type = 'error', opts.internal = false, opts));
}
function aerror(){
  var args, res$, i$, to$, opts;
  res$ = [];
  for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
    res$.push(arguments[i$]);
  }
  args = res$;
  opts = last(args);
  if (types.isObj(opts)) {
    args.pop();
  } else {
    opts = {};
  }
  return pcomplain((opts.msg = args, opts.type = 'aerror', opts.internal = false, opts));
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
function squeakSet(opts){
  our.pkg.confSet({
    source: opts,
    target: our.opts,
    name: 'err'
  });
  return this;
}
function squeakGet(key){
  if (!our.opts.hasOwnProperty(key)) {
    return complain('No such key', speak.brightRed(key));
  }
  return our.opts[key];
}
function pcomplain(opts){
  var msg, type, internal, code, stackRewind, ref$, errorType, apiErrorType, printStackTraceOpt, msgBegin, msgMain, msgEnd, printFileAndLine, printStackTrace, allow, throws, that, bulletColor, stack, funcname, filename, lineNum, msgBeginStr, msgMainStr, msgEndStr, msgStr;
  msg = opts.msg, type = opts.type, internal = opts.internal, code = opts.code, stackRewind = (ref$ = opts.stackRewind) != null ? ref$ : 0;
  errorType = (ref$ = opts.error) != null
    ? ref$
    : our.opts.error;
  apiErrorType = (ref$ = opts.apiError) != null
    ? ref$
    : our.opts.apiError;
  printStackTraceOpt = (ref$ = opts.printStackTrace) != null
    ? ref$
    : our.opts.printStackTrace;
  if (!isPhantom()) {
    if (!nodeUtil) {
      nodeUtil = require('util');
    }
  } else {
    nodeUtil = {
      inspect: function(){
        return toArray(arguments).map(function(it){
          if (it.toString != null) {
            return it.toString();
          } else {
            return it;
          }
        }).join(' ');
      }
    };
  }
  if (!types.isArr(msg)) {
    return iwarn('bad param msg');
  }
  msg = map(function(it){
    if (types.isObj(it)) {
      return nodeUtil.inspect(it);
    } else {
      return it;
    }
  }, msg);
  msgBegin = [];
  msgMain = msg;
  msgEnd = [];
  printFileAndLine = false;
  if (errorType !== 'fatal' && errorType !== 'allow' && errorType !== 'throw') {
    errorType = 'fatal';
  }
  if (apiErrorType !== 'fatal' && apiErrorType !== 'allow' && apiErrorType !== 'throw') {
    apiErrorType = 'fatal';
  }
  if (type === 'aerror') {
    if (!msgMain.length) {
      msgMain.push("bad call.");
    }
    msgBegin.push("Api error:");
    printFileAndLine = true;
    printStackTrace = true;
    allow = apiErrorType === 'allow';
    throws = apiErrorType === 'throw';
  } else if (type === 'ierror') {
    if (!msgMain.length) {
      msgMain.push("something's wrong.");
    }
    msgBegin.push("Internal error:");
    printFileAndLine = true;
    printStackTrace = true;
    allow = errorType === 'allow';
    throws = errorType === 'throw';
  } else if (type === 'iwarn') {
    if (!msgMain.length) {
      msgMain.push("something's wrong.");
    }
    msgBegin.push("Internal warning:");
    printFileAndLine = true;
    printStackTrace = true;
    allow = true;
    throws = false;
  } else if (type === 'error') {
    if (!msgMain.length) {
      msgMain.push("something's wrong.");
    }
    msgBegin.push("Error:");
    printFileAndLine = false;
    printStackTrace = false;
    allow = errorType === 'allow';
    throws = errorType === 'throw';
  } else if (type === 'warn') {
    if (!msgMain.length) {
      msgMain.push("something's wrong.");
    }
    msgBegin.push("Warning:");
    printFileAndLine = false;
    printStackTrace = false;
    allow = true;
    throws = false;
  }
  if ((that = printStackTraceOpt) != null) {
    printStackTrace = that;
  }
  if (throws) {
    speak.yellow = speak.green = speak.brightRed = speak.red = function(it){
      if (types.isArr(it)) {
        return it[0];
      } else {
        return it;
      }
    };
  }
  if (allow) {
    bulletColor = speak.brightRed;
  } else {
    bulletColor = speak.red;
  }
  if (printStackTrace || printFileAndLine) {
    ref$ = getStack(stackRewind), stack = ref$[0], funcname = ref$[1], filename = ref$[2], lineNum = ref$[3];
  }
  msgBegin.unshift(function(){
    var ind, spa, bul;
    ind = repeatString$(' ', speak.bulletGet('indent'));
    spa = repeatString$(' ', speak.bulletGet('spacing'));
    bul = bulletColor([
      speak.bullet(), {
        warnOnError: false
      }
    ]);
    return ind + bul + spa;
  }());
  if (printFileAndLine) {
    msgEnd.push("(" + (speak.yellow([
      filename, {
        warnOnError: false
      }
    ]) + "") + function(){
      if (funcname) {
        return ":" + (speak.green([
          funcname, {
            warnOnError: false
          }
        ]) + "");
      } else {
        return '';
      }
    }() + ":" + (speak.brightRed([
      lineNum, {
        warnOnError: false
      }
    ]) + "") + ")");
  }
  if (printStackTrace) {
    msgEnd.push("\n");
    if (typeof m != 'undefined' && m !== null) {
      msgEnd.push(m[2]);
    } else {
      msgEnd.push(stack);
    }
  }
  msgEnd.push("\n");
  msgBeginStr = join('', msgBegin);
  msgMainStr = join(' ', msgMain);
  msgEndStr = join(' ', msgEnd);
  msgStr = join(' ', util.array(msgBeginStr, msgMainStr, msgEndStr));
  if (throws) {
    throw new Error(msgMainStr);
  }
  console.warn(msgStr);
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
function isPhantom(){
  if ((typeof window != 'undefined' && window !== null) && window.callPhantom && window._phantom) {
    return true;
  }
}
function toArray(){
  var i$, x$, ref$, len$, results$ = [];
  for (i$ = 0, len$ = (ref$ = arguments[0]).length; i$ < len$; ++i$) {
    x$ = ref$[i$];
    results$.push(x$);
  }
  return results$;
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
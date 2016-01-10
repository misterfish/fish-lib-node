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
    fatal: true,
    printStackTrace: false
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
  func = our.opts.fatal ? ierror : iwarn;
  opts.stackRewind == null && (opts.stackRewind = 0);
  opts.stackRewind += 2;
  return func(msg, opts);
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
  func = our.opts.fatal ? error : warn;
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
  return pcomplain((opts.msg = msg, opts.type = 'internal', opts.error = false, opts));
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
  return pcomplain((opts.msg = msg, opts.type = 'internal', opts.error = true, opts));
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
  return pcomplain((opts.msg = msg, opts.type = 'normal', opts.error = false, opts));
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
  return pcomplain((opts.msg = msg, opts.type = 'normal', opts.error = true, opts));
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
  return pcomplain((opts.msg = msg, opts.type = 'api', opts));
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
"# --- like calling icomplain msg, stack-rewind: 1\n#\n# (since it's another call on the stack, stack-rewind is 2).\n\nfunction icomplain1 ...msg\n    opts = last msg\n    if is-obj opts then msg.pop() else opts = {}\n    opts.stack-rewind = 2\n    icomplain msg, opts\n\n/*\n * Like calling complain msg, stack-rewind: 1\n * However since it's another call on the stack, it's 2 in the call.\n * \n */\nfunction complain1 ...msg\n    opts = last msg\n    if is-obj opts then msg.pop() else opts = {}\n    opts.stack-rewind = 2\n    complain msg, opts";
/**
 * @private
 *
 * All error and warn functions route through this underlying one.
 *
 * msg: array.
 */
function pcomplain(arg$){
  var msg, type, error, printStackTrace, code, stackRewind, ref$, stack, funcname, filename, lineNum, printFileAndLine, bulletColor;
  msg = arg$.msg, type = arg$.type, error = arg$.error, printStackTrace = arg$.printStackTrace, code = arg$.code, stackRewind = (ref$ = arg$.stackRewind) != null ? ref$ : 0;
  if (!util) {
    util = require('util');
  }
  printStackTrace == null && (printStackTrace = our.opts.printStackTrace);
  stack = (new Error).stack;
  if (stack == null) {
    stack = '';
  }
  stack = stack.replace(/^\s*\S+\s+/, '   ');
  ref$ = function(){
    var regex, myStack, m;
    regex = repeatString$(".*\n", 2 + stackRewind);
    myStack = stack.replace(RegExp('^' + regex), '');
    if (m = myStack.match(/^\s+at\s+(\S+)\s*\((.+?):(\d+):\d+\)/)) {
      return [m[1], m[2], m[3]];
    } else if (m = myStack.match(/^\s+at\s+(.+?):(\d+):\d+/)) {
      return [void 8, m[1], m[2]];
    } else {
      return ["«unknown-file»", "«unknown-line»"];
    }
  }(), funcname = ref$[0], filename = ref$[1], lineNum = ref$[2];
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
  if (type === 'api') {
    msg.unshift("Api error:");
    error = true;
    printFileAndLine = true;
  } else if (type === 'internal') {
    if (error) {
      msg.unshift("Internal error:");
    } else {
      msg.unshift("Internal warning:");
    }
    printFileAndLine = true;
  } else {
    if (error) {
      msg.unshift("Error:");
    } else {
      msg.unshift("Warning:");
    }
    printFileAndLine = false;
  }
  if (error) {
    bulletColor = red;
  } else {
    bulletColor = brightRed;
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
  process.stderr.write(join(' ', msg));
  if (error) {
    code == null && (code = 1);
    process.exit(code);
  }
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
// Generated by LiveScript 1.4.0
/*
 * Useful stuff for writing in LiveScript.
 *
 * Source: misterfish@github/fish-lib-ls
 *
 * License: GPL 2.0
 *
 * Author: Allen Haim <allen@netherrealm.net>
 */
(function(){
  var childProcess, ref$, curry, join, last, map, each, compact, keys, values, sprintf, BULLETS, Bullet, Identifier, Sys, Err, green, brightGreen, blue, brightBlue, red, brightRed, yellow, brightYellow, cyan, brightCyan, magenta, brightMagenta, _, ident, k, v, slice$ = [].slice, toString$ = {}.toString, split$ = ''.split;
  childProcess = require('child_process');
  ref$ = require("prelude-ls"), curry = ref$.curry, join = ref$.join, last = ref$.last, map = ref$.map, each = ref$.each, compact = ref$.compact, keys = ref$.keys, values = ref$.values;
  sprintf = require('sprintf');
  BULLETS = {
    ghost: '꣐',
    star: '٭',
    bassClef: '𝄢',
    parallelLines: '𝄓',
    segno: '𝄋',
    ypsili: '𝁐',
    straggismata: '𝁄',
    petasti: '𝁉',
    paraklitiki: '𝀉',
    dipli: '𝀒'
  };
  Bullet = {
    vals: void 8,
    str: void 8,
    indent: 0,
    spacing: 1
  };
  Identifier = {
    main: {},
    color: {},
    util: {}
  };
  Sys = {
    type: 'exec',
    die: false,
    verbose: true,
    quiet: false,
    quietOnExit: false,
    sync: false,
    errPrint: true,
    outPrint: false,
    errList: false,
    outList: false,
    slurp: true,
    ignoreNodeSyserr: false,
    keepTrailingNewline: false
  };
  Err = {
    fatal: true,
    stackTrace: false
  };
  green = curry(color)('green');
  brightGreen = curry(color)('bright-green');
  blue = curry(color)('blue');
  brightBlue = curry(color)('blue');
  red = curry(color)('red');
  brightRed = curry(color)('bright-red');
  yellow = curry(color)('yellow');
  brightYellow = curry(color)('bright-yellow');
  cyan = curry(color)('cyan');
  brightCyan = curry(color)('bright-cyan');
  magenta = curry(color)('magenta');
  brightMagenta = curry(color)('bright-magenta');
  function shellQuote(arg){
    if (/[!$&*?()`<>|\s]/.exec(arg)) {
      arg = arg.replace(/'/g, "'\\''");
      return "'" + arg + "'";
    } else {
      return arg;
    }
  }
  function log(){
    var msg;
    msg = slice$.call(arguments);
    return console.log.apply(console, msg);
  }
  /**
   *
   * Usage: 
   *
   * iwarn 'string' [, 'string', ...,] {opts}
   *
   * opts is optional.
   *
   */
  function iwarn(){
    var msg, opts;
    msg = slice$.call(arguments);
    opts = last(msg);
    if (toString$.call(opts).slice(8, -1) === 'Object') {
      msg.pop();
    } else {
      opts = {};
    }
    return pcomplain(mergeObjects(opts, {
      msg: msg,
      internal: true,
      error: false
    }));
  }
  function ierror(){
    var msg, opts;
    msg = slice$.call(arguments);
    opts = last(msg);
    if (toString$.call(opts).slice(8, -1) === 'Object') {
      msg.pop();
    } else {
      opts = {};
    }
    return pcomplain(mergeObjects(opts, {
      msg: msg,
      internal: true,
      error: true
    }));
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
    return pcomplain(mergeObjects(opts, {
      msg: msg,
      internal: false,
      error: false
    }));
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
    return pcomplain(mergeObjects(opts, {
      msg: msg,
      internal: false,
      error: true
    }));
  }
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
  /**
   * Return Bullet.str if it's been set, otherwise a random bullet.
   */
  function bullet(){
    var that;
    if ((that = Bullet.str) != null) {
      return that;
    }
    if (Bullet.vals == null) {
      Bullet.vals = values(BULLETS);
    }
    return Bullet.vals[Math.floor(Math.random() * Bullet.vals.length)];
  }
  function ord(it){
    if (!isStr(it)) {
      return icomplain1('Bad call');
    }
    if (it.length > 1) {
      warn("Ignoring extra chars (got '" + green(it.substr(0, 1)) + brightRed(it.substr(1)) + "' ");
    }
    return it.charCodeAt(0);
  }
  function chr(it){
    if (!isNum(it)) {
      return icomplain1('Bad call');
    }
    return String.fromCharCode(it);
  }
  function info(){
    var prnt, ind, spa, bul;
    if (!arguments.length) {
      return;
    }
    prnt = [].slice.call(arguments);
    ind = repeatString$(' ', Bullet.indent);
    spa = repeatString$(' ', Bullet.spacing);
    bul = blue(bullet());
    prnt[0] = ind + bul + spa + prnt[0];
    console.log.apply(console, prnt);
  }
  function errSet(opts){
    return confSet(Err, 'err', opts);
  }
  function sysSet(opts){
    return confSet(Sys, 'sys', opts);
  }
  function bulletSet(opts){
    var that, ref$, s;
    if ((that = opts.str) != null) {
      Bullet.str = that;
    } else if ((that = opts.key) != null) {
      Bullet.str = (ref$ = BULLETS[that]) != null ? ref$ : ' ';
    }
    if ((s = opts.spacing) != null) {
      if (!isNum(s)) {
        return iwarn('bad spacing');
      }
      Bullet.spacing = s;
    }
    if ((s = opts.indent) != null) {
      if (!isNum(s)) {
        return iwarn('bad indent');
      }
      return Bullet.indent = s;
    }
  }
  /**
   *
   * Usage:
   *
   * sys-ok <pass-through>, onok
   * sys-ok <pass-through>, onok, onnotok
   *
   * All args but onok and onnotok are simply passed through to sys. 
   *
   * All forms of sys are supported except the ones with an {opts} arg.
   * 
   * out and err are ignored and that can't be changed by the caller -- keep
   * this function simple and more complex things can use sys-exec or sys-spawn
   * directly.
   */
  function sysOk(){
    var argsArray, onxxx, onok, onnotok, opts;
    argsArray = [].slice.call(arguments);
    onxxx = argsArray.pop();
    if (!isFunc(onxxx)) {
      return iwarn('bad call');
    }
    if (isFunc(last(argsArray))) {
      onok = argsArray.pop();
      onnotok = onxxx;
    } else {
      onok = onxxx;
      onnotok = void 8;
    }
    opts = {
      oncomplete: function(arg$){
        var ok, code, signal;
        ok = arg$.ok, code = arg$.code, signal = arg$.signal;
        if (ok) {
          if (onok) {
            return onok();
          }
        } else {
          if (onnotok) {
            return onnotok({
              code: code,
              signal: signal
            });
          }
        }
      },
      quiet: true,
      outIgnore: true,
      errIgnore: true
    };
    argsArray.push(opts);
    return sys.apply(this, argsArray);
  }
  /**
   *
   * sys-exec and sys-spawn have almost exactly the same usage:
   *
   * sys-xxx {opts}                                            # 1
   * sys-xxx 'cmd'                                             # 2
   * sys-xxx 'cmd', {opts}                                     # 3
  
   * sys-xxx 'cmd', [args]                                     # 4 (only spawn)
   * sys-xxx 'cmd', [args], {opts}                             # 5 (only spawn)
   * sys-xxx 'cmd', [args], oncomplete                         # 6 (only spawn)
   * sys-xxx 'cmd', [args], {opts}, oncomplete                 # 7 (only spawn)
  
   * sys-xxx 'cmd', oncomplete                                 # 8
   * sys-xxx 'cmd', {opts}, oncomplete                         # 9
   * sys-xxx 'cmd', 'arg1', ... , oncomplete                   # 10
   * sys-xxx 'cmd', 'arg1', ... , {opts}, oncomplete           # 11
   * sys-xxx 'cmd', 'arg1', ...                                # 12
   * sys-xxx 'cmd', 'arg1', ... , {opts}                       # 13
   *
   * Command strings and elements of [args] are joined on ' '.
   * 
   * Quoting is handled very differently in the two cases.
   *
   * The ChildProcess object is returned in all cases and the caller can do
   * what they want with it. 
   *
   * These functions can die and bring the whole program down with them. To
   * avoid that make sure 'die' is false (see also sys-set). By default it is
   * globally false.
   *
   * sys-exec:
   *
   * sys-exec uses child_process.exec and should be used for shell-style
   * commands, e.g. 'ls | wc > out'
   *
   * Note that node will kill the child process if it emits too much data on
   * stdout or stderr (see 'maxBuffer' below).
   * 
   * Almost all components not involving shell metacharacters (and anything
   * user-supplied) should always be quoted, using shell-quote() for example.
   * 
   * Example:
   *
   * sys-exec 'ls', shell-quote source-file, '| wc >', shell-quote out-file
   *
   * Note that it's tricky to know when a shell command fails:
   *
   * sys-exec 'wcabc | wc' will print an error to stderr in the default case but will return a zero code.
   * 
   * 
   * sys-spawn:
   *
   * Is more powerful and robust, and node won't kill the child process.
   * Use this if you don't need shell-style commands and want to control the
   * streams.
   *
   * The first string is taken as the command binary and the rest of the
   * arguments, whether strings or in the [args] array, are passed to the
   * [args] param of child_process.spawn and are by definition safe
   * ("quoted").
   *
   * options:
   * 
   * If oncomplete is given or opt 'sync' is false, calls will be asynchronous.
   *
   * (sync mode is currently not implemented).
   *
   * oncomplete is for both success and error.
   *
   *     params: ok, code, signal, out, err
   *
   * If the command fails completely or dies on a signal, we print an error,
   * unless 'quiet' was given.
   *
   * On non-zero or signal we return with error or warn depending on 'die'.
   *
   * 'quiet' mixed with 'die' will be ignored.
   *
   * 'quiet' implies 'quiet-on-exit', 
   * 
   * 'quiet-on-exit' is useful for commands like find, which return non-zero
   * if there were any warnings, but we don't want a warning or error printed.
   *
   * 'out-list' / 'err-list' mean split the output on '\n'. This is not a good
   * idea if the output consists of filenames (because filenames can contain
   * newlines).
   *
   * 'invocation-opts': object values passed to underlying invocation (e.g. cwd, uid, etc.)
   *
   *
   * options (spawn only):
   *
   * If out-ignore or err-ignore is true, those streams are not listened
   * on, though the caller is free to.
   *
   * Otherwise:
   *
   *  If out-print/err-print is true, print the data to its stream.
   *
   *  If out-print/err-print is false, read everything into a scalar/list
   *  (depending on out-list/err-list) and pass it to oncomplete. If oncomplete
   *  is nothing then out-print/err-print are set to true. You can use xxx-ignore
   *  to really ignore them, or pass a no-op as oncomplete to listen and then throw
   *  away.
   *
   * 'keep-trailing-newline': keep the trailing newline at the end of the streams.
   *
   * 'ignore-node-syserr': hide ugly error messages from node (e.g. spawn ENOENT).
   *
   * options (exec only):
   *
   * If out-print/err-print is true, print the data on its stream. stdout and
   * stderr are harvested by the underlying exec in all cases, and are passed to
   * the oncomplete function in all cases, too.
   *
   * out-list/err-list do the same as for spawn.
   *
   * invocation-opts.max-buffer (bytes): 
   *     node will kill the child process if stdout or stderr exceeds this size.
   *     default: not set, meaning use node's default (currently 200K).
   * 
   */
  /**
   * Calls sys-exec or sys-spawn depending on Sys.type.
   */
  function sys(){
    if (Sys.type === 'exec') {
      return sysExec.apply(null, arguments);
    } else if (Sys.type === 'spawn') {
      return sysSpawn.apply(null, arguments);
    } else {
      return warn('bad Sys.type');
    }
  }
  function sysExec(){
    var x$, argsArray, opts;
    x$ = argsArray = [].slice.call(arguments);
    x$.unshift('exec');
    opts = sysProcessArgs.apply(null, argsArray);
    return sysdoExec(opts);
  }
  function sysSpawn(){
    var x$, argsArray, opts;
    x$ = argsArray = [].slice.call(arguments);
    x$.unshift('spawn');
    opts = sysProcessArgs.apply(null, argsArray);
    return sysdoSpawn(opts);
  }
  /**
   * @private
   */
  function sysProcessArgs(){
    var arg, type, numArgs, opts, cmd, args, oncomplete, argsArray, cmdArgs;
    arg = [].slice.call(arguments);
    type = arg.shift();
    if (type !== 'exec' && type !== 'spawn') {
      return iwarn('bad call');
    }
    numArgs = arg.length;
    if (isArr(arg[1]) && type === 'exec') {
      return iwarn('This usage is not supported for exec mode');
    }
    if (numArgs === 1 && isObj(arg[0])) {
      opts = arg[0];
    } else if (numArgs === 1 && isStr(arg[0])) {
      cmd = arg[0];
      opts = {
        cmd: cmd
      };
    } else if (numArgs === 2 && isObj(arg[1])) {
      cmd = arg[0], opts = arg[1];
      opts.cmd = cmd;
    } else if (numArgs === 2 && isArr(arg[1])) {
      cmd = arg[0], args = arg[1];
      opts = {
        cmd: cmd,
        args: args
      };
    } else if (numArgs === 3 && isArr(arg[1]) && isObj(arg[2])) {
      cmd = arg[0], args = arg[1], opts = arg[2];
      opts.cmd = cmd;
      opts.args = args;
    } else if (numArgs === 3 && isArr(arg[1]) && isFunc(arg[2])) {
      cmd = arg[0], args = arg[1], oncomplete = arg[2];
      opts = {
        cmd: cmd,
        args: args,
        oncomplete: oncomplete
      };
    } else if (numArgs === 4 && isArr(arg[1])) {
      cmd = arg[0], args = arg[1], opts = arg[2], oncomplete = arg[3];
      opts.cmd = cmd;
      opts.args = args;
      opts.oncomplete = oncomplete;
    } else if (numArgs === 2 && isFunc(arg[1])) {
      cmd = arg[0], oncomplete = arg[1];
      opts = {
        cmd: cmd,
        oncomplete: oncomplete
      };
    } else if (numArgs === 3 && isObj(arg[1])) {
      cmd = arg[0], opts = arg[1], oncomplete = arg[2];
      opts.cmd = cmd;
      opts.oncomplete = oncomplete;
    } else if (numArgs >= 3 && isStr(arg[1])) {
      argsArray = [].slice.call(arg);
      oncomplete = argsArray.pop();
      cmd = argsArray[0], args = slice$.call(argsArray, 1);
      opts = {
        cmd: cmd,
        args: args,
        oncomplete: oncomplete
      };
    } else if (numArgs >= 4 && isStr(arg[1])) {
      argsArray = [].slice.call(arg);
      oncomplete = argsArray.pop();
      opts = argsArray.pop();
      cmd = argsArray[0], args = slice$.call(argsArray, 1);
      opts.cmd = cmd;
      opts.args = args;
      opts.oncomplete = oncomplete;
    } else if (numArgs >= 2 && isStr(arg[1])) {
      argsArray = [].slice.call(arg);
      cmd = argsArray[0], args = slice$.call(argsArray, 1);
      opts = {
        cmd: cmd,
        args: args
      };
    } else if (numArgs >= 3) {
      argsArray = [].slice.call(arg);
      opts = argsArray.pop();
      cmd = argsArray[0], cmdArgs = slice$.call(argsArray, 1);
      opts.cmd = cmd;
      opts.args = cmdArgs;
    } else {
      return iwarn('bad call');
    }
    opts.type = type;
    return opts;
  }
  function isStr(it){
    return isString(it);
  }
  function isString(it){
    return toString$.call(it).slice(8, -1) === 'String';
  }
  function isBool(it){
    return isBoolean(it);
  }
  function isBoolean(it){
    return toString$.call(it).slice(8, -1) === 'Boolean';
  }
  function isObj(it){
    return isObject(it);
  }
  function isObject(it){
    return toString$.call(it).slice(8, -1) === 'Object';
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
  function isArray(it){
    return toString$.call(it).slice(8, -1) === 'Array';
  }
  function isNum(it){
    return isNumber(it);
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
    var nan;
    if (toString$.call(it).slice(8, -1) !== 'Number') {
      return false;
    }
    nan = isNaN(it);
    return {
      nan: nan,
      isNan: nan
    };
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
  /*
   * Also returns true if the argument is a string representing a number.
   */
  function isANum(it){
    return isANumber(it);
  }
  function isANumber(it){
    if (isStr(it)) {
      it = +it;
      if (isNaN(it)) {
        return false;
      }
    }
    return isNum(it);
  }
  /* 
   * a and b are integers.
   * step by +1 or -1 to get from a to b, inclusive.
   */
  function range(a, b, func){
    var i$, i, results$ = [];
    if (!(isInt(a) && isInt(b))) {
      return icomplain1('Bad call');
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
      return icomplain1('Bad call');
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
  /* usage:
  
   --n, -n, --na, --nam, -nam, all alias to name by default (if it's not a
   cluster of other opts).
   But in this case -n and -a cluster. so -na is -n -a while -nam is --name.
  
   opt = getopt do
     s: 'b'
     t: 'b'
     path: 'p'
     name: 's'
     alpha: 'ms' # will become an array
     n: 'b'
     a:
       'b'
       some-option: 'val' # although no options are currently supported (nopt doesn't seem very configurable)
  
   { name, math, alpha, path } = opt
   name or error 'Missing name'
  
  */
  function getopt(args){
    var nopt, path, knownOpts, shortHands, types, arrangedKeys, i$, len$, opt, v, type, opts, parsed, k;
    nopt = require('nopt');
    path == null && (path = require('path'));
    knownOpts = {};
    shortHands = {};
    types = {
      b: Boolean,
      s: String,
      r: Number,
      p: path,
      ms: Array
    };
    arrangedKeys = function(){
      var list, opt, ref$, v;
      list = [];
      for (opt in ref$ = args) {
        v = ref$[opt];
        if (opt.length === 1) {
          list.push(opt);
        } else {
          list.unshift(opt);
        }
      }
      return list;
    }();
    for (i$ = 0, len$ = arrangedKeys.length; i$ < len$; ++i$) {
      opt = arrangedKeys[i$];
      v = args[opt];
      if (isArray(v)) {
        type = v[0], opts = v[1];
      } else {
        type = v;
      }
      fn$();
    }
    parsed = nopt(knownOpts, shortHands, process.argv, 2);
    for (k in parsed) {
      v = parsed[k];
      if (k === 'argv') {
        continue;
      }
      if (!knownOpts[k]) {
        complain("Unknown option:", brightRed(k));
      }
    }
    return parsed;
    function fn$(){
      var long, longType, ref$;
      long = opt;
      longType = (ref$ = types[type]) != null
        ? ref$
        : complain('Invalid type:', brightRed(type));
      knownOpts[long] = longType;
      return shortHands[long.substring(0, 1)] = ['--' + long];
    }
  }
  function confSet(obj, name, opts){
    var k, v, results$ = [];
    name == null && (name = 'unknown');
    for (k in opts) {
      v = opts[k];
      if (obj[k] == null) {
        iwarn("Invalid opt for " + yellow(name) + ": " + brightRed(k));
        continue;
      }
      results$.push(obj[k] = v);
    }
    return results$;
  }
  function color(col, s){
    var str, opt;
    if (toString$.call(s).slice(8, -1) === 'Array') {
      str = s[0], opt = s[1];
    } else {
      str = s;
      opt = {};
    }
    return join('', [_color(col, opt), str, _color('reset', opt)]);
  }
  function _color(c, arg$){
    var warnOnError, col;
    warnOnError = (arg$ != null
      ? arg$
      : {}).warnOnError;
    warnOnError == null && (warnOnError = true);
    col = {
      red: 31,
      'bright-red': 91,
      green: 32,
      'bright-green': 92,
      yellow: 33,
      'bright-yellow': 93,
      blue: 34,
      'bright-blue': 94,
      magenta: 35,
      'bright-magenta': 95,
      cyan: 36,
      'bright-cyan': 96,
      reset: 0
    }[c];
    if (col == null) {
      if (warnOnError) {
        iwarn("Invalid color:", c);
      }
      return '';
    }
    return '[' + col + 'm';
  }
  /**
    * @private
    */
  function sysdoExec(arg$){
    var cmd, oncomplete, args, ref$, die, verbose, quiet, quietOnExit, sync, outPrint, errPrint, outList, errList, invocationOpts, ok, child, complain;
    cmd = arg$.cmd, oncomplete = arg$.oncomplete, args = (ref$ = arg$.args) != null
      ? ref$
      : [], die = (ref$ = arg$.die) != null
      ? ref$
      : Sys.die, verbose = (ref$ = arg$.verbose) != null
      ? ref$
      : Sys.verbose, quiet = (ref$ = arg$.quiet) != null
      ? ref$
      : Sys.quiet, quietOnExit = (ref$ = arg$.quietOnExit) != null
      ? ref$
      : Sys.quietOnExit, sync = (ref$ = arg$.sync) != null
      ? ref$
      : Sys.sync, outPrint = (ref$ = arg$.outPrint) != null
      ? ref$
      : Sys.outPrint, errPrint = (ref$ = arg$.errPrint) != null
      ? ref$
      : Sys.errPrint, outList = (ref$ = arg$.outList) != null
      ? ref$
      : Sys.outList, errList = (ref$ = arg$.errList) != null
      ? ref$
      : Sys.errList, invocationOpts = arg$.invocationOpts;
    ok = true;
    args.unshift(cmd);
    cmd = args.join(' ');
    if (verbose) {
      log(green(bullet()) + " " + cmd);
    }
    child = childProcess.exec(cmd, invocationOpts, function(theError, out, err){
      var signal, code;
      if (errPrint) {
        process.stderr.write(err);
      }
      if (outPrint) {
        process.stdout.write(out);
      }
      if (theError) {
        signal = void 8;
        code = theError.code;
        if (code === 'ENOENT') {
          warn('Couldn\'t spawn a shell!');
        } else {
          signal = theError.signal;
        }
        return syserror({
          cmd: cmd,
          code: code,
          signal: signal,
          oncomplete: oncomplete,
          out: out,
          err: err,
          die: die,
          quiet: quiet,
          quietOnExit: quietOnExit
        });
      }
      if (errList) {
        err = err.split(/\n/);
      }
      if (outList) {
        out = out.split(/\n/);
      }
      if (oncomplete != null) {
        return oncomplete({
          ok: true,
          out: out,
          err: err
        });
      }
    });
    if (child == null) {
      complain = die ? error : warn;
      complain('Null return from child-process.exec');
      if (oncomplete != null) {
        return oncomplete({
          ok: false,
          out: out,
          err: err
        });
      }
    }
  }
  /**
    * @private
    */
  function sysdoSpawn(arg$){
    var cmd, oncomplete, args, ref$, outIgnore, errIgnore, die, verbose, quiet, quietOnExit, sync, outPrint, errPrint, outList, errList, slurp, ignoreNodeSyserr, keepTrailingNewline, invocationOpts, syserrorFired, streamData, that, cmdBin, cmdArgs, spawned, streamConfig, handleDataAsList, handleData, thisError;
    cmd = arg$.cmd, oncomplete = arg$.oncomplete, args = (ref$ = arg$.args) != null
      ? ref$
      : [], outIgnore = (ref$ = arg$.outIgnore) != null ? ref$ : false, errIgnore = (ref$ = arg$.errIgnore) != null ? ref$ : false, die = (ref$ = arg$.die) != null
      ? ref$
      : Sys.die, verbose = (ref$ = arg$.verbose) != null
      ? ref$
      : Sys.verbose, quiet = (ref$ = arg$.quiet) != null
      ? ref$
      : Sys.quiet, quietOnExit = (ref$ = arg$.quietOnExit) != null
      ? ref$
      : Sys.quietOnExit, sync = (ref$ = arg$.sync) != null
      ? ref$
      : Sys.sync, outPrint = (ref$ = arg$.outPrint) != null
      ? ref$
      : Sys.outPrint, errPrint = (ref$ = arg$.errPrint) != null
      ? ref$
      : Sys.errPrint, outList = (ref$ = arg$.outList) != null
      ? ref$
      : Sys.outList, errList = (ref$ = arg$.errList) != null
      ? ref$
      : Sys.errList, slurp = (ref$ = arg$.slurp) != null
      ? ref$
      : Sys.slurp, ignoreNodeSyserr = (ref$ = arg$.ignoreNodeSyserr) != null
      ? ref$
      : Sys.ignoreNodeSyserr, keepTrailingNewline = (ref$ = arg$.keepTrailingNewline) != null
      ? ref$
      : Sys.keepTrailingNewline, invocationOpts = arg$.invocationOpts;
    if (global.globFs == null) {
      global.globFs = require('glob-fs');
    }
    syserrorFired = false;
    if (quiet) {
      quietOnExit = true;
    }
    streamData = {};
    if (outList) {
      streamData.out = [];
    } else {
      streamData.out = '';
    }
    if (errList) {
      streamData.err = [];
    } else {
      streamData.err = '';
    }
    if (sync) {
      iwarn("sys sync not implemented");
      return;
    }
    if ((that = oncomplete) != null) {
      if (!isFunc(that)) {
        return iwarn('bad call');
      }
    } else {
      outPrint = true;
      errPrint = true;
    }
    ref$ = function(){
      var parsedBin, parsedArgs;
      throw Error('unimplemented');
      parsedBin = parse.shift();
      parsedArgs = [];
      each(function(it){
        var that;
        if (isObj(it)) {
          if (it.op === 'glob') {
            if ((that = it.pattern) != null) {
              return each(function(it){
                return parsedArgs.push(it);
              })(
              globFs().readdirSync(that));
            } else {
              return iwarn("Can't deal with parsed arg:", it);
            }
          } else {
            if ((that = it.op) != null) {
              return parsedArgs.push(that);
            } else {
              return iwarn("Can't deal with parsed arg:", it);
            }
          }
        } else {
          return parsedArgs.push(it);
        }
      })(
      parse);
      return [parsedBin, parsedArgs.concat(args)];
    }(), cmdBin = ref$[0], cmdArgs = ref$[1];
    if (verbose) {
      (function(){
        var printCmd, ind, spa, bul;
        printCmd = join(' ', [cmd].concat(map(shellQuote, args)));
        ind = repeatString$(' ', Bullet.indent);
        spa = repeatString$(' ', Bullet.spacing);
        bul = green(bullet());
        return log(ind + "" + bul + spa + printCmd);
      })();
    }
    spawned = childProcess.spawn(cmdBin, cmdArgs, invocationOpts);
    streamConfig = {
      out: {
        ignore: outIgnore,
        spawnStream: spawned.stdout,
        print: outPrint,
        list: outList,
        which: 'out',
        procStream: process.stdout
      },
      err: {
        ignore: errIgnore,
        spawnStream: spawned.stderr,
        print: errPrint,
        list: errList,
        which: 'err',
        procStream: process.stderr
      }
    };
    handleDataAsList = function(strc, str){
      var stream, split, last, first, firstCurIsNewline, lastPrevWasPartial;
      stream = streamData[strc.which];
      split = split$.call(str, '\n');
      if (stream.length > 0) {
        last = stream[stream.length - 1];
        first = split[0];
        firstCurIsNewline = first === '';
        lastPrevWasPartial = last !== '';
        if (lastPrevWasPartial) {
          if (firstCurIsNewline) {
            split.shift();
          } else {
            stream[stream.length - 1] += split.shift();
          }
        } else {
          stream.pop();
        }
      }
      return each(partialize$.apply(stream, [stream.push, [void 8], [0]]), split);
    };
    handleData = function(strc, str){
      if (strc.print) {
        return strc.procStream.write(str);
      } else {
        if (strc.list) {
          return handleDataAsList(strc, str);
        } else {
          return streamData[strc.which] += str;
        }
      }
    };
    each(function(it){
      it.spawnStream.on('error', function(error){
        return iwarn("Got error on stream std" + which + " (" + error + ")");
      });
      if (it.ignore) {
        return;
      }
      it.spawnStream.on('data', function(data){
        var str;
        if (isString(data)) {
          str = data;
        } else if (Buffer.isBuffer(data)) {
          str = data.toString();
        } else {
          return iwarn("Doesn't seem to be a Buffer or a string");
        }
        return handleData(it, str);
      });
      return it.spawnStream.on('end', function(){
        var out;
        if (!keepTrailingNewline) {
          out = streamData.out;
          if (outList) {
            if (last(out) === '') {
              return out.pop();
            }
          } else if (out.substring(out.length - 1) === '\n') {
            return streamData.out = out.substring(0, out.length - 1);
          }
        }
      });
    })(
    values(streamConfig));
    thisError = function(args){
      return syserror(mergeObjects(args, {
        cmd: cmd,
        oncomplete: oncomplete,
        die: die,
        quiet: quiet,
        quietOnExit: quietOnExit,
        out: streamData.out,
        err: streamData.err
      }));
    };
    spawned.on('error', function(errobj){
      var errmsg, syserrorFired;
      errmsg = errobj.message;
      if (!ignoreNodeSyserr) {
        handleData(streamConfig.err, errmsg);
      }
      if (!syserrorFired) {
        syserrorFired = true;
        return thisError({});
      }
    });
    spawned.on('close', function(code, signal){
      var syserrorFired;
      if (code !== 0) {
        if (!syserrorFired) {
          syserrorFired = true;
          return thisError({
            code: code,
            signal: signal
          });
        }
      } else {
        if (oncomplete != null) {
          return oncomplete({
            ok: true,
            signal: signal,
            code: code,
            out: streamData.out,
            err: streamData.err
          });
        }
      }
    });
    return spawned;
  }
  /**
   * @private
   */
  function syserror(arg$){
    var cmd, code, signal, oncomplete, out, err, die, quiet, quietOnExit, strSig, strCmd, strExit, str;
    cmd = arg$.cmd, code = arg$.code, signal = arg$.signal, oncomplete = arg$.oncomplete, out = arg$.out, err = arg$.err, die = arg$.die, quiet = arg$.quiet, quietOnExit = arg$.quietOnExit;
    if (signal) {
      strSig = " «got signal " + cyan(signal) + "»";
    }
    strCmd = " «" + brightRed(cmd) + "»";
    if (code != null) {
      strExit = " «exit status " + yellow(code) + "»";
    }
    str = join('', compact(["Couldn't execute cmd", strCmd, strExit, strSig]));
    if (die) {
      error(str);
      process.exit(code);
    } else {
      if (code != null) {
        if (!quietOnExit) {
          warn(str);
        }
      } else {
        if (!quiet) {
          warn(str);
        }
      }
    }
    if (oncomplete != null) {
      return oncomplete({
        ok: false,
        code: code,
        signal: signal,
        out: out,
        err: err
      });
    }
  }
  /**
   * @private
   */
  /**
   * Checks Err.fatal and routes through either ierror or iwarn with stack-rewind bumped by one.
   */
  function icomplain(){
    var msg, opts, func;
    msg = slice$.call(arguments);
    opts = last(msg);
    if (isObj(opts)) {
      msg.pop();
    } else {
      opts = {};
    }
    func = Err.fatal && ierror || iwarn;
    opts.stackRewind == null && (opts.stackRewind = 0);
    opts.stackRewind++;
    return func(msg, opts);
  }
  /**
   * Checks Err.fatal and routes through either error or warn with stack-rewind bumped by one.
   */
  function complain(){
    var msg, opts, func;
    msg = slice$.call(arguments);
    opts = last(msg);
    if (isObj(opts)) {
      msg.pop();
    } else {
      opts = {};
    }
    func = Err.fatal && error || warn;
    opts.stackRewind == null && (opts.stackRewind = 0);
    opts.stackRewind++;
    return func(msg, opts);
  }
  /*
   * Like calling icomplain msg, stack-rewind: 1
   * However since it's another call on the stack, it's 2 in the call.
   * 
   */
  function icomplain1(){
    var msg, opts;
    msg = slice$.call(arguments);
    opts = last(msg);
    if (isObj(opts)) {
      msg.pop();
    } else {
      opts = {};
    }
    opts.stackRewind = 2;
    return icomplain(msg, opts);
  }
  /*
   * Like calling complain msg, stack-rewind: 1
   * However since it's another call on the stack, it's 2 in the call.
   * 
   */
  function complain1(){
    var msg, opts;
    msg = slice$.call(arguments);
    opts = last(msg);
    if (isObj(opts)) {
      msg.pop();
    } else {
      opts = {};
    }
    opts.stackRewind = 2;
    return complain(msg, opts);
  }
  /**
   * @private
   *
   * All error and warn functions route through this underlying one.
   *
   * msg: array.
   */
  function pcomplain(arg$){
    var msg, internal, error, stackTrace, code, stackRewind, ref$, stack, funcname, filename, lineNum, bulletColor;
    msg = arg$.msg, internal = arg$.internal, error = arg$.error, stackTrace = arg$.stackTrace, code = arg$.code, stackRewind = (ref$ = arg$.stackRewind) != null ? ref$ : 0;
    if (global.util == null) {
      global.util = require('util');
    }
    stackTrace == null && (stackTrace = Err.stackTrace);
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
    if (!isArray(msg)) {
      return iwarn('bad param msg');
    }
    msg = map(function(it){
      if (isObj(it)) {
        return util.inspect(it);
      } else {
        return it;
      }
    }, msg);
    if (internal) {
      if (error) {
        msg.unshift("Internal error:");
      } else {
        msg.unshift("Internal warning:");
      }
    } else {
      if (error) {
        msg.unshift("Error:");
      } else {
        msg.unshift("Warning:");
      }
    }
    if (error) {
      bulletColor = red;
    } else {
      bulletColor = brightRed;
    }
    msg[0] = function(){
      var ind, spa, bul;
      ind = repeatString$(' ', Bullet.indent);
      spa = repeatString$(' ', Bullet.spacing);
      bul = bulletColor([
        bullet(), {
          warnOnError: false
        }
      ]);
      return ind + bul + spa + msg[0];
    }();
    if (internal) {
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
    if (stackTrace) {
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
  Identifier.main = {
    importAll: importAll,
    importKind: importKind,
    shellQuote: shellQuote,
    ord: ord,
    chr: chr,
    bullet: bullet,
    log: log,
    info: info,
    errSet: errSet,
    iwarn: iwarn,
    ierror: ierror,
    warn: warn,
    error: error,
    complain: complain,
    complain1: complain1,
    icomplain: icomplain,
    icomplain1: icomplain1,
    sysSet: sysSet,
    sys: sys,
    sysExec: sysExec,
    sysSpawn: sysSpawn,
    sysOk: sysOk,
    bulletSet: bulletSet,
    getopt: getopt,
    sprintf: sprintf
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
    isANumber: isANumber
  };
  for (_ in Identifier) {
    ident = Identifier[_];
    for (k in ident) {
      v = ident[k];
      module.exports[k] = v;
    }
  }
  function repeatString$(str, n){
    for (var r = ''; n > 0; (n >>= 1) && (str += str)) if (n & 1) r += str;
    return r;
  }
  function partialize$(f, args, where){
    var context = this;
    return function(){
      var params = slice$.call(arguments), i,
          len = params.length, wlen = where.length,
          ta = args ? args.concat() : [], tw = where ? where.concat() : [];
      for(i = 0; i < len; ++i) { ta[tw[0]] = params[i]; tw.shift(); }
      return len < wlen && len ?
        partialize$.apply(context, [f, ta, tw]) : f.apply(context, ta);
    };
  }
}).call(this);

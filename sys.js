var childProcess, ref$, last, values, join, main, types, isBuffer, isFunc, isObj, isArr, isStr, squeak, aerror, iwarn, warn, error, speak, log, bullet, our, out$ = typeof exports != 'undefined' && exports || this, slice$ = [].slice, split$ = ''.split;
out$.init = init;
out$.sysSet = sysSet;
out$.sysOk = sysOk;
out$.sysExec = sysExec;
out$.sysSpawn = sysSpawn;
out$.sys = sys;
out$.shellQuote = shellQuote;
childProcess = require('child_process');
ref$ = require("prelude-ls"), last = ref$.last, values = ref$.values, join = ref$.join;
main = require.main;
main.exports;
ref$ = types = require('./types'), isBuffer = ref$.isBuffer, isFunc = ref$.isFunc, isObj = ref$.isObj, isArr = ref$.isArr, isStr = ref$.isStr;
ref$ = squeak = require('./squeak'), aerror = ref$.aerror, iwarn = ref$.iwarn, warn = ref$.warn, error = ref$.error;
ref$ = speak = require('./speak'), log = ref$.log, bullet = ref$.bullet;
our = {
  pkg: {
    confSet: void 8
  },
  opts: {
    type: 'exec',
    die: false,
    verbose: true,
    quietOnExit: false,
    quiet: false,
    sync: false,
    errPrint: true,
    outPrint: false,
    errSplit: false,
    outSplit: false,
    outIgnore: false,
    errIgnore: false,
    slurp: true,
    ignoreNodeSyserr: false,
    keepTrailingNewline: false,
    invocationOpts: {}
  }
};
function init(arg$){
  var pkg, ref$;
  pkg = (ref$ = (arg$ != null
    ? arg$
    : {}).pkg) != null
    ? ref$
    : {};
  return import$(our.pkg, pkg);
}
function sysSet(opts){
  return our.pkg.confSet({
    source: opts,
    target: our.opts,
    name: 'sys'
  });
}
function shellQuote(arg){
  if (/[!$&*?()`<>|\s]/.exec(arg)) {
    arg = arg.replace(/'/g, "'\\''");
    return "'" + arg + "'";
  }
  return arg;
}
function sysOk(){
  var args, onxxx, onok, onnotok, opts;
  args = slice$.call(arguments);
  onxxx = args.pop();
  if (!isFunc(onxxx)) {
    return aerror('bad call');
  }
  if (isFunc(last(args))) {
    onok = args.pop();
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
  args.push(opts);
  return sys.apply(this, args);
}
function sysExec(){
  var args, opts;
  args = slice$.call(arguments);
  args.unshift('exec');
  opts = sysProcessArgs.apply(null, args);
  return sysdoExec(opts);
}
function sysSpawn(){
  var args, opts;
  args = slice$.call(arguments);
  args.unshift('spawn');
  opts = sysProcessArgs.apply(null, args);
  return sysdoSpawn(opts);
}
function sys(){
  if (our.opts.type === 'exec') {
    return sysExec.apply(null, arguments);
  } else if (our.opts.type === 'spawn') {
    return sysSpawn.apply(null, arguments);
  } else {
    return aerror('bad global opts.type');
  }
}
function sysdoExec(opts){
  var cmd, oncomplete, args, ref$, die, verbose, quiet, quietOnExit, sync, outPrint, errPrint, outSplit, errSplit, invocationOpts;
  cmd = opts.cmd, oncomplete = opts.oncomplete, args = (ref$ = opts.args) != null
    ? ref$
    : [], die = (ref$ = opts.die) != null
    ? ref$
    : our.opts.die, verbose = (ref$ = opts.verbose) != null
    ? ref$
    : our.opts.verbose, quiet = (ref$ = opts.quiet) != null
    ? ref$
    : our.opts.quiet, quietOnExit = (ref$ = opts.quietOnExit) != null
    ? ref$
    : our.opts.quietOnExit, sync = (ref$ = opts.sync) != null
    ? ref$
    : our.opts.sync, outPrint = (ref$ = opts.outPrint) != null
    ? ref$
    : our.opts.outPrint, errPrint = (ref$ = opts.errPrint) != null
    ? ref$
    : our.opts.errPrint, outSplit = (ref$ = opts.outSplit) != null
    ? ref$
    : our.opts.outSplit, errSplit = (ref$ = opts.errSplit) != null
    ? ref$
    : our.opts.errSplit, invocationOpts = opts.invocationOpts;
  args.unshift(cmd);
  cmd = args.join(' ');
  if (verbose) {
    log(sprintf("%s %s", green(bullet()), cmd));
  }
  if (sync) {
    return sysdoExecSync(opts);
  } else {
    return sysdoExecAsync(opts);
  }
}
function sysdoExecSync(opts){
  var cmd, oncomplete, args, ref$, die, verbose, quiet, quietOnExit, sync, outPrint, errPrint, outIgnore, errIgnore, outSplit, errSplit, invocationOpts, stderr, stdout, ret, e, pid, output, status, signal, error;
  cmd = opts.cmd, oncomplete = opts.oncomplete, args = (ref$ = opts.args) != null
    ? ref$
    : [], die = (ref$ = opts.die) != null
    ? ref$
    : our.opts.die, verbose = (ref$ = opts.verbose) != null
    ? ref$
    : our.opts.verbose, quiet = (ref$ = opts.quiet) != null
    ? ref$
    : our.opts.quiet, quietOnExit = (ref$ = opts.quietOnExit) != null
    ? ref$
    : our.opts.quietOnExit, sync = (ref$ = opts.sync) != null
    ? ref$
    : our.opts.sync, outPrint = (ref$ = opts.outPrint) != null
    ? ref$
    : our.opts.outPrint, errPrint = (ref$ = opts.errPrint) != null
    ? ref$
    : our.opts.errPrint, outIgnore = (ref$ = opts.outIgnore) != null
    ? ref$
    : our.opts.outIgnore, errIgnore = (ref$ = opts.errIgnore) != null
    ? ref$
    : our.opts.errIgnore, outSplit = (ref$ = opts.outSplit) != null
    ? ref$
    : our.opts.outSplit, errSplit = (ref$ = opts.errSplit) != null
    ? ref$
    : our.opts.errSplit, invocationOpts = opts.invocationOpts;
  opts = {
    stdio: array(0, outIgnore
      ? 'ignore'
      : outPrint ? 1 : 'pipe', errIgnore
      ? 'ignore'
      : errPrint ? 2 : 'pipe')
  };
  import$(opts, invocationOpts);
  stderr = '<suppressed or empty>';
  try {
    stdout = childProcess.execSync(cmd, opts);
    stdout = outputToScalarOrList(stdout, outSplit);
    ret = {
      ok: true,
      code: 0,
      out: stdout,
      stdout: stdout,
      stderr: stderr
    };
    if (oncomplete) {
      oncomplete(ret);
    }
  } catch (e$) {
    e = e$;
    pid = e.pid, output = e.output, stdout = e.stdout, stderr = e.stderr, status = e.status, signal = e.signal, error = e.error;
    stdout = outputToScalarOrList(stdout, outSplit);
    ret = {
      ok: false,
      code: status,
      signal: signal,
      out: stdout,
      stdout: stdout,
      stderr: stderr
    };
    syserror({
      cmd: cmd,
      code: status,
      signal: signal,
      oncomplete: oncomplete,
      stdout: stdout,
      stderr: stderr,
      die: die,
      quiet: quiet,
      quietOnExit: quietOnExit
    });
  }
  return ret;
}
function sysdoExecAsync(opts){
  var cmd, oncomplete, args, ref$, die, verbose, quiet, quietOnExit, sync, outPrint, errPrint, outSplit, errSplit, invocationOpts, onChild, child, complain;
  cmd = opts.cmd, oncomplete = opts.oncomplete, args = (ref$ = opts.args) != null
    ? ref$
    : [], die = (ref$ = opts.die) != null
    ? ref$
    : our.opts.die, verbose = (ref$ = opts.verbose) != null
    ? ref$
    : our.opts.verbose, quiet = (ref$ = opts.quiet) != null
    ? ref$
    : our.opts.quiet, quietOnExit = (ref$ = opts.quietOnExit) != null
    ? ref$
    : our.opts.quietOnExit, sync = (ref$ = opts.sync) != null
    ? ref$
    : our.opts.sync, outPrint = (ref$ = opts.outPrint) != null
    ? ref$
    : our.opts.outPrint, errPrint = (ref$ = opts.errPrint) != null
    ? ref$
    : our.opts.errPrint, outSplit = (ref$ = opts.outSplit) != null
    ? ref$
    : our.opts.outSplit, errSplit = (ref$ = opts.errSplit) != null
    ? ref$
    : our.opts.errSplit, invocationOpts = opts.invocationOpts;
  onChild = function(err, stdout, stderr){
    var signal, code;
    if (errPrint) {
      process.stderr.write(stderr);
    }
    if (outPrint) {
      process.stdout.write(stdout);
    }
    if (err) {
      signal = void 8;
      code = err.code;
      if (code === 'ENOENT') {
        if (!quiet) {
          warn("Couldn't spawn a shell!");
        }
      } else {
        signal = err.signal;
      }
      return syserror({
        cmd: cmd,
        code: code,
        signal: signal,
        oncomplete: oncomplete,
        stdout: stdout,
        stderr: stderr,
        die: die,
        quiet: quiet,
        quietOnExit: quietOnExit
      });
    }
    stdout = outputToScalarOrList(stdout, outSplit);
    stderr = outputToScalarOrList(stderr, errSplit);
    if (oncomplete != null) {
      return oncomplete({
        ok: true,
        out: stdout,
        stdout: stdout,
        stderr: stderr
      });
    }
  };
  child = childProcess.exec(cmd, invocationOpts, onChild);
  if (child == null) {
    if (!quiet) {
      complain = die ? error : warn;
      complain('Null return from child-process.exec()');
    }
    if (oncomplete != null) {
      return oncomplete({
        ok: false
      });
    }
  }
}
/**
  * @private
  */
function sysdoSpawn(arg$){
  var cmd, oncomplete, args, ref$, outIgnore, errIgnore, die, verbose, quiet, quietOnExit, sync, outPrint, errPrint, outSplit, errSplit, slurp, ignoreNodeSyserr, keepTrailingNewline, invocationOpts, syserrorFired, streamData, that, cmdBin, cmdArgs, spawned, streamConfig, handleDataAsList, handleData, thisError;
  cmd = arg$.cmd, oncomplete = arg$.oncomplete, args = (ref$ = arg$.args) != null
    ? ref$
    : [], outIgnore = (ref$ = arg$.outIgnore) != null
    ? ref$
    : our.opts.outIgnore, errIgnore = (ref$ = arg$.errIgnore) != null
    ? ref$
    : our.opts.errIgnore, die = (ref$ = arg$.die) != null
    ? ref$
    : our.opts.die, verbose = (ref$ = arg$.verbose) != null
    ? ref$
    : our.opts.verbose, quiet = (ref$ = arg$.quiet) != null
    ? ref$
    : our.opts.quiet, quietOnExit = (ref$ = arg$.quietOnExit) != null
    ? ref$
    : our.opts.quietOnExit, sync = (ref$ = arg$.sync) != null
    ? ref$
    : our.opts.sync, outPrint = (ref$ = arg$.outPrint) != null
    ? ref$
    : our.opts.outPrint, errPrint = (ref$ = arg$.errPrint) != null
    ? ref$
    : our.opts.errPrint, outSplit = (ref$ = arg$.outSplit) != null
    ? ref$
    : our.opts.outSplit, errSplit = (ref$ = arg$.errSplit) != null
    ? ref$
    : our.opts.errSplit, slurp = (ref$ = arg$.slurp) != null
    ? ref$
    : our.opts.slurp, ignoreNodeSyserr = (ref$ = arg$.ignoreNodeSyserr) != null
    ? ref$
    : our.opts.ignoreNodeSyserr, keepTrailingNewline = (ref$ = arg$.keepTrailingNewline) != null
    ? ref$
    : our.opts.keepTrailingNewline, invocationOpts = arg$.invocationOpts;
  if (global.globFs == null) {
    global.globFs = require('glob-fs');
  }
  syserrorFired = false;
  if (quiet) {
    quietOnExit = true;
  }
  streamData = {};
  if (outSplit) {
    streamData.out = [];
  } else {
    streamData.out = '';
  }
  if (errSplit) {
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
      return aerror();
    }
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
      list: outSplit,
      which: 'out',
      procStream: process.stdout
    },
    err: {
      ignore: errIgnore,
      spawnStream: spawned.stderr,
      print: errPrint,
      list: errSplit,
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
        if (outSplit) {
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
  str = join('', compact(array("Couldn't execute cmd", strCmd, strExit, strSig)));
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
function sysProcessArgs(){
  var argsArray, type, numArgs, opts, cmd, args, oncomplete, cmdArgs, x$;
  argsArray = slice$.call(arguments);
  type = argsArray.shift();
  if (type !== 'exec' && type !== 'spawn') {
    return aerror();
  }
  numArgs = argsArray.length;
  if (isArr(argsArray[1]) && type === 'exec') {
    return aerror('This usage is not supported for exec mode');
  }
  if (numArgs === 1 && isObj(argsArray[0])) {
    opts = argsArray[0];
  } else if (numArgs === 1 && isStr(argsArray[0])) {
    cmd = argsArray[0];
    opts = {
      cmd: cmd
    };
  } else if (numArgs === 2 && isObj(argsArray[1])) {
    cmd = argsArray[0], opts = argsArray[1];
    opts.cmd = cmd;
  } else if (numArgs === 2 && isArr(argsArray[1])) {
    cmd = argsArray[0], args = argsArray[1];
    opts = {
      cmd: cmd,
      args: args
    };
  } else if (numArgs === 3 && isArr(argsArray[1]) && isObj(argsArray[2])) {
    cmd = argsArray[0], args = argsArray[1], opts = argsArray[2];
    opts.cmd = cmd;
    opts.args = args;
  } else if (numArgs === 3 && isArr(argsArray[1]) && isFunc(argsArray[2])) {
    cmd = argsArray[0], args = argsArray[1], oncomplete = argsArray[2];
    opts = {
      cmd: cmd,
      args: args,
      oncomplete: oncomplete
    };
  } else if (numArgs === 4 && isArr(argsArray[1])) {
    cmd = argsArray[0], args = argsArray[1], opts = argsArray[2], oncomplete = argsArray[3];
    if (!isObj(opts)) {
      return aerror();
    }
    if (!isFunc(oncomplete)) {
      return aerror();
    }
    opts.cmd = cmd;
    opts.args = args;
    opts.oncomplete = oncomplete;
  } else if (numArgs === 2 && isFunc(argsArray[1])) {
    cmd = argsArray[0], oncomplete = argsArray[1];
    opts = {
      cmd: cmd,
      oncomplete: oncomplete
    };
  } else if (numArgs === 3 && isObj(argsArray[1])) {
    cmd = argsArray[0], opts = argsArray[1], oncomplete = argsArray[2];
    if (!isFunc(oncomplete)) {
      return aerror();
    }
    opts.cmd = cmd;
    opts.oncomplete = oncomplete;
  } else if (numArgs >= 3 && isStr(argsArray[1])) {
    oncomplete = argsArray.pop();
    if (!isFunc(oncomplete)) {
      return aerror();
    }
    cmd = argsArray[0], args = slice$.call(argsArray, 1);
    opts = {
      cmd: cmd,
      args: args,
      oncomplete: oncomplete
    };
  } else if (numArgs >= 4 && isStr(argsArray[1])) {
    oncomplete = argsArray.pop();
    if (!isFunc(oncomplete)) {
      return aerror();
    }
    opts = argsArray.pop();
    if (!isObj(opts)) {
      return aerror();
    }
    cmd = argsArray[0], args = slice$.call(argsArray, 1);
    opts.cmd = cmd;
    opts.args = args;
    opts.oncomplete = oncomplete;
  } else if (numArgs >= 2 && isStr(argsArray[1])) {
    cmd = argsArray[0], args = slice$.call(argsArray, 1);
    opts = {
      cmd: cmd,
      args: args
    };
  } else if (numArgs >= 3 && isStr(argsArray[1])) {
    opts = argsArray.pop();
    if (!isObj(opts)) {
      return aerror();
    }
    cmd = argsArray[0], cmdArgs = slice$.call(argsArray, 1);
    opts.cmd = cmd;
    opts.args = cmdArgs;
  } else {
    return aerror();
  }
  x$ = opts;
  x$.type = type;
  return x$;
}
function outputToScalarOrList(output, doSplit){
  if (isBuffer(output)) {
    output = output.toString();
  }
  if (doSplit) {
    if (doSplit === true) {
      doSplit = '\n';
    }
    output = output.split(RegExp('' + doSplit));
  }
  return output;
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
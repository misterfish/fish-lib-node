var childProcess, ref$, last, keys, join, map, each, compact, sprintf, isBuffer, isString, isFunc, isObj, isArr, isStr, aerror, iwarn, warn, error, log, bullet, bulletGet, green, brightRed, yellow, magenta, cyan, array, our, out$ = typeof exports != 'undefined' && exports || this, slice$ = [].slice;
out$.init = init;
out$.sysGet = sysGet;
out$.sysSet = sysSet;
out$.sysOk = sysOk;
out$.sysExec = sysExec;
out$.sysSpawn = sysSpawn;
out$.sys = sys;
out$.shellQuote = shellQuote;
childProcess = require('child_process');
ref$ = require("prelude-ls"), last = ref$.last, keys = ref$.keys, join = ref$.join, map = ref$.map, each = ref$.each, compact = ref$.compact;
sprintf = require('sprintf');
ref$ = require('./types'), isBuffer = ref$.isBuffer, isString = ref$.isString, isFunc = ref$.isFunc, isObj = ref$.isObj, isArr = ref$.isArr, isStr = ref$.isStr;
ref$ = require('./squeak'), aerror = ref$.aerror, iwarn = ref$.iwarn, warn = ref$.warn, error = ref$.error;
ref$ = require('./speak'), log = ref$.log, bullet = ref$.bullet, bulletGet = ref$.bulletGet, green = ref$.green, brightRed = ref$.brightRed, yellow = ref$.yellow, magenta = ref$.magenta, cyan = ref$.cyan;
array = require('./util').array;
our = {
  pkg: {
    confSet: void 8
  },
  opts: {
    type: 'exec',
    die: false,
    verbose: true,
    quietOnExit: false,
    quietNodeErr: false,
    quiet: false,
    sync: false,
    errPrint: true,
    outPrint: false,
    errSplit: false,
    outSplit: false,
    outSplitRemoveTrailingElement: true,
    errSplitRemoveTrailingElement: true,
    outIgnore: false,
    errIgnore: false,
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
function sysGet(key){
  if (!our.opts.hasOwnProperty(key)) {
    return complain('No such key', brightRed(key));
  }
  return our.opts[key];
}
function shellQuote(arg){
  if (/[;!$&*?()`<>|\s]/.exec(arg)) {
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
  var cmd, args, ref$, verbose, sync;
  cmd = opts.cmd, args = (ref$ = opts.args) != null
    ? ref$
    : [], verbose = (ref$ = opts.verbose) != null
    ? ref$
    : our.opts.verbose, sync = (ref$ = opts.sync) != null
    ? ref$
    : our.opts.sync;
  opts.cmd = join(' ', [cmd].concat(args));
  if (verbose) {
    log(sprintf("%s %s", green(bullet()), opts.cmd));
  }
  if (sync) {
    return sysdoExecSync(opts);
  } else {
    return sysdoExecAsync(opts);
  }
}
function sysdoExecSync(opts){
  var cmd, oncomplete, args, ref$, outIgnore, errIgnore, die, verbose, quiet, quietOnExit, quietNodeErr, sync, outPrint, errPrint, outSplit, errSplit, outSplitRemoveTrailingElement, errSplitRemoveTrailingElement, invocationOpts, callOpts, stderr, stdout, ret, err, pid, output, status, signal, theError;
  cmd = opts.cmd, oncomplete = opts.oncomplete, args = (ref$ = opts.args) != null
    ? ref$
    : [], outIgnore = (ref$ = opts.outIgnore) != null
    ? ref$
    : our.opts.outIgnore, errIgnore = (ref$ = opts.errIgnore) != null
    ? ref$
    : our.opts.errIgnore, die = (ref$ = opts.die) != null
    ? ref$
    : our.opts.die, verbose = (ref$ = opts.verbose) != null
    ? ref$
    : our.opts.verbose, quiet = (ref$ = opts.quiet) != null
    ? ref$
    : our.opts.quiet, quietOnExit = (ref$ = opts.quietOnExit) != null
    ? ref$
    : our.opts.quietOnExit, quietNodeErr = (ref$ = opts.quietNodeErr) != null
    ? ref$
    : our.opts.quietNodeErr, sync = (ref$ = opts.sync) != null
    ? ref$
    : our.opts.sync, outPrint = (ref$ = opts.outPrint) != null
    ? ref$
    : our.opts.outPrint, errPrint = (ref$ = opts.errPrint) != null
    ? ref$
    : our.opts.errPrint, outSplit = (ref$ = opts.outSplit) != null
    ? ref$
    : our.opts.outSplit, errSplit = (ref$ = opts.errSplit) != null
    ? ref$
    : our.opts.errSplit, outSplitRemoveTrailingElement = (ref$ = opts.outSplitRemoveTrailingElement) != null
    ? ref$
    : our.opts.outSplitRemoveTrailingElement, errSplitRemoveTrailingElement = (ref$ = opts.errSplitRemoveTrailingElement) != null
    ? ref$
    : our.opts.errSplitRemoveTrailingElement, invocationOpts = opts.invocationOpts;
  callOpts = {
    stdio: array(0, outIgnore
      ? 'ignore'
      : outPrint ? 1 : 'pipe', errIgnore
      ? 'ignore'
      : errPrint ? 2 : 'pipe')
  };
  import$(callOpts, invocationOpts);
  stderr = '<suppressed or empty>';
  try {
    stdout = childProcess.execSync(cmd, callOpts);
    stdout = outputToScalarOrList(stdout, outSplit, outSplitRemoveTrailingElement);
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
    err = e$;
    pid = err.pid, output = err.output, stdout = err.stdout, stderr = err.stderr, status = err.status, signal = err.signal;
    theError = err.error;
    stdout = outputToScalarOrList(stdout, outSplit, outSplitRemoveTrailingElement);
    stderr = outputToScalarOrList(stderr, errSplit, errSplitRemoveTrailingElement);
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
      nodeErr: theError,
      stdout: stdout,
      stderr: stderr,
      die: die,
      quiet: quiet,
      quietOnExit: quietOnExit,
      quietNodeErr: quietNodeErr
    });
  }
  return ret;
}
function sysdoExecAsync(opts){
  var cmd, oncomplete, args, ref$, die, verbose, quiet, quietOnExit, quietNodeErr, sync, outPrint, errPrint, outSplit, errSplit, outSplitRemoveTrailingElement, errSplitRemoveTrailingElement, invocationOpts, onChild, child;
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
    : our.opts.quietOnExit, quietNodeErr = (ref$ = opts.quietNodeErr) != null
    ? ref$
    : our.opts.quietNodeErr, sync = (ref$ = opts.sync) != null
    ? ref$
    : our.opts.sync, outPrint = (ref$ = opts.outPrint) != null
    ? ref$
    : our.opts.outPrint, errPrint = (ref$ = opts.errPrint) != null
    ? ref$
    : our.opts.errPrint, outSplit = (ref$ = opts.outSplit) != null
    ? ref$
    : our.opts.outSplit, errSplit = (ref$ = opts.errSplit) != null
    ? ref$
    : our.opts.errSplit, outSplitRemoveTrailingElement = (ref$ = opts.outSplitRemoveTrailingElement) != null
    ? ref$
    : our.opts.outSplitRemoveTrailingElement, errSplitRemoveTrailingElement = (ref$ = opts.errSplitRemoveTrailingElement) != null
    ? ref$
    : our.opts.errSplitRemoveTrailingElement, invocationOpts = opts.invocationOpts;
  onChild = function(err, stdout, stderr){
    var signal, code;
    if (errPrint && stderr != null) {
      console.warn(stderr);
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
        nodeErr: err.toString(),
        stdout: stdout,
        stderr: stderr,
        die: die,
        quiet: quiet,
        quietOnExit: quietOnExit,
        quietNodeErr: quietNodeErr
      });
    }
    stdout = outputToScalarOrList(stdout, outSplit, outSplitRemoveTrailingElement);
    stderr = outputToScalarOrList(stderr, errSplit, errSplitRemoveTrailingElement);
    if (oncomplete != null) {
      return oncomplete({
        ok: true,
        out: stdout,
        stdout: stdout,
        stderr: stderr
      });
    }
  };
  return child = childProcess.exec(cmd, invocationOpts, onChild);
}
function sysdoSpawn(opts){
  var cmd, oncomplete, args, ref$, outIgnore, errIgnore, die, verbose, quiet, quietOnExit, sync, outPrint, errPrint, outSplit, errSplit, quietNodeErr, outSplitRemoveTrailingElement, errSplitRemoveTrailingElement, invocationOpts, that;
  cmd = opts.cmd, oncomplete = opts.oncomplete, args = (ref$ = opts.args) != null
    ? ref$
    : [], outIgnore = (ref$ = opts.outIgnore) != null
    ? ref$
    : our.opts.outIgnore, errIgnore = (ref$ = opts.errIgnore) != null
    ? ref$
    : our.opts.errIgnore, die = (ref$ = opts.die) != null
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
    : our.opts.errSplit, quietNodeErr = (ref$ = opts.quietNodeErr) != null
    ? ref$
    : our.opts.quietNodeErr, outSplitRemoveTrailingElement = (ref$ = opts.outSplitRemoveTrailingElement) != null
    ? ref$
    : our.opts.outSplitRemoveTrailingElement, errSplitRemoveTrailingElement = (ref$ = opts.errSplitRemoveTrailingElement) != null
    ? ref$
    : our.opts.errSplitRemoveTrailingElement, invocationOpts = opts.invocationOpts;
  if (quiet) {
    quietOnExit = opts.quietOnExit = true;
    quietNodeErr = opts.quietNodeErr = true;
  }
  if (outSplit === true) {
    outSplit = opts.outSplit = '\n';
  }
  if (errSplit === true) {
    errSplit = opts.errSplit = '\n';
  }
  if ((that = oncomplete) != null) {
    if (!isFunc(that)) {
      return aerror();
    }
  }
  if (verbose) {
    (function(){
      var printCmd, ind, spa, bul;
      printCmd = join(' ', [cmd].concat(map(shellQuote, args)));
      ind = repeatString$(' ', bulletGet('indent'));
      spa = repeatString$(' ', bulletGet('spacing'));
      bul = green(bullet());
      return log(join('', array(ind, bul, spa, printCmd)));
    })();
  }
  if (sync) {
    return sysdoSpawnSync(opts);
  } else {
    return sysdoSpawnAsync(opts);
  }
}
function sysdoSpawnSync(opts){
  var cmd, oncomplete, args, ref$, outIgnore, errIgnore, die, verbose, quiet, quietOnExit, quietNodeErr, sync, outPrint, errPrint, outSplit, errSplit, outSplitRemoveTrailingElement, errSplitRemoveTrailingElement, invocationOpts, callOpts, ret, pid, output, stdout, stderr, status, signal, theError;
  cmd = opts.cmd, oncomplete = opts.oncomplete, args = (ref$ = opts.args) != null
    ? ref$
    : [], outIgnore = (ref$ = opts.outIgnore) != null
    ? ref$
    : our.opts.outIgnore, errIgnore = (ref$ = opts.errIgnore) != null
    ? ref$
    : our.opts.errIgnore, die = (ref$ = opts.die) != null
    ? ref$
    : our.opts.die, verbose = (ref$ = opts.verbose) != null
    ? ref$
    : our.opts.verbose, quiet = (ref$ = opts.quiet) != null
    ? ref$
    : our.opts.quiet, quietOnExit = (ref$ = opts.quietOnExit) != null
    ? ref$
    : our.opts.quietOnExit, quietNodeErr = (ref$ = opts.quietNodeErr) != null
    ? ref$
    : our.opts.quietNodeErr, sync = (ref$ = opts.sync) != null
    ? ref$
    : our.opts.sync, outPrint = (ref$ = opts.outPrint) != null
    ? ref$
    : our.opts.outPrint, errPrint = (ref$ = opts.errPrint) != null
    ? ref$
    : our.opts.errPrint, outSplit = (ref$ = opts.outSplit) != null
    ? ref$
    : our.opts.outSplit, errSplit = (ref$ = opts.errSplit) != null
    ? ref$
    : our.opts.errSplit, outSplitRemoveTrailingElement = (ref$ = opts.outSplitRemoveTrailingElement) != null
    ? ref$
    : our.opts.outSplitRemoveTrailingElement, errSplitRemoveTrailingElement = (ref$ = opts.errSplitRemoveTrailingElement) != null
    ? ref$
    : our.opts.errSplitRemoveTrailingElement, invocationOpts = opts.invocationOpts;
  callOpts = {
    stdio: array(0, outIgnore
      ? 'ignore'
      : outPrint ? 1 : 'pipe', errIgnore
      ? 'ignore'
      : errPrint ? 2 : 'pipe')
  };
  import$(callOpts, invocationOpts);
  ret = childProcess.spawnSync(cmd, args, callOpts);
  pid = ret.pid, output = ret.output, stdout = ret.stdout, stderr = ret.stderr, status = ret.status, signal = ret.signal;
  theError = ret.error;
  stdout = ret.stdout = outputToScalarOrList(stdout, outSplit, outSplitRemoveTrailingElement);
  stderr = ret.stderr = outputToScalarOrList(stderr, errSplit, errSplitRemoveTrailingElement);
  if (theError) {
    if (stderr != null && !quiet) {
      console.warn(stderr);
    }
    syserror({
      cmd: cmd,
      oncomplete: oncomplete,
      die: die,
      quiet: quiet,
      quietOnExit: quietOnExit,
      quietNodeErr: quietNodeErr,
      signal: signal,
      code: status,
      nodeErr: theError.toString(),
      stdout: stdout,
      stderr: stderr
    });
    return ret;
  }
  if (status) {
    if (stderr != null && !quiet && !die) {
      console.warn(stderr);
    }
    syserror({
      cmd: cmd,
      oncomplete: oncomplete,
      die: die,
      quiet: quiet,
      quietOnExit: quietOnExit,
      quietNodeErr: quietNodeErr,
      signal: signal,
      code: status,
      stdout: stdout,
      stderr: stderr
    });
    return ret;
  }
  if (oncomplete != null) {
    oncomplete({
      ok: true,
      code: status,
      out: stdout,
      stdout: stdout,
      stderr: stderr
    });
  }
  return ret;
}
function sysdoSpawnAsync(opts){
  var cmd, oncomplete, args, ref$, outIgnore, errIgnore, die, verbose, quiet, quietOnExit, sync, outPrint, errPrint, outSplit, errSplit, quietNodeErr, outSplitRemoveTrailingElement, errSplitRemoveTrailingElement, invocationOpts, syserrorFired, streamData, spawned, streamConfigs, doSyserror, doneEvent;
  cmd = opts.cmd, oncomplete = opts.oncomplete, args = (ref$ = opts.args) != null
    ? ref$
    : [], outIgnore = (ref$ = opts.outIgnore) != null
    ? ref$
    : our.opts.outIgnore, errIgnore = (ref$ = opts.errIgnore) != null
    ? ref$
    : our.opts.errIgnore, die = (ref$ = opts.die) != null
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
    : our.opts.errSplit, quietNodeErr = (ref$ = opts.quietNodeErr) != null
    ? ref$
    : our.opts.quietNodeErr, outSplitRemoveTrailingElement = (ref$ = opts.outSplitRemoveTrailingElement) != null
    ? ref$
    : our.opts.outSplitRemoveTrailingElement, errSplitRemoveTrailingElement = (ref$ = opts.errSplitRemoveTrailingElement) != null
    ? ref$
    : our.opts.errSplitRemoveTrailingElement, invocationOpts = opts.invocationOpts;
  syserrorFired = false;
  streamData = {
    out: outSplit ? [] : '',
    err: errSplit ? [] : ''
  };
  spawned = childProcess.spawn(cmd, args, invocationOpts);
  streamConfigs = {
    out: {
      ignore: outIgnore,
      spawnStream: spawned.stdout,
      print: outPrint,
      list: outSplit,
      which: 'out',
      procStream: process.stdout,
      splitString: outSplit,
      splitRemoveTrailingElement: outSplitRemoveTrailingElement
    },
    err: {
      ignore: errIgnore,
      spawnStream: spawned.stderr,
      print: errPrint,
      list: errSplit,
      which: 'err',
      procStream: process.stderr,
      splitString: errSplit,
      splitRemoveTrailingElement: errSplitRemoveTrailingElement
    }
  };
  keys(streamConfigs).forEach(function(which){
    var streamConfig;
    streamConfig = streamConfigs[which];
    streamConfig.spawnStream.on('error', function(error){
      return warn("Got error on stream std" + which, error);
    });
    if (streamConfig.ignore) {
      return;
    }
    streamConfig.spawnStream.on('data', function(data){
      var str;
      if (isString(data)) {
        str = data;
      } else if (isBuffer(data)) {
        str = data.toString();
      } else {
        return iwarn("Doesn't seem to be a Buffer or a string");
      }
      return handleStreamData(streamData, streamConfig, str);
    });
    return streamConfig.spawnStream.on('end', function(){
      var splitRemoveTrailingElement, splitString, data;
      splitRemoveTrailingElement = streamConfig.splitRemoveTrailingElement, splitString = streamConfig.splitString;
      if (splitRemoveTrailingElement && splitString) {
        data = streamData[which];
        if ('' === last(data)) {
          return data.pop();
        }
      }
    });
  });
  doSyserror = function(args){
    return syserror(import$({
      cmd: cmd,
      oncomplete: oncomplete,
      die: die,
      quiet: quiet,
      quietOnExit: quietOnExit,
      quietNodeErr: quietNodeErr,
      stdout: streamData.out,
      stderr: streamData.err
    }, args));
  };
  spawned.on('error', function(errobj){
    if (!syserrorFired) {
      syserrorFired = true;
      return doSyserror({
        nodeErr: errobj.toString()
      });
    }
  });
  doneEvent = isPhantom() ? 'exit' : 'close';
  spawned.on(doneEvent, function(code, signal){
    if (code !== 0) {
      if (!syserrorFired) {
        syserrorFired = true;
        doSyserror({
          code: code,
          signal: signal
        });
      }
      return;
    }
    if (oncomplete) {
      return oncomplete({
        ok: true,
        signal: signal,
        code: code,
        out: streamData.out,
        stdout: streamData.out,
        stderr: streamData.err
      });
    }
  });
  return spawned;
}
function syserror(arg$){
  var cmd, code, signal, oncomplete, nodeErr, stdout, stderr, die, quiet, quietOnExit, quietNodeErr, strSig, strCmd, strExit, strNodeErr, str;
  cmd = arg$.cmd, code = arg$.code, signal = arg$.signal, oncomplete = arg$.oncomplete, nodeErr = arg$.nodeErr, stdout = arg$.stdout, stderr = arg$.stderr, die = arg$.die, quiet = arg$.quiet, quietOnExit = arg$.quietOnExit, quietNodeErr = arg$.quietNodeErr;
  if (signal) {
    strSig = " «got signal " + cyan(signal) + "»";
  }
  strCmd = " " + brightRed(cmd);
  if (code != null) {
    strExit = " «exit status " + yellow(code) + "»";
  }
  if (nodeErr && !quietNodeErr) {
    strNodeErr = " «" + nodeErr + "»";
  }
  str = join('', compact(array("Couldn't execute cmd", strCmd, strExit, strSig, strNodeErr)));
  if (die) {
    if (stderr != null) {
      console.warn(stderr);
    }
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
      out: stdout,
      stdout: stdout,
      stderr: stderr
    });
  }
}
function sysProcessArgs(){
  var argsArray, type, numArgs, opts, cmd, args, oncomplete, lastArg, lastArg2, x$;
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
  } else if (numArgs >= 2 && isStr(argsArray[1])) {
    lastArg = argsArray.pop();
    if (isFunc(lastArg)) {
      oncomplete = lastArg;
      lastArg2 = argsArray.pop();
      if (isObj(lastArg2)) {
        opts = lastArg2;
      } else {
        argsArray.push(lastArg2);
        opts = {};
      }
      cmd = argsArray[0], args = slice$.call(argsArray, 1);
      opts.cmd = cmd;
      opts.args = args;
      opts.oncomplete = oncomplete;
    } else {
      argsArray.push(lastArg);
      lastArg2 = argsArray.pop();
      if (isObj(lastArg2)) {
        opts = lastArg2;
      } else {
        argsArray.push(lastArg2);
        opts = {};
      }
      cmd = argsArray[0], args = slice$.call(argsArray, 1);
      opts.cmd = cmd;
      opts.args = args;
    }
  } else {
    return aerror();
  }
  if (opts.args) {
    opts.args = compact(opts.args.map(function(it){
      if (it == null) {
        warn("Skipping null/undefined arg (check args array)");
      }
      return it;
    }));
  }
  x$ = opts;
  x$.type = type;
  return x$;
}
function outputToScalarOrList(output, doSplit, splitRemoveTrailingElement){
  if (isBuffer(output)) {
    output = output.toString();
  }
  if (doSplit) {
    if (doSplit === true) {
      doSplit = '\n';
    }
    output = output.split(RegExp('' + doSplit));
    if (splitRemoveTrailingElement) {
      if ('' === last(output)) {
        output.pop();
      }
    }
  }
  return output;
}
function handleStreamData(streamData, streamConfig, string){
  var print, procStream, list, handle;
  print = streamConfig.print, procStream = streamConfig.procStream, list = streamConfig.list;
  if (print) {
    procStream.write(string);
    return;
  }
  handle = list ? handleStreamDataAsList : handleStreamDataAsScalar;
  return handle(streamData, streamConfig, string);
}
function handleStreamDataAsScalar(streamData, streamConfig, string){
  return streamData[streamConfig.which] += string;
}
function handleStreamDataAsList(streamData, streamConfig, string){
  var which, splitString, stream, split, last, first, firstCurIsNewline, lastPrevWasPartial;
  which = streamConfig.which, splitString = streamConfig.splitString;
  stream = streamData[which];
  split = string.split(splitString);
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
  return split.forEach(function(it){
    return stream.push(it);
  });
}
function isPhantom(){
  if ((typeof window != 'undefined' && window !== null) && window.callPhantom && window._phantom) {
    return true;
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
var childProcess, ref$, last, keys, join, map, compact, sprintf, types, squeak, speak, util, our, out$ = typeof exports != 'undefined' && exports || this, slice$ = [].slice;
out$.init = init;
out$.sysGet = sysGet;
out$.sysSet = sysSet;
out$.sysOk = sysOk;
out$.sysExec = sysExec;
out$.sysSpawn = sysSpawn;
out$.sys = sys;
out$.shellQuote = shellQuote;
childProcess = require('child_process');
ref$ = require("prelude-ls"), last = ref$.last, keys = ref$.keys, join = ref$.join, map = ref$.map, compact = ref$.compact;
sprintf = require('sprintf');
types = require('./types');
squeak = require('./squeak');
speak = require('./speak');
util = require('./util');
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
  our.pkg.confSet({
    source: opts,
    target: our.opts,
    name: 'sys'
  });
  return this;
}
function sysGet(key){
  if (!our.opts.hasOwnProperty(key)) {
    return complain('No such key', speak.brightRed(key));
  }
  return our.opts[key];
}
function shellQuote(arg){
  if (/['";!$&*?()`<>|\s]/.exec(arg)) {
    arg = arg.replace(/'/g, "'\\''");
    return "'" + arg + "'";
  }
  return arg;
}
function sysOk(){
  var args, res$, i$, to$, onxxx, onok, onnotok, opts;
  res$ = [];
  for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
    res$.push(arguments[i$]);
  }
  args = res$;
  onxxx = args.pop();
  if (!types.isFunc(onxxx)) {
    squeak.aerror('bad call');
  }
  if (types.isFunc(last(args))) {
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
  var args, res$, i$, to$, opts;
  res$ = [];
  for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
    res$.push(arguments[i$]);
  }
  args = res$;
  args.unshift('exec');
  opts = sysProcessArgs.apply(null, args);
  return sysdoExec(opts);
}
function sysSpawn(){
  var args, res$, i$, to$, opts;
  res$ = [];
  for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
    res$.push(arguments[i$]);
  }
  args = res$;
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
    return squeak.aerror('bad global opts.type');
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
    speak.log(sprintf("%s %s", speak.green(speak.bullet()), opts.cmd));
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
    stdio: util.array(0, outIgnore
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
          squeak.warn("Couldn't spawn a shell!");
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
    if (!types.isFunc(that)) {
      squeak.aerror();
    }
  }
  if (verbose) {
    (function(){
      var printCmd, ind, spa, bul;
      printCmd = join(' ', [cmd].concat(map(shellQuote, args)));
      ind = repeatString$(' ', speak.bulletGet('indent'));
      spa = repeatString$(' ', speak.bulletGet('spacing'));
      bul = speak.green(speak.bullet());
      return speak.log(join('', util.array(ind, bul, spa, printCmd)));
    })();
  }
  if (sync) {
    return sysdoSpawnSync(opts);
  } else {
    return sysdoSpawnAsync(opts);
  }
}
function sysdoSpawnSync(opts){
  var cmd, oncomplete, args, ref$, outIgnore, errIgnore, die, verbose, quiet, quietOnExit, quietNodeErr, sync, outPrint, errPrint, outSplit, errSplit, outSplitRemoveTrailingElement, errSplitRemoveTrailingElement, invocationOpts, callOpts, childProcessRet, pid, output, stdout, stderr, status, signal, theError, ret, ok;
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
    stdio: util.array(0, outIgnore
      ? 'ignore'
      : outPrint ? 1 : 'pipe', errIgnore
      ? 'ignore'
      : errPrint ? 2 : 'pipe')
  };
  import$(callOpts, invocationOpts);
  childProcessRet = childProcess.spawnSync(cmd, args, callOpts);
  pid = childProcessRet.pid, output = childProcessRet.output, stdout = childProcessRet.stdout, stderr = childProcessRet.stderr, status = childProcessRet.status, signal = childProcessRet.signal;
  theError = childProcessRet.error;
  ret = {
    stdout: void 8,
    stderr: void 8,
    code: status,
    signal: signal,
    out: void 8
  };
  stdout = ret.stdout = ret.out = outputToScalarOrList(stdout, outSplit, outSplitRemoveTrailingElement);
  stderr = ret.stderr = outputToScalarOrList(stderr, errSplit, errSplitRemoveTrailingElement);
  ok = void 8;
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
    ok = false;
  } else if (status) {
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
    ok = false;
  } else {
    ok = true;
  }
  ret.ok = ok;
  if (oncomplete != null) {
    oncomplete(ret);
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
      return squeak.warn("Got error on stream std" + which, error);
    });
    if (streamConfig.ignore) {
      return;
    }
    streamConfig.spawnStream.on('data', function(data){
      var str;
      if (types.isString(data)) {
        str = data;
      } else if (types.isBuffer(data)) {
        str = data.toString();
      } else {
        return squeak.iwarn("Doesn't seem to be a Buffer or a string");
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
    strSig = " «got signal " + speak.cyan(signal) + "»";
  }
  strCmd = " " + speak.brightRed(cmd);
  if (code != null) {
    strExit = " «exit status " + speak.yellow(code) + "»";
  }
  if (nodeErr && !quietNodeErr) {
    strNodeErr = " «" + nodeErr + "»";
  }
  str = join('', compact(util.array("Couldn't execute cmd", strCmd, strExit, strSig, strNodeErr)));
  if (die) {
    if (stderr != null) {
      console.warn(stderr);
    }
    squeak.error(str);
    process.exit(code);
  } else {
    if (code != null) {
      if (!quietOnExit) {
        squeak.warn(str);
      }
    } else {
      if (!quiet) {
        squeak.warn(str);
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
  var argsArray, res$, i$, to$, type, numArgs, opts, cmd, args, oncomplete, lastArg, lastArg2, x$;
  res$ = [];
  for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
    res$.push(arguments[i$]);
  }
  argsArray = res$;
  type = argsArray.shift();
  if (type !== 'exec' && type !== 'spawn') {
    squeak.aerror();
  }
  numArgs = argsArray.length;
  if (types.isArr(argsArray[1]) && type === 'exec') {
    squeak.aerror('This usage is not supported for exec mode');
  }
  if (numArgs === 1 && types.isObj(argsArray[0])) {
    opts = argsArray[0];
  } else if (numArgs === 1 && types.isStr(argsArray[0])) {
    cmd = argsArray[0];
    opts = {
      cmd: cmd
    };
  } else if (numArgs === 2 && types.isObj(argsArray[1])) {
    cmd = argsArray[0], opts = argsArray[1];
    opts.cmd = cmd;
  } else if (numArgs === 2 && types.isArr(argsArray[1])) {
    cmd = argsArray[0], args = argsArray[1];
    opts = {
      cmd: cmd,
      args: args
    };
  } else if (numArgs === 3 && types.isArr(argsArray[1]) && types.isObj(argsArray[2])) {
    cmd = argsArray[0], args = argsArray[1], opts = argsArray[2];
    opts.cmd = cmd;
    opts.args = args;
  } else if (numArgs === 3 && types.isArr(argsArray[1]) && types.isFunc(argsArray[2])) {
    cmd = argsArray[0], args = argsArray[1], oncomplete = argsArray[2];
    opts = {
      cmd: cmd,
      args: args,
      oncomplete: oncomplete
    };
  } else if (numArgs === 4 && types.isArr(argsArray[1])) {
    cmd = argsArray[0], args = argsArray[1], opts = argsArray[2], oncomplete = argsArray[3];
    if (!types.isObj(opts)) {
      squeak.aerror();
    }
    if (!types.isFunc(oncomplete)) {
      squeak.aerror();
    }
    opts.cmd = cmd;
    opts.args = args;
    opts.oncomplete = oncomplete;
  } else if (numArgs === 2 && types.isFunc(argsArray[1])) {
    cmd = argsArray[0], oncomplete = argsArray[1];
    opts = {
      cmd: cmd,
      oncomplete: oncomplete
    };
  } else if (numArgs === 3 && types.isObj(argsArray[1])) {
    cmd = argsArray[0], opts = argsArray[1], oncomplete = argsArray[2];
    if (!types.isFunc(oncomplete)) {
      squeak.aerror();
    }
    opts.cmd = cmd;
    opts.oncomplete = oncomplete;
  } else if (numArgs >= 2 && types.isStr(argsArray[1])) {
    lastArg = argsArray.pop();
    if (types.isFunc(lastArg)) {
      oncomplete = lastArg;
      lastArg2 = argsArray.pop();
      if (types.isObj(lastArg2)) {
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
      if (types.isObj(lastArg2)) {
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
    squeak.aerror();
  }
  if (opts.args) {
    opts.args = compact(opts.args.map(function(it){
      if (it == null) {
        squeak.warn("Skipping null/undefined arg (check args array)");
      }
      return it;
    }));
  }
  x$ = opts;
  x$.type = type;
  return x$;
}
function outputToScalarOrList(output, doSplit, splitRemoveTrailingElement){
  if (types.isBuffer(output)) {
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
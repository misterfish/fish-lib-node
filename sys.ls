# STDIN XX
# call it stdout & stderr to allow for one day passing an err object. XX
#
#
# --- sys-exec and sys-spawn have mostly the same usage:
#
# sys-xxx {opts}                                            # 1
# sys-xxx 'cmd'                                             # 2
# sys-xxx 'cmd', {opts}                                     # 3
#
# sys-xxx 'cmd', [args]                                     # 4 (only spawn)
# sys-xxx 'cmd', [args], {opts}                             # 5 (only spawn)
# sys-xxx 'cmd', [args], oncomplete                         # 6 (only spawn)
# sys-xxx 'cmd', [args], {opts}, oncomplete                 # 7 (only spawn)
#
# sys-xxx 'cmd', oncomplete                                 # 8
# sys-xxx 'cmd', {opts}, oncomplete                         # 9
# sys-xxx 'cmd', 'arg1', ... , oncomplete                   # 10
# sys-xxx 'cmd', 'arg1', ... , {opts}, oncomplete           # 11
# sys-xxx 'cmd', 'arg1', ...                                # 12
# sys-xxx 'cmd', 'arg1', ... , {opts}                       # 13
#
# see our.opts for the possible options, which can either be set per-call
# (in the opts argument) or globally (using sys-set()).
#
# command strings and elements of [args] are joined on ' '.
# 
# quoting is handled very differently in the two cases (see below).
#
# the ChildProcess object is returned in all asynchronous cases and the
# caller can do what they want with it. 
#
# in the synchronous cases there is no ChildProcess object and the options
# for fine-tuning are somewhat more limited.
#
# in particular, for synchronous exec, you can either print stderr to the
# parent descriptor or not using err-print, but if not, you can't inspect it
# any more unless the command fails.
#
# 'die' is globally false by default, though for short scripts it's often
# convenient to set it to true.
#
# ------ sys-exec:
#
# sys-exec uses child_process.exec and should be used for shell-style
# commands, e.g. 'ls | wc > out'
#
# it spawns a shell and buffers the output.
#
# one major disadvantage is that Node will kill the child process if it
# emits too much data on stdout or stderr (see 'maxBuffer' below); for
# non-trivial commands you should probably be using spawn.
#
# also, you have to be very careful about shell-quoting the arguments (see
# shell-quote()), particularly for user-supplied input.
#
# and it's also difficult to know when a command fails (see the second
# example below).
# 
# --------- examples:
#
# sys-exec 'ls', (shell-quote source-file), '| wc >', (shell-quote out-file)
#
# JS: sysExec('ls', shellQuote(sourceFile), '| wc >', shellQuote
# (outFile))
#
# note that it's tricky to know when a shell command fails:
#
# sys-exec 'wcabc | wc' will print an error to stderr in the default case
# but will return a zero code.
# 
# ------ sys-spawn:
#
# is more powerful and robust, and node won't kill the child process.
#
# use this if you don't need shell-style commands and want to control the
# streams.
#
# the first string is taken as the command binary and the rest of the
# arguments, whether strings or in the [args] array, are passed to the
# [args] param of child_process.spawn and are by definition safe
# (shell-quoted).
#
# --------- examples:
# 
# sys-spawn 'ls' file-one, file-two, file-three
#
# JS: sysSpawn('ls', fileOne, fileTwo, fileThree))
#
# -> no need to worry about the args containing accidental metachars.
#
# sys-spawn 'ls' [file-one, file-two, file-three]
#
# JS: sysSpawn('ls', [fileOne, fileTwo, fileThree]))
#
# -> ditto.
#
# ------ options (both exec and spawn):
# 
# if oncomplete is given or opt 'sync' is false, calls will be asynchronous.
#
# oncomplete is for both success and error, and is called as:
#
#     oncomplete({ ok, code, signal, out, stdout, stderr })
#
#     'out' is an alias for 'stdout', and signal is not guaranteed to be
#     correct.
#
# if the command fails completely or dies on a signal, we print an error,
# unless 'quiet' was given.
#
# on non-zero or signal we return with error or warn (the choice depends on
# 'die').
#
# keep 'out-split' / 'err-split' to false to not split the output (return a
# scalar).
#
# set them to 'true' to split on '\n', or to a string to split on that
# string.
#
# if the output consists of filenames, splitting on newline is not right
# since the filenames can contain newlines -- if the command was a variant
# of 'find', you might want to use the '-print0' option to 'find' and set
# out-split to '\0'; if it's a variant of 'ls', you probably want the '-Q'
# option, though it's less convenient to split on.
#
# ------ stream handling:
#
# if out-ignore or err-ignore is true: 
#
#   exec-sync, spawn-sync: those streams are not listened on.
#   exec-async: these flags don't do anything.
#   spawn-async: those streams are not listened on, though the caller is
#   free to.
#
# otherwise:
#
#   if out-print/err-print is true:
#
#       print the data to its stream.
#
#   if out-print/err-print is false (with the exception of stderr in the
#   synchronous exec case, see above):
#
#       read everything into a scalar/list (depending on
#       out-split/err-split) and pass it to oncomplete, if given.
#
#       in the synchronous cases, the return value is exactly the same as
#       the argument to oncomplete, so oncomplete is of course optional in
#       these cases.
#
#       # XX take out
#       if oncomplete is nothing then out-print/err-print are set to true.
#
#
# ------ stream handling, exec:
#
# if out-print/err-print is true, print the data on its stream, otherwise
# don't.
#
# stdout and stderr are harvested by the underlying exec in all cases, and
# are passed to the oncomplete function in all cases, too; it is not
# possible to prevent this.
#
# --- sync XX
#
# ------ tip, exec:
#
# invocation-opts.max-buffer (bytes): 
#   node will kill the child process if stdout or stderr exceeds this size.
#   default: not set, meaning use node's default (currently 200K).

export
    init
    sys-set
    sys-ok
    sys-exec
    sys-spawn
    sys
    shell-quote

child-process = require 'child_process'

{ last, values, join, } = require "prelude-ls"

main = require.main

{ } = main.exports

{ is-buffer, is-func, is-obj, is-arr, is-str, } = types = require './types'
{ aerror, iwarn, warn, error, } = squeak = require './squeak'
{ log, bullet, } = speak = require './speak'

our =
    # --- functions which we need from main but which main doesn't want to
    # export to the world.
    pkg:
        conf-set: void

    # --- default opts for sys- family calls.
    #
    # can be passed per call or set globally using sys-set.

    opts:
        # --- exec / spawn.
        #
        # only used for sys(), and it's not possible to change as a
        # parameter of sys(), either.
        #
        # usually you want to skip this and explicitly call sys-spawn() or
        # sys-exec().
        type: 'exec'

        # --- whether or not to exit. 
        die: false

        # --- log the command being executed to the console.
        verbose: true

        # --- suppress warnings for programs like find, which often have
        # non-zero exit status even if they ran mostly ok.
        quiet-on-exit: false

        # --- suppress all warnings.
        #
        # implies 'quiet-on-exit'.
        #
        # will be ignored if mixed with 'die'.
        quiet: false

        # --- whether to run the command synchronously or asynchronously.
        sync: false

        # --- see docs above.
        err-print: true
        out-print: false
        err-split: false
        out-split: false

        # --- (spawn only): don't listen on these streams
        out-ignore: false
        err-ignore: false

        # --- XXX
        slurp: true

        # --- XXX
        # hide ugly error messages from node (e.g. spawn ENOENT).
        ignore-node-syserr: false

        # --- whether to keep the trailing newline at the end of the streams.
        keep-trailing-newline: false

        # --- opts which are passed directly to the underlying .exec() /
        # .spawn() call.
        invocation-opts: {}

function init { pkg = {}, } = {}
    # --- clone args; noop if []
    our.pkg <<< pkg

# --- @dies.
function sys-set opts
    our.pkg.conf-set do
        source: opts
        target: our.opts
        name: 'sys'

# --- quote shell metacharacters in the most simple way possible: replace
# every single quote (sq) with: sq + backslash + sq + sq, then surround the
# whole thing with sqs.
#
# for aesthetic reasons, only do it for tokens which actually contain one of
# the characters.

function shell-quote arg
    if arg == // [ ! $ & * ? ( ) ` < > | \s ] //
        arg .= replace // ' //g, "'\\''"
        return "'#arg'"
    arg

# --- run a command and allow callbacks for 'ok' and optionally 'not ok'.
#
# usage:
#
# sys-ok <pass-through>, ok-callback                    (1)
# sys-ok <pass-through>, ok-callback, notok-callback    (2)
#
# all args but 'ok-callback' and 'notok-callback' are simply passed through
# to sys. 
#
# XXX
# all forms of sys are supported except the ones with an {opts} arg.
# 
# out and err are ignored and that can't be changed by the caller -- the
# rationale is to keep this function simple and have them use sys-exec or
# sys-spawn for more complex things.

function sys-ok ...args
    onxxx = args.pop()
    if not is-func onxxx
        return aerror 'bad call'
    # --- (2)
    if is-func last args
        onok = args.pop()
        onnotok = onxxx
    # --- (1)
    else
        onok = onxxx
        onnotok = void
    opts =
        oncomplete: ({ ok, code, signal }) ->
            if ok
                if onok then onok()
            else
                if onnotok then onnotok { code, signal }
        quiet: true
        out-ignore: true
        err-ignore: true

    args.push opts
    sys.apply this, args

function sys-exec ...args
    args.unshift 'exec'

    opts = sys-process-args.apply null args
    sysdo-exec opts

function sys-spawn ...args
    args.unshift 'spawn'

    opts = sys-process-args.apply null args
    sysdo-spawn opts

# --- routes through sys-exec() or sys-spawn() depending on our.opts.type.
function sys
    if our.opts.type is 'exec'
        sys-exec.apply null arguments
    else if our.opts.type is 'spawn'
        sys-spawn.apply null arguments
    else return aerror 'bad global opts.type'

# --- actually do the exec.
#
# @private

function sysdo-exec opts
    {
        cmd,
        oncomplete,
        args = [],

        die = our.opts.die,
        verbose = our.opts.verbose,
        quiet = our.opts.quiet,
        quiet-on-exit = our.opts.quiet-on-exit,
        sync = our.opts.sync,
        out-print = our.opts.out-print,
        err-print = our.opts.err-print,
        out-split = our.opts.out-split,
        err-split = our.opts.err-split,

        invocation-opts,

    } = opts

    # --- we assume the caller has quoted the arguments (or purposely not
    # done so), so we just concatenate.
    args.unshift cmd
    cmd = args.join ' '

    log sprintf "%s %s" (green bullet!), cmd if verbose

    if sync
        sysdo-exec-sync opts
    else
        sysdo-exec-async opts

function sysdo-exec-sync opts
    {
        cmd,
        oncomplete,
        args = [],

        die = our.opts.die,
        verbose = our.opts.verbose,
        quiet = our.opts.quiet,
        quiet-on-exit = our.opts.quiet-on-exit,
        sync = our.opts.sync,
        out-print = our.opts.out-print,
        err-print = our.opts.err-print,
        out-ignore = our.opts.out-ignore,
        err-ignore = our.opts.err-ignore,
        out-split = our.opts.out-split,
        err-split = our.opts.err-split,

        invocation-opts,

    } = opts

    # --- so that we control stderr.
    #
    # however the only way to inspect it is if we end up in the catch.
    #
    # for a zero-status process which wrote to stderr it's not trivial
    # to do and we don't currently support it.

    opts =
        stdio: array do
            0                               # stdin

            if out-ignore
                'ignore'
            else if out-print
                1
            else 'pipe'                     # stdout

            if err-ignore
                'ignore'
            else if err-print
                2
            else 'pipe'                     # stderr

    opts <<< invocation-opts

    stderr = '<suppressed or empty>'

    # --- exec-sync throws.
    try
        stdout = child-process.exec-sync cmd, opts
        stdout = output-to-scalar-or-list stdout, out-split
        ret =
            ok: true
            code: 0
            out: stdout
            stdout: stdout
            stderr: stderr
        oncomplete ret if oncomplete
    catch e
        # --- stderr has already been sent to the parent stream
        # (printed to stderr by default).
        #
        # node has already done a split for us (output) but we ignore it.
        { pid, output, stdout, stderr, status, signal, error } = e

        stdout = output-to-scalar-or-list stdout, out-split

        ret =
            ok: false
            code: status
            signal: signal
            out: stdout
            stdout: stdout
            stderr: stderr

        # --- do some common error handling, then call oncomplete if it's
        # there, then return the ret object.
        syserror do
            { cmd, code: status, signal, oncomplete, stdout, stderr, die, quiet, quiet-on-exit, }

    # | try exec
    ret

# | sysdo-exec-sync

function sysdo-exec-async opts

    {
        cmd,
        oncomplete,
        args = [],

        die = our.opts.die,
        verbose = our.opts.verbose,
        quiet = our.opts.quiet,
        quiet-on-exit = our.opts.quiet-on-exit,
        sync = our.opts.sync,
        out-print = our.opts.out-print,
        err-print = our.opts.err-print,
        out-split = our.opts.out-split,
        err-split = our.opts.err-split,

        invocation-opts,

    } = opts

    # --- stdio is not configurable in this case, so we ignore the -ignore
    # flags.

    on-child = (err, stdout, stderr) ->
        process.stderr.write stderr if err-print
        process.stdout.write stdout if out-print

        if err
            signal = void
            code = err.code
            # --- no shell
            if code is 'ENOENT'
                warn "Couldn't spawn a shell!" unless quiet
            else
                # --- it seems node might not actually set this in all cases.
                signal = err.signal

            # --- do some common error handling, then call oncomplete.
            return syserror do
                { cmd, code, signal, oncomplete, stdout, stderr, die, quiet, quiet-on-exit, }

        stdout = output-to-scalar-or-list stdout, out-split
        stderr = output-to-scalar-or-list stderr, err-split

        # --- ok.
        oncomplete { ok: true, out: stdout, stdout, stderr } if oncomplete?

    child = child-process.exec cmd, invocation-opts, on-child

    # --- just in case we get null for some reason.
    if not child?
        if not quiet
            complain = if die then error else warn
            complain 'Null return from child-process.exec()'
        oncomplete { ok: false, } if oncomplete?

# | sysdo-exec-async

/**
  * @private
  */

function sysdo-spawn {
    cmd,
    oncomplete,
    args = [],

    out-ignore = our.opts.out-ignore,
    err-ignore = our.opts.err-ignore,

    die = our.opts.die,
    verbose = our.opts.verbose,
    quiet = our.opts.quiet,
    quiet-on-exit = our.opts.quiet-on-exit,
    sync = our.opts.sync,
    out-print = our.opts.out-print,
    err-print = our.opts.err-print,
    out-split = our.opts.out-split,
    err-split = our.opts.err-split,
    slurp = our.opts.slurp,

    ignore-node-syserr = our.opts.ignore-node-syserr,
    keep-trailing-newline = our.opts.keep-trailing-newline,

    invocation-opts,
} # /sysdo args

    global.glob-fs = require 'glob-fs' unless global.glob-fs?

    syserror-fired = false

    quiet-on-exit = true if quiet

    stream-data = {}
    # max length param XX
    if out-split then stream-data.out = [] else stream-data.out = ''
    if err-split then stream-data.err = [] else stream-data.err = ''

    if sync
        iwarn "sys sync not implemented"
        return

    if oncomplete?
        return aerror() unless is-func that

    [cmd-bin, cmd-args] = do ->
        ...
        #parse = shell-parse cmd # split into shell words

        # note that we don't expand globs in the first token.
        parsed-bin = parse.shift()
        parsed-args = []
        parse |> each ->
            if is-obj it
                # ls 'a*' -> { op: 'glob', glob: 'a*' }
                if it.op is 'glob'
                    if it.pattern?
                        # can emit ugly error XX
                        glob-fs().readdirSync that |> each (-> parsed-args.push it)
                    else
                        return iwarn "Can't deal with parsed arg:" it
                else
                    if it.op?
                        parsed-args.push that
                    else
                        return iwarn "Can't deal with parsed arg:" it
            else
                parsed-args.push it
        [parsed-bin, parsed-args ++ args]

    if verbose then do ->
        print-cmd = join ' ', [cmd] ++ map (shell-quote), args
        ind = ' ' * Bullet.indent
        spa = ' ' * Bullet.spacing
        bul = green bullet()
        log "#ind#bul#spa#print-cmd"

    spawned = child-process.spawn cmd-bin, cmd-args, invocation-opts

    stream-config =
        out:
            ignore: out-ignore
            spawn-stream: spawned.stdout
            print: out-print
            list: out-split
            which: 'out'
            proc-stream: process.stdout
        err:
            ignore: err-ignore
            spawn-stream: spawned.stderr
            print: err-print
            list: err-split
            which: 'err'
            proc-stream: process.stderr

    handle-data-as-list = (strc, str) ->
        stream = stream-data[strc.which] # i.e. out or err
        split = str / '\n'
        # concatenate to last one if last buffer didn't
        # end in a newline.
        if stream.length > 0
            last = stream[stream.length - 1]
            first = split[0]
            first-cur-is-newline = first == ''
            last-prev-was-partial = last != ''
            # * a\n|\nb     -> ['a', '', 'b']
            if last-prev-was-partial
                # * rse|\ncat   -> ['rse', 'cat']
                if first-cur-is-newline
                    # eat it
                    split.shift()
                # * hor|se   -> ['horse']
                else
                    # eat it and add it to prev
                    stream[stream.length - 1] += split.shift()
            # Last read ended on a newline. Get rid of the '',
            # regardless of whether cur read begins with newline.
            # * a\n|b       -> ['a', 'b']
            # * a\n|\nb     -> ['a', '', 'b']
            else
                stream.pop()

        each (stream.push _), split

    # stream-config obj, string to handle
    handle-data = (strc, str) ->
        if strc.print
            strc.proc-stream.write str
        else
            if strc.list
                handle-data-as-list strc, str
            else
                # i.e. out += str or err += str (be careful
                # not to store by value)
                stream-data[strc.which] += str

    # it = stream-config obj
    values stream-config |> each ->
        it.spawn-stream.on 'error' (error) ->
            iwarn "Got error on stream std#which (#{error})"

        return if it.ignore

        # data is Buffer or string
        it.spawn-stream.on 'data' (data) ->
            if is-string data
                str = data
            else if Buffer.isBuffer data
                str = data.toString()
            else
                return iwarn "Doesn't seem to be a Buffer or a string"

            handle-data it, str

        # No more data.
        it.spawn-stream.on 'end' ->
            # Remove final newline.
            # This assumes nothing can happen (like an error)
            # between the last data event and the end event.
            if not keep-trailing-newline
                out = stream-data.out
                if out-split
                    out.pop() if last(out) == ''
                else if out.substring(out.length - 1) == '\n'
                        stream-data.out = out.substring 0, out.length - 1

    # In the case of error event, we won't have code or signal. 
    # E.g.: /non/existent/command abc
    # exit signal might also fire, in which case, do nothing.
    # 
    # In the case of exit, we will have code and signal, and err/out
    # streams have already been captured if applicable.
    #
    # In both cases, call syserror, but make sure not to call it twice.

    this-error = (args) ->
        syserror merge-objects args, {
            cmd, oncomplete,
            die, quiet, quiet-on-exit,
            out: stream-data.out,
            err: stream-data.err,
        }

    # Not fired if killed by a signal.
    # ondata events of stderr/stdout might not have fired yet (and
    # probably never will). 
    # e.g., /bad/ls abc
    spawned.on 'error' (errobj) ->
        # This is a very nodey message (e.g. spawn ENOENT)
        # If you're looking for something like 'bash: finderjsdf: command not found', forget it ... there is no shell spawned.
        # Maybe provide an opt to capture this error, but let the other one
        # flow to stderr.

        errmsg = errobj.message
        if not ignore-node-syserr
            handle-data stream-config.err, errmsg

        if not syserror-fired
            syserror-fired = true
            # calls oncomplete.
            return this-error {}

    # exit is when the process exits, but the streams might still be
    # open.
    # close is when the last stream has been closed, but it's distinct
    # from exit, because multiple processes could be sharing these
    # streams.
    # we assume that they are not.
    spawned.on 'close', (code, signal) ->
        if code is not 0
            if not syserror-fired
                syserror-fired = true
                # calls oncomplete.
                return this-error { code, signal }
        else
            oncomplete { ok: true, signal, code, stream-data.out, stream-data.err } if oncomplete?

    spawned

# end sysdo-spawn

/**
 * @private
 */
function syserror ({ cmd, code, signal, oncomplete, out, err, die, quiet, quiet-on-exit })
    str-sig = " «got signal #{ cyan signal }»" if signal
    str-cmd = " «#{ bright-red cmd }»"

    # code can be undefined, e.g. when exiting on signal, or when the command
    # failed to even start.

    str-exit = " «exit status #{ yellow code }»" if code?

    str = join '', compact array do
        "Couldn't execute cmd"
        str-cmd
        str-exit
        str-sig

    if die
        error str
        process.exit code
    else
        # command started but ended badly
        if code?
            warn str unless quiet-on-exit
        # command didn't start or ended on a signal
        else
            warn str unless quiet

    oncomplete { ok: false, code, signal, out, err } if oncomplete?

# | syserror

# --- process the args for the sys- functions.
#
# see docs at the beginning of this file for the different call patterns.
#
# @private.

function sys-process-args ...args-array
    type = args-array.shift()
    return aerror() if type not in <[ exec spawn ]>
    num-args = args-array.length

    if is-arr args-array.1 and type is 'exec'
        return aerror 'This usage is not supported for exec mode'

    # 1
    if num-args == 1 and is-obj args-array.0
        opts = args-array.0
    # 2
    else if num-args == 1 and is-str args-array.0
        [ cmd ] = args-array
        opts = { cmd }
    # 3
    else if num-args == 2 and is-obj args-array.1
        [ cmd, opts ] = args-array
        opts.cmd = cmd
    # 4
    else if num-args == 2 and is-arr args-array.1
        [ cmd, args ] = args-array
        opts = { cmd, args }
    # 5
    else if num-args == 3 and is-arr args-array.1 and is-obj args-array.2
        [ cmd, args, opts ] = args-array
        opts.cmd = cmd
        opts.args = args
    # 6
    else if num-args == 3 and is-arr args-array.1 and is-func args-array.2
        [ cmd, args, oncomplete ] = args-array
        opts = { cmd, args, oncomplete }
    # 7
    else if num-args == 4 and is-arr args-array.1
        [ cmd, args, opts, oncomplete ] = args-array
        return aerror() unless is-obj opts
        return aerror() unless is-func oncomplete
        opts.cmd = cmd
        opts.args = args
        opts.oncomplete = oncomplete
    # 8
    else if num-args == 2 and is-func args-array.1
        [ cmd, oncomplete ] = args-array
        opts = { cmd, oncomplete }
    # 9
    else if num-args == 3 and is-obj args-array.1
        [ cmd, opts, oncomplete ] = args-array
        return aerror() unless is-func oncomplete
        opts.cmd = cmd
        opts.oncomplete = oncomplete
    # 10
    else if num-args >= 3 and is-str args-array.1
        oncomplete = args-array.pop()
        return aerror() unless is-func oncomplete
        [ cmd, ...args ] = args-array
        opts = { cmd, args, oncomplete }
    # 11
    else if num-args >= 4 and is-str args-array.1
        oncomplete = args-array.pop()
        return aerror() unless is-func oncomplete
        opts = args-array.pop()
        return aerror() unless is-obj opts
        [ cmd, ...args ] = args-array
        opts.cmd = cmd
        opts.args = args
        opts.oncomplete = oncomplete
    # 12
    else if num-args >= 2 and is-str args-array.1
        [ cmd, ...args ] = args-array
        opts = { cmd, args }
    # 13
    else if num-args >= 3 and is-str args-array.1
        opts = args-array.pop()
        return aerror() unless is-obj opts
        [ cmd, ...cmd-args ] = args-array
        opts.cmd = cmd
        opts.args = cmd-args
    else
        return aerror()

    opts
        ..type = type

function output-to-scalar-or-list output, do-split
    # --- it is Buffer|String.
    output .= to-string() if is-buffer output

    if do-split then
        do-split = '\n' if do-split is true
        output .= split // #do-split //
    output


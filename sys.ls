# STDIN XX
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
# it is also probably what you want if the child process will be interactive
# on the console.
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
# if opt 'sync' is false, calls will be asynchronous.
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
#   exec sync, spawn sync: those streams are not listened on.
#   exec async: these flags don't do anything.
#   spawn async: those streams are not listened on, though the caller is
#   free to.
#
# otherwise:
#
#   if out-print/err-print is true:
#
#       print the data to its stream and do not send it to the callback.
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
# ------ stream handling, exec:
#
# if out-print/err-print is true, print the data on its stream and do not
# send it to the callback.
#
# stdout and stderr are harvested by the underlying exec in all cases, and
# are passed to the oncomplete function in all cases, too; it is not
# possible to prevent this.
#
# --- sync vs. async
#
# the async versions generally allow much more control.
#
# in the sync case of both exec and spawn they return an object on success:
#   { ok, code, out (alias to stdout), stdout, stderr, }
#
# first they pass this object to oncomplete, if it exists.
#
# on error they behave basically the same as the async cases, and will pass
# node's error object (as a string) where possible.
#
# ------ tip, exec:
#
# invocation-opts.max-buffer (bytes): 
#   node will kill the child process if stdout or stderr exceeds this size.
#   default: not set, meaning use node's default (currently 200K).

export
    init
    sys-get
    sys-set
    sys-ok
    sys-exec
    sys-spawn
    sys
    shell-quote

child-process = require 'child_process'

{ last, keys, join, map, compact, } = require "prelude-ls"
sprintf = require 'sprintf'

# main = if is-phantom() then global.main else require.main
# { } = main.exports

# --- is-buffer, is-string, is-func, is-obj, is-arr, is-str,
types = require './types'
# --- aerror, iwarn, warn, error,
squeak = require './squeak'
# --- log, bullet, bullet-get, green, bright-red, yellow, cyan,
speak = require './speak'
# --- array,
util = require './util'

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

        # --- hide ugly error messages like 'spawn ENOENT'.
        quiet-node-err: false

        # --- suppress all warnings.
        #
        # implies 'quiet-on-exit' and 'quiet-node-err'.
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

        # --- remove the trailing empty element when splitting on \n, for
        # example, and the string ended on \n (spawn only).
        #
        # leave it as-is when not splitting.
        #
        # (this is how perl does it by default).
        out-split-remove-trailing-element: true
        err-split-remove-trailing-element: true

        # --- (spawn only): don't listen on these streams
        out-ignore: false
        err-ignore: false

        # --- opts which are passed directly to the underlying .exec() /
        # .spawn() call.
        invocation-opts: {}

function init { pkg = {}, } = {}
    # --- clone args; noop if []
    our.pkg <<< pkg

# --- @dies.
#
# returns `this` for convenient chaining.

function sys-set opts
    our.pkg.conf-set do
        source: opts
        target: our.opts
        name: 'sys'
    @

function sys-get key
    return complain 'No such key' speak.bright-red key unless our.opts.has-own-property key
    our.opts[key]

# --- quote shell metacharacters in the most simple way possible: replace
# every single quote (sq) with: sq + backslash + sq + sq, then surround the
# whole thing with sqs.
#
# for aesthetic reasons, only do it for tokens which actually contain one of
# the characters.

function shell-quote arg
    if arg == // [ ' " ; ! $ & * ? ( ) ` < > | \s ] //
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
# out and err are ignored and that can't be changed by the caller -- the
# rationale is to keep this function simple and have them use sys-exec or
# sys-spawn for more complex things.

function sys-ok ...args
    onxxx = args.pop()
    if not types.is-func onxxx
        squeak.aerror 'bad call'
    # --- (2)
    if types.is-func last args
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
    else squeak.aerror 'bad global opts.type'

# --- actually do the exec.
#
# @private

function sysdo-exec opts
    {
        cmd
        args = []
        verbose = our.opts.verbose
        sync = our.opts.sync
    } = opts

    # --- we assume the caller has quoted the arguments (or purposely not
    # done so), so we just concatenate.
    opts.cmd = join ' ' [cmd] ++ args

    speak.log sprintf "%s %s" (speak.green speak.bullet!), opts.cmd if verbose

    if sync
        sysdo-exec-sync opts
    else
        sysdo-exec-async opts

function sysdo-exec-sync opts
    {
        cmd
        oncomplete
        args = []

        out-ignore = our.opts.out-ignore
        err-ignore = our.opts.err-ignore

        die = our.opts.die
        verbose = our.opts.verbose
        quiet = our.opts.quiet
        quiet-on-exit = our.opts.quiet-on-exit
        quiet-node-err = our.opts.quiet-node-err
        sync = our.opts.sync
        out-print = our.opts.out-print
        err-print = our.opts.err-print
        out-split = our.opts.out-split
        err-split = our.opts.err-split
        out-split-remove-trailing-element = our.opts.out-split-remove-trailing-element
        err-split-remove-trailing-element = our.opts.err-split-remove-trailing-element

        invocation-opts
    } = opts

    # --- so that we control stderr.
    #
    # however the only way to inspect it is if we end up in the catch.
    #
    # for a zero-status process which wrote to stderr it's not trivial
    # to do and we don't currently support it.

    call-opts =
        stdio: util.array do
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

    call-opts <<< invocation-opts

    stderr = '<suppressed or empty>'

    # --- exec-sync throws.
    try
        stdout = child-process.exec-sync cmd, call-opts
        stdout = output-to-scalar-or-list do
            stdout
            out-split
            out-split-remove-trailing-element
        ret =
            ok: true
            code: 0
            out: stdout
            stdout: stdout
            stderr: stderr
        oncomplete ret if oncomplete
    catch err
        # --- stderr has already been sent to the parent stream
        # (printed to stderr by default).
        #
        # output param is just an array containing stdout and stderr.
        { pid, output, stdout, stderr, status, signal, } = err
        the-error = err.error

        stdout = output-to-scalar-or-list do
            stdout
            out-split
            out-split-remove-trailing-element
        stderr = output-to-scalar-or-list do
            stderr
            err-split
            err-split-remove-trailing-element

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
            { cmd, code: status, signal, oncomplete, node-err: the-error, stdout, stderr, die, quiet, quiet-on-exit, quiet-node-err, }

    # | try exec
    ret

# | sysdo-exec-sync

function sysdo-exec-async opts

    {
        cmd
        oncomplete
        args = []

        die = our.opts.die
        verbose = our.opts.verbose
        quiet = our.opts.quiet
        quiet-on-exit = our.opts.quiet-on-exit
        quiet-node-err = our.opts.quiet-node-err
        sync = our.opts.sync
        out-print = our.opts.out-print
        err-print = our.opts.err-print
        out-split = our.opts.out-split
        err-split = our.opts.err-split
        out-split-remove-trailing-element = our.opts.out-split-remove-trailing-element
        err-split-remove-trailing-element = our.opts.err-split-remove-trailing-element

        invocation-opts

    } = opts

    # --- stdio is not configurable in this case, so we ignore the -ignore
    # flags.

    on-child = (err, stdout, stderr) ->
        console.warn stderr if err-print and stderr?
        process.stdout.write stdout if out-print

        if err
            signal = void
            code = err.code
            # --- no shell
            if code is 'ENOENT'
                squeak.warn "Couldn't spawn a shell!" unless quiet
            else
                # --- it seems node might not actually set this in all cases.
                signal = err.signal

            # --- do some common error handling, then call oncomplete.
            return syserror do
                { cmd, code, signal, oncomplete, node-err: err.to-string(), stdout, stderr, die, quiet, quiet-on-exit, quiet-node-err, }

        stdout = output-to-scalar-or-list do
            stdout
            out-split
            out-split-remove-trailing-element
        stderr = output-to-scalar-or-list do
            stderr
            err-split
            err-split-remove-trailing-element

        # --- ok.
        oncomplete { ok: true, out: stdout, stdout, stderr, } if oncomplete?

    child = child-process.exec cmd, invocation-opts, on-child

# | sysdo-exec-async

# --- actually do the spawn.
#
# @private

function sysdo-spawn opts
    {
        cmd
        oncomplete
        args = []

        out-ignore = our.opts.out-ignore
        err-ignore = our.opts.err-ignore

        die = our.opts.die
        verbose = our.opts.verbose
        quiet = our.opts.quiet
        quiet-on-exit = our.opts.quiet-on-exit
        sync = our.opts.sync
        out-print = our.opts.out-print
        err-print = our.opts.err-print
        out-split = our.opts.out-split
        err-split = our.opts.err-split

        quiet-node-err = our.opts.quiet-node-err

        out-split-remove-trailing-element = our.opts.out-split-remove-trailing-element
        err-split-remove-trailing-element = our.opts.err-split-remove-trailing-element

        invocation-opts
    } = opts

    if quiet
        quiet-on-exit = opts.quiet-on-exit = true
        quiet-node-err = opts.quiet-node-err = true

    if out-split == true then out-split = opts.out-split = '\n'
    if err-split == true then err-split = opts.err-split = '\n'

    if oncomplete?
        squeak.aerror() unless types.is-func that

    if verbose then do ->
        print-cmd = join ' ', [cmd] ++ map (shell-quote), args
        ind = ' ' * speak.bullet-get 'indent'
        spa = ' ' * speak.bullet-get 'spacing'
        bul = speak.green speak.bullet()
        speak.log join '' util.array ind, bul, spa, print-cmd

    if sync
        sysdo-spawn-sync opts
    else
        sysdo-spawn-async opts

function sysdo-spawn-sync opts
    {
        cmd
        oncomplete
        args = []

        out-ignore = our.opts.out-ignore
        err-ignore = our.opts.err-ignore

        die = our.opts.die
        verbose = our.opts.verbose
        quiet = our.opts.quiet
        quiet-on-exit = our.opts.quiet-on-exit
        quiet-node-err = our.opts.quiet-node-err
        sync = our.opts.sync
        out-print = our.opts.out-print
        err-print = our.opts.err-print
        out-split = our.opts.out-split
        err-split = our.opts.err-split

        out-split-remove-trailing-element = our.opts.out-split-remove-trailing-element
        err-split-remove-trailing-element = our.opts.err-split-remove-trailing-element

        invocation-opts
    } = opts

    call-opts =
        stdio: util.array do
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

    call-opts <<< invocation-opts
    child-process-ret = child-process.spawn-sync cmd, args, call-opts

    # --- output param is just an array containing stdout and stderr.
    { pid, output, stdout, stderr, status, signal, } = child-process-ret
    the-error = child-process-ret.error

    ret =
        stdout: void
        stderr: void
        code: status
        signal: signal
        out: void

    stdout = ret.stdout = ret.out = output-to-scalar-or-list do
        stdout
        out-split
        out-split-remove-trailing-element
    stderr = ret.stderr = output-to-scalar-or-list do
        stderr
        err-split
        err-split-remove-trailing-element

    ok = void

    # --- e.g. /nonexistent/cmd
    if the-error
        # --- stderr will actually probably never be defined.
        console.warn stderr if stderr? and not quiet

        # --- do some common error handling, then call oncomplete if it's
        # there, then return the ret object.
        syserror {
            cmd, oncomplete,
            die, quiet, quiet-on-exit, quiet-node-err,
            signal,
            code: status,
            node-err: the-error.to-string(),
            stdout, stderr,
        }
        ok = false

    # --- e.g. find /nonexistent/file
    else if status
        # --- if we're going to die, it will be printed during syserror().
        console.warn stderr if stderr? and not quiet and not die

        # --- do some common error handling, then call oncomplete if it's
        # there, then return the ret object.
        syserror {
            cmd, oncomplete,
            die, quiet, quiet-on-exit, quiet-node-err,
            signal,
            code: status,
            stdout, stderr,
        }
        ok = false

    else
        ok = true

    ret.ok = ok

    # --- call oncomplete if it's there, then return the ret object.
    oncomplete ret if oncomplete?
    ret

function sysdo-spawn-async opts
    {
        cmd
        oncomplete
        args = []

        out-ignore = our.opts.out-ignore
        err-ignore = our.opts.err-ignore

        die = our.opts.die
        verbose = our.opts.verbose
        quiet = our.opts.quiet
        quiet-on-exit = our.opts.quiet-on-exit
        sync = our.opts.sync
        out-print = our.opts.out-print
        err-print = our.opts.err-print
        out-split = our.opts.out-split
        err-split = our.opts.err-split

        quiet-node-err = our.opts.quiet-node-err

        out-split-remove-trailing-element = our.opts.out-split-remove-trailing-element
        err-split-remove-trailing-element = our.opts.err-split-remove-trailing-element

        invocation-opts
    } = opts

    syserror-fired = false

    stream-data =
        # --- here we store the data which appears on the streams we are
        # listening on in either an array or a scalar.
        out: if out-split then [] else ''
        err: if err-split then [] else ''

    spawned = child-process.spawn cmd, args, invocation-opts

    stream-configs =
        out:
            ignore: out-ignore
            spawn-stream: spawned.stdout
            print: out-print
            list: out-split
            which: 'out'
            proc-stream: process.stdout
            split-string: out-split
            split-remove-trailing-element: out-split-remove-trailing-element
        err:
            ignore: err-ignore
            spawn-stream: spawned.stderr
            print: err-print
            list: err-split
            which: 'err'
            proc-stream: process.stderr
            split-string: err-split
            split-remove-trailing-element: err-split-remove-trailing-element

    # --- which = out/err
    (keys stream-configs).for-each (which) ->
        stream-config = stream-configs[which]
        stream-config.spawn-stream.on 'error' (error) ->
            squeak.warn "Got error on stream std#which" error

        return if stream-config.ignore

        # --- data is Buffer or string.
        stream-config.spawn-stream.on 'data' (data) ->
            if types.is-string data
                str = data
            else if types.is-buffer data
                str = data.toString()
            else return squeak.iwarn "Doesn't seem to be a Buffer or a string"

            handle-stream-data stream-data, stream-config, str

        # --- no more data.
        stream-config.spawn-stream.on 'end' ->
            { split-remove-trailing-element, split-string, } = stream-config

            # --- remove final element unless
            # xxx-split-remove-trailing-element is false.
            #
            # note that this assumes nothing can happen (like an error)
            # between the last data event and the end event.

            if split-remove-trailing-element and split-string
                data = stream-data[which]
                data.pop() if '' == last data

    # --- error processing.
    #
    # in the case of an error event, we won't have code or signal. 
    #
    # e.g.: /nonexistent/cmd
    #
    # the 'exit' signal might also fire, in which case, do nothing.
    # 
    # in the case of exit, we will have code and signal, and err/out
    # streams have already been captured if applicable.
    #
    # in both cases, call syserror, but make sure not to call it twice.

    # --- this will be called by either the 'close' event or 'error' event
    # and route the params through to syserror().
    do-syserror = (args) ->
        syserror {
            cmd, oncomplete,
            die, quiet, quiet-on-exit, quiet-node-err,
            stdout: stream-data.out,
            stderr: stream-data.err,
        } <<< args

    # --- error, e.g.: /nonexistent/cmd
    #
    # not fired if killed by a signal.
    #
    # ondata events of stderr/stdout might not have fired yet (and
    # probably never will). 

    spawned.on 'error' (errobj) ->
        # --- note, if you're looking for something like 'bash: finderjsdf: command
        # not found', forget it ... there is no shell spawned.

        if not syserror-fired
            syserror-fired := true

            # --- calls oncomplete.
            return do-syserror node-err: errobj.to-string()

    # | -> on error

    # --- the 'exit' event is for when the process exits, but the streams
    # might still be open.
    #
    # 'close' is when the last stream has been closed, but it's distinct
    # from exit, because multiple processes could be sharing these
    # streams.
    #
    # we assume that they are not.
    #
    # phantomjs only has 'exit'.

    done-event = if is-phantom() then 'exit' else 'close'
    spawned.on done-event, (code, signal) ->

        # --- non-zero exit.
        if code is not 0
            if not syserror-fired
                syserror-fired := true
                # --- calls oncomplete.
                do-syserror { code, signal, }
            return

        # --- all good.
        if oncomplete then oncomplete do
            ok: true
            signal: signal
            code: code
            out: stream-data.out
            stdout: stream-data.out
            stderr: stream-data.err
    # | -> on close

    spawned

# | sysdo-spawn

# --- @private
function syserror ({ cmd, code, signal, oncomplete, node-err, stdout, stderr, die, quiet, quiet-on-exit, quiet-node-err, })
    str-sig = " «got signal #{ speak.cyan signal }»" if signal
    str-cmd = " #{ speak.bright-red cmd }"

    # --- code can be undefined, e.g. when exiting on signal, or when the
    # command failed to even start.

    str-exit = " «exit status #{ speak.yellow code }»" if code?

    str-node-err = " «#{node-err}»" if node-err and not quiet-node-err

    str = join '', compact util.array do
        "Couldn't execute cmd"
        str-cmd
        str-exit
        str-sig
        str-node-err

    if die
        # --- in exec sync case, it has already been printed by node, and
        # stderr will be null.
        #
        # but there might be async cases where this printing is undesirable. XXX
        console.warn stderr if stderr?

        squeak.error str
        process.exit code
    else
        # --- command started but ended badly.
        if code?
            squeak.warn str unless quiet-on-exit
        # --- command didn't start or ended on a signal.
        else
            squeak.warn str unless quiet

    oncomplete { ok: false, code, signal, out: stdout, stdout, stderr } if oncomplete?

# | syserror

# --- process the args for the sys- functions.
#
# see docs at the beginning of this file for the different call patterns.
#
# @private.

function sys-process-args ...args-array
    type = args-array.shift()
    squeak.aerror() if type not in <[ exec spawn ]>
    num-args = args-array.length

    if types.is-arr args-array.1 and type is 'exec'
        squeak.aerror 'This usage is not supported for exec mode'

    # 1
    if num-args == 1 and types.is-obj args-array.0
        opts = args-array.0
    # 2
    else if num-args == 1 and types.is-str args-array.0
        [ cmd ] = args-array
        opts = { cmd }
    # 3
    else if num-args == 2 and types.is-obj args-array.1
        [ cmd, opts ] = args-array
        opts.cmd = cmd
    # 4
    else if num-args == 2 and types.is-arr args-array.1
        [ cmd, args ] = args-array
        opts = { cmd, args }
    # 5
    else if num-args == 3 and types.is-arr args-array.1 and types.is-obj args-array.2
        [ cmd, args, opts ] = args-array
        opts.cmd = cmd
        opts.args = args
    # 6
    else if num-args == 3 and types.is-arr args-array.1 and types.is-func args-array.2
        [ cmd, args, oncomplete ] = args-array
        opts = { cmd, args, oncomplete }
    # 7
    else if num-args == 4 and types.is-arr args-array.1
        [ cmd, args, opts, oncomplete ] = args-array
        squeak.aerror() unless types.is-obj opts
        squeak.aerror() unless types.is-func oncomplete
        opts.cmd = cmd
        opts.args = args
        opts.oncomplete = oncomplete
    # 8
    else if num-args == 2 and types.is-func args-array.1
        [ cmd, oncomplete ] = args-array
        opts = { cmd, oncomplete }
    # --- 9.
    else if num-args == 3 and types.is-obj args-array.1
        [ cmd, opts, oncomplete ] = args-array
        squeak.aerror() unless types.is-func oncomplete
        opts.cmd = cmd
        opts.oncomplete = oncomplete
    # --- 10, 11, 12, 13.
    else if num-args >= 2 and types.is-str args-array.1
        last-arg = args-array.pop()
        # --- 10, 11.
        if types.is-func last-arg
            oncomplete = last-arg
            last-arg2 = args-array.pop()

            # --- 11.
            if types.is-obj last-arg2
                opts = last-arg2
            # --- 10.
            else
                args-array.push last-arg2
                opts = {}
            [ cmd, ...args ] = args-array
            opts <<< { cmd, args, oncomplete, }

        # --- 12, 13.
        else
            args-array.push last-arg
            last-arg2 = args-array.pop()

            # --- 13.
            if types.is-obj last-arg2
                opts = last-arg2
            # --- 12.
            else
                args-array.push last-arg2
                opts = {}
            [ cmd, ...args ] = args-array
            opts <<< { cmd, args, }
    else
        squeak.aerror()

    if opts.args then opts.args = compact opts.args.map ->
        if not it?
            squeak.warn "Skipping null/undefined arg (check args array)"
        it

    opts
        ..type = type

function output-to-scalar-or-list output, do-split, split-remove-trailing-element
    # --- it is Buffer|String.
    output .= to-string() if types.is-buffer output

    if do-split then
        do-split = '\n' if do-split is true
        output .= split // #do-split //
        if split-remove-trailing-element
            output.pop() if '' == last output
    output

function handle-stream-data stream-data, stream-config, string
    { print, proc-stream, list, } = stream-config

    # --- print to stderr/stdout and return.
    if print
        proc-stream.write string
        return

    # --- store for sending to oncomplete().
    handle = if list then handle-stream-data-as-list else handle-stream-data-as-scalar
    handle stream-data, stream-config, string

# --- append the incoming strings to the stream-data.out / stream-data.err
# scalar.
function handle-stream-data-as-scalar stream-data, stream-config, string
    stream-data[stream-config.which] += string

# --- split the incoming strings and push them to the stream-data.out /
# stream-data.err array.
#
# (we're using \n as the example split-string in the comments).
#
# the tricky thing is that if the last string didn't end in \n -- meaning
# that the last stored item is not the empty string -- then you have to
# concatenate to the last one.

function handle-stream-data-as-list stream-data, stream-config, string
    { which, split-string } = stream-config

    # --- i.e., out or err.
    stream = stream-data[which]

    split = string.split split-string

    # --- check the last one.
    if stream.length > 0
        last = stream[stream.length - 1]
        first = split.0
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
                # --- eat it and add it to prev
                stream[stream.length - 1] += split.shift()

        # --- last read did end on \n. 
        #
        # get rid of the '', regardless of whether cur read begins with
        # newline.
        #
        # * a\n|b       -> ['a', 'b']
        # * a\n|\nb     -> ['a', '', 'b']
        else
            stream.pop()

    split.for-each -> stream.push it

function is-phantom
    true if window? and window.call-phantom and window._phantom

/*
 * Useful stuff for writing in LiveScript.
 *
 * Source: misterfish@github/fish-lib-ls
 *
 * License: GPL 2.0
 *
 * Author: Allen Haim <allen@netherrealm.net>
 */

child-process = require 'child_process'

{ curry, join, last, map, each, compact, keys, values } = require "prelude-ls"
shell-quote-module = require 'shell-quote'
sprintf = require 'sprintf'

# required when needed.
# util = void
# glob-fs = void

BULLETS = <[ ꣐ ⩕ ٭ ᳅ 𝄢 𝄓 𝄋 𝁐 ᨁ  ]>

Identifier =
    main: {}
    color: {}
    util: {}

Sys =
    type: 'exec'
    die: false
    verbose: true
    quiet: false
    quiet-on-exit: false
    sync: false
    err-print: true
    out-print: false
    err-list: false
    out-list: false
    slurp: true
    ignore-node-syserr: false
    keep-trailing-newline: false

Err =
    # Fatal is used for the complain family of functions to decide whether
    # to route through (i)warn or (i)complain.
    # It is not used to make (i)error non-fatal.
    # This module never calls (i)error, leaving it up to the caller to die
    # The only exception is the sys family of functions, which take a 'die'
    # flag (false by default).
    # At some point the iwarn calls for things like invalid function calls
    # might get upgraded to icomplain calls, so they can optionally die.
    # Err.fatal might also get set to false by default at some point, so be
    # sure to set it if you really depend on it.
    fatal: true
    stack-trace: false

green = (curry color) 'green'
bright-green = (curry color) 'bright-green'
blue = (curry color) 'blue'
bright-blue = (curry color) 'blue'
red = (curry color) 'red'
bright-red = (curry color) 'bright-red'
yellow = (curry color) 'yellow'
bright-yellow = (curry color) 'bright-yellow'
cyan = (curry color) 'cyan'
bright-cyan = (curry color) 'bright-cyan'
magenta = (curry color) 'magenta'
bright-magenta = (curry color) 'bright-magenta'

function shell-parse
    shell-quote-module.parse.apply this, arguments

function shell-quote arg
    if arg == // [ ! $ & * ? ( ) ` < > | \s ] //
        # replace every single quote (sq) with: sq + backslash + sq + sq, then
        # surround the whole thing with sqs.
        arg .= replace /'/g, "'\\''"
        "'#arg'"
    else
        arg

function log ...msg
    console.log.apply console, msg

/**
 *
 * Usage: 
 *
 * iwarn 'string' [, 'string', ...,] {opts}
 *
 * opts is optional.
 *
 */

function iwarn ...msg
    opts = last msg
    if typeof! opts is 'Object' then msg.pop() else opts = {}

    pcomplain merge-objects opts, {
        msg,
        internal: true,
        error: false,
    }

function ierror ...msg
    opts = last msg
    if typeof! opts is 'Object' then msg.pop() else opts = {}

    pcomplain merge-objects opts, {
        msg,
        internal: true,
        error: true,
    }

function warn ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}

    pcomplain merge-objects opts, {
        msg,
        internal: false,
        error: false,
    }

function error ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}

    pcomplain merge-objects opts, {
        msg,
        internal: false,
        error: true,
    }

# Not efficient. Input should be smallish.
function shuffle input
    l = input.length
    out = []
    locations = { [i, 42] for i from 0 to l - 1 }
    locations-num-keys = l
    times l, ->
        key = (keys locations)[
            m = Math.floor Math.random! * locations-num-keys
        ]
        delete locations[key]
        val = input[key]
        out.push val
        locations-num-keys--
    out

function merge-objects
    { [k, v] for obj in arguments for k, v of obj when typeof! obj is 'Object' }


function bullet
    BULLETS[ Math.floor Math.random! * BULLETS.length ]

function ord
    return icomplain1 'Bad call' unless is-str it
    warn "Ignoring extra chars (got '#{ green it.substr 0, 1 }#{ bright-red it.substr 1}' " if it.length > 1
    it.char-code-at 0

function chr
    return icomplain1 'Bad call' unless is-num it
    String.from-char-code it

function info
    prnt = [].slice.call arguments
    prnt.unshift blue bullet!
    console.log.apply console, prnt
    void

function err-set opts
    conf-set Err, 'err', opts

function sys-set opts
    conf-set Sys, 'sys', opts

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

function sys-ok
    args-array = [].slice.call arguments
    onxxx = args-array.pop()
    if not is-func onxxx
        return iwarn 'bad call'
    if is-func last args-array
        onok = args-array.pop()
        onnotok = onxxx
    else
        onok = onxxx
        onnotok = void
    opts =
        oncomplete: ({ ok, code, signal }) ->
            if ok
                if onok then onok()
            else
                if onnotok then onnotok {code, signal}
        quiet: true
        out-ignore: true
        err-ignore: true

    args-array.push opts
    sys.apply this, args-array

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
function sys
    if Sys.type is 'exec'
        sys-exec.apply null arguments
    else if Sys.type is 'spawn'
        sys-spawn.apply null arguments
    else return warn 'bad Sys.type'

function sys-exec
    args-array = [].slice.call arguments
        ..unshift 'exec'

    opts = sys-process-args.apply null args-array
    sysdo-exec opts

function sys-spawn
    args-array = [].slice.call arguments
        ..unshift 'spawn'

    opts = sys-process-args.apply null args-array
    sysdo-spawn opts

/**
 * @private
 */
function sys-process-args
    arg = [].slice.call arguments
    type = arg.shift()
    return iwarn 'bad call' if type not in <[ exec spawn ]>
    num-args = arg.length

    if is-arr arg.1 and type is 'exec'
        return iwarn 'This usage is not supported for exec mode'

    # 1
    if num-args == 1 and is-obj arg.0
        opts = arg.0
    # 2
    else if num-args == 1 and is-str arg.0
        [ cmd ] = arg
        opts = { cmd }
    # 3
    else if num-args == 2 and is-obj arg.1
        [ cmd, opts ] = arg
        opts.cmd = cmd
    # 4
    else if num-args == 2 and is-arr arg.1
        [ cmd, args ] = arg
        opts = { cmd, args }
    # 5
    else if num-args == 3 and is-arr arg.1 and is-obj arg.2
        [ cmd, args, opts ] = arg
        opts.cmd = cmd
        opts.args = args
    # 6
    else if num-args == 3 and is-arr arg.1 and is-func arg.2
        [ cmd, args, oncomplete ] = arg
        opts = { cmd, args, oncomplete }
    # 7
    else if num-args == 4 and is-arr arg.1
        [ cmd, args, opts, oncomplete ] = arg
        opts.cmd = cmd
        opts.args = args
        opts.oncomplete = oncomplete
    # 8
    else if num-args == 2 and is-func arg.1
        [ cmd, oncomplete ] = arg
        opts = { cmd, oncomplete }
    # 9
    else if num-args == 3 and is-obj arg.1
        [ cmd, opts, oncomplete ] = arg
        opts.cmd = cmd
        opts.oncomplete = oncomplete
    # 10
    else if num-args >= 3 and is-str arg.1
        args-array = [].slice.call arg
        oncomplete = args-array.pop()
        [ cmd, ...args ] = args-array
        opts = { cmd, args, oncomplete }
    # 11
    else if num-args >= 4 and is-str arg.1
        args-array = [].slice.call arg
        oncomplete = args-array.pop()
        opts = args-array.pop()
        [ cmd, ...args ] = args-array
        opts.cmd = cmd
        opts.args = args
        opts.oncomplete = oncomplete
    # 12
    else if num-args >= 2 and is-str arg.1
        args-array = [].slice.call arg
        [ cmd, ...args ] = args-array
        opts = { cmd, args }
    # 13
    else if num-args >= 3
        args-array = [].slice.call arg
        opts = args-array.pop()
        [ cmd, ...cmd-args ] = args-array
        opts.cmd = cmd
        opts.args = cmd-args
    else
        return iwarn 'bad call'

    opts.type = type
    opts

function is-str
    is-string it

function is-string
    typeof! it is 'String'

function is-bool
    is-boolean it

function is-boolean
    typeof! it is 'Boolean'

function is-obj
    is-object it

function is-object
    typeof! it is 'Object'

function is-func
    is-function it

function is-function
    typeof! it is 'Function'

function is-arr
    is-array it

function is-array
    typeof! it is 'Array'

function is-num
    is-number it

/*
 * Checks the type of the argument, in the same way as is-str, is-arr, etc.
 * Use is-a-number to test strings such as '3.1'.
 *
 * If it's a Number, returns an object with property 'nan' (alias 'is-nan')
 * based on whether it's NaN (not a number).
 * 
 * Returns false otherwise.
 */
function is-number
    return false unless typeof! it is 'Number'
    nan = isNaN it

    nan: nan
    is-nan: nan

function is-int
    is-integer it

function is-integer
    is-num it and it == Math.floor it

function is-positive-int
    is-int it and it > 0

function is-non-negative-int
    is-int it and it >= 0

/*
 * Also returns true if the argument is a string representing a number.
 */
function is-a-num
    is-a-number it

function is-a-number
    if is-str it
        it = +it
        return false if isNaN it
    is-num it

/* 
 * a and b are integers.
 * step by +1 or -1 to get from a to b, inclusive.
 */
function range a, b, func
    return icomplain1 'Bad call' unless is-int a and is-int b

    for i from a to b
        func i

function times n, func
    if not is-positive-int n
        return icomplain1 'Bad call'
    for i from 1 to n
        func i-1 # 0-based to make it like ruby

function import-all target
    for k, v of module.exports
        target[k] = v

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

function import-kind target, ...kinds
    doit = (kind) ->
        identifiers = Identifier[kind]
        if not identifiers? then return iwarn do
            'bad import:' bright-red(kind)
            stack-rewind: 1
        for k, v of identifiers
            target[k] = v

    for elem in kinds
        if is-array elem
            for kind in elem
                doit kind
        else
            doit elem

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

function getopt args
    nopt = require 'nopt'
    path ?= require 'path'

    known-opts = {}

    # You need short-hands so that clustering works on single letter
    # options.
    short-hands = {}

    # Another example:  (not using)
    # bloo:   <[ big medium small ]>

    types =
        b:  Boolean
        s:  String
        r:  Number #'real'
        p:  path
        ms:  Array

    # First put all single letter options last, so that -n maps to the 'n'
    # option and not 'name'.
    arranged-keys = do ->
        list = []
        for opt, v of args
            if opt.length == 1
                list.push opt
            else
                list.unshift opt
        list

    for opt in arranged-keys
        v = args[opt]
        if is-array v
            [ type, opts ] = v
        else
            type = v
        do ->
            long = opt
            long-type = types[type] ? complain 'Invalid type:' bright-red type
            known-opts[long] = long-type
            # Map single letters to the corresponding long one.
            short-hands[long.substring 0 1] = ['--' + long]

    parsed = nopt known-opts, short-hands, process.argv, 2

    for k, v of parsed
        if k == 'argv' then continue
        if not known-opts[k] then
            complain "Unknown option:" bright-red k

    parsed


# - - - - - private

function conf-set obj, name = 'unknown', opts
    for k, v of opts
        if not obj[k]?
            iwarn "Invalid opt for #{ yellow name }: #{ bright-red k }"
            continue
        obj[k] = v

# Must take exactly 2 args (for fancy currying to work right).
function color col, s
    if typeof! s is 'Array'
        [str, opt] = s
    else
        str = s
        opt = {}
    join '' [
        _color col, opt
        str
        _color 'reset', opt
    ]

function _color c, { warn-on-error } = {}
    # set warn-on-error to false to avoid infinite loop if calling from
    # within iwarn.
    warn-on-error ?= true
    col = {
        red:            	31,
        'bright-red':   	91,
        green:          	32,
        'bright-green': 	92,
        yellow:         	33,
        'bright-yellow':	93,
        blue:           	34,
        'bright-blue':  	94,
        magenta:        	35,
        'bright-magenta': 	95,
        cyan:           	36,
        'bright-cyan':  	96,
        reset:          	0,
    }[c]

    if not col?
        if warn-on-error then iwarn "Invalid color:" c
        return ''

    '[' + col + 'm'

/**
  * @private
  */

function sysdo-exec {
    cmd,
    oncomplete,
    args = [],

    die = Sys.die,
    verbose = Sys.verbose,
    quiet = Sys.quiet,
    quiet-on-exit = Sys.quiet-on-exit,
    sync = Sys.sync,
    out-print = Sys.out-print,
    err-print = Sys.err-print,
    out-list = Sys.out-list,
    err-list = Sys.err-list,

    invocation-opts,

} # /sysdo args

    ok = true

    args.unshift cmd
    cmd = args.join ' '
    if verbose
        log "#{ green bullet! } #cmd"

    child = child-process.exec cmd, invocation-opts, (the-error, out, err) ->
        process.stderr.write err if err-print
        process.stdout.write out if out-print

        if the-error
            signal = void
            code = the-error.code
            if code is 'ENOENT' # no shell
                warn 'Couldn\'t spawn a shell!'
            else
                signal = the-error.signal # not sure if node is actually setting this in all cases.
            # calls oncomplete
            return syserror { cmd, code, signal, oncomplete, out, err, die, quiet, quiet-on-exit }

        if err-list then
            err .= split // \n //
        if out-list then
            out .= split // \n //

        oncomplete { ok: true, out, err } if oncomplete?

    if not child?
        complain = if die then error else warn
        complain 'Null return from child-process.exec'
        oncomplete { ok: false, out, err } if oncomplete?

# end sysdo-exec

/**
  * @private
  */

function sysdo-spawn {
    cmd,
    oncomplete,
    args = [],

    out-ignore = false,
    err-ignore = false,

    die = Sys.die,
    verbose = Sys.verbose,
    quiet = Sys.quiet,
    quiet-on-exit = Sys.quiet-on-exit,
    sync = Sys.sync,
    out-print = Sys.out-print,
    err-print = Sys.err-print,
    out-list = Sys.out-list,
    err-list = Sys.err-list,
    slurp = Sys.slurp,

    ignore-node-syserr = Sys.ignore-node-syserr,
    keep-trailing-newline = Sys.keep-trailing-newline,

    invocation-opts,
} # /sysdo args

    global.glob-fs = require 'glob-fs' unless global.glob-fs?

    syserror-fired = false

    quiet-on-exit = true if quiet

    stream-data = {}
    # max length param XX
    if out-list then stream-data.out = [] else stream-data.out = ''
    if err-list then stream-data.err = [] else stream-data.err = ''

    if sync
        iwarn "sys sync not implemented"
        return

    if oncomplete?
        return iwarn 'bad call' unless is-func that
    else
        out-print = true
        err-print = true

    [cmd-bin, cmd-args] = do ->
        parse = shell-parse cmd # split into shell words
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
        log "#{ green bullet! } #print-cmd"

    spawned = child-process.spawn cmd-bin, cmd-args, invocation-opts

    stream-config =
        out:
            ignore: out-ignore
            spawn-stream: spawned.stdout
            print: out-print
            list: out-list
            which: 'out'
            proc-stream: process.stdout
        err:
            ignore: err-ignore
            spawn-stream: spawned.stderr
            print: err-print
            list: err-list
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
                if out-list
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

    str = join '', compact [
        "Couldn't execute cmd"
        str-cmd
        str-exit
        str-sig
    ]
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

# end syserror

/**
 * @private
 */

/**
 * Checks Err.fatal and routes through either ierror or iwarn with stack-rewind bumped by one.
 */
function icomplain ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}
    func = Err.fatal and ierror or iwarn
    opts.stack-rewind ?= 0
    opts.stack-rewind++
    func msg, opts

/**
 * Checks Err.fatal and routes through either error or warn with stack-rewind bumped by one.
 */
function complain ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}
    func = Err.fatal and error or warn
    opts.stack-rewind ?= 0
    opts.stack-rewind++
    func msg, opts

/*
 * Like calling icomplain msg, stack-rewind: 1
 * However since it's another call on the stack, it's 2 in the call.
 * 
 */
function icomplain1 ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}
    opts.stack-rewind = 2
    icomplain msg, opts

/*
 * Like calling complain msg, stack-rewind: 1
 * However since it's another call on the stack, it's 2 in the call.
 * 
 */
function complain1 ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}
    opts.stack-rewind = 2
    complain msg, opts

/**
 * @private
 *
 * All error and warn functions route through this underlying one.
 */
function pcomplain { msg, internal, error, stack-trace, code, stack-rewind = 0 }
    global.util := require 'util' unless global.util?

    stack-trace ?= Err.stack-trace
    stack = (new Error).stack
    # Some environments (e.g. phantomjs) don't give us a stack.
    stack = '' unless stack?
    #  Take off 'Error'
    stack := stack.replace // ^ \s* \S+ \s+ // '   '

    [funcname, filename, line-num] = do ->
        # This will all break one day:

        #  Kill two frames to get back to the useful call, and then n more
        #  (n = stack-rewind)
        regex = ".*\n" * (2 + stack-rewind) # careful: extended regex not allowed in interpolation.
        my-stack = stack.replace // ^ #regex // ''

        if m = my-stack.match // ^ \s+ at \s+ (\S+) \s* \( (.+?) : (\d+) : \d+ \) //
            [m[1], m[2], m[3]] # function, file, line
        else if m = my-stack.match // ^ \s+ at \s+ (.+?) : (\d+) : \d+ //
            [void, m[1], m[2]]
        else
            ["«unknown-file»", "«unknown-line»"]

    msg = map do
        -> if is-obj it then util.inspect it else it
        msg

    if internal
        if error
            msg.unshift "Internal error:"
        else
            msg.unshift "Internal warning:"
    else
        if error
            msg.unshift "Error:"
        else
            msg.unshift "Warning:"

    if error
        bullet-color = red
    else
        bullet-color = bright-red

    msg.unshift bullet-color [bullet!, {-warn-on-error}]

    # (file:line)
    if internal
        msg.push do
            "(" +
            "#{yellow [filename, {-warn-on-error}]}" +
            (do ->
                if funcname
                    ":" +
                    "#{green [funcname, {-warn-on-error}]}"
                else '') +
            ":" +
            "#{bright-red [line-num, {-warn-on-error}]}" +
            ")"

    if stack-trace
        ## Take out 'Error:'
        #m = stack.match // ^(.+?) \n \s (\s+ (.|\n)+ ) //
        msg.push "\n"
        if m?
            msg.push m[2]
        else
            msg.push stack

    msg.push "\n"
    process.stderr.write join ' ' msg

    if error
        code ?= 1
        process.exit code

    void

Identifier.main = {
    import-all, import-kind,
    shell-quote, shell-parse,
    ord, chr, bullet, log, info,
    err-set, iwarn, ierror, warn, error,
    complain, complain1, icomplain, icomplain1,
    sys-set, sys, sys-exec, sys-spawn, sys-ok,
    getopt, sprintf,
}

Identifier.color = {
    red, bright-red, green, bright-green,
    yellow, bright-yellow, blue, bright-blue,
    magenta, bright-magenta, cyan, bright-cyan,
}

Identifier.util = {
    merge-objects, times, range,
    shuffle,
    is-int, is-integer, is-positive-int, is-non-negative-int, is-num,
    is-number, is-array, is-arr, is-obj, is-object, is-str, is-string,
    is-bool, is-boolean, is-func, is-function, is-a-num, is-a-number,
}

for _, ident of Identifier
    for k, v of ident
        module.exports[k] = v


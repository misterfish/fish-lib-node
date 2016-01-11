export
    init
    squeak-set
    icomplain
    complain
    iwarn
    ierror
    warn
    error
    aerror

{ last, join, map, } = require "prelude-ls"

main = require.main

{ } = main.exports

{ is-obj, is-arr, } = require './types'
{ bullet, bullet-get, green, bright-red, yellow, red, } = require './speak'
{ array, } = require './util'

# --- lazy loaded module (required when needed).
#
# this is like this as a phantomjs workaround.
util = void

our =
    # --- functions which we need from main but which main doesn't want to
    # export to the world.
    pkg:
        conf-set: void

    opts:
        # --- honored by all error and warning functions and can be used to
        # force printing or suppressing of the stack trace.
        #
        # if it's not set, the value in the options object is used, and if
        # that's not set, stack trace is printed on aerror(), iwarn() and
        # ierror(), and not on warn() and error().

        print-stack-trace: void

        # --- 'warn' | 'error'
        #
        # this controls whether the (i)complain() functions route through
        # warn() or through error().

        complain: 'error'

        # --- 'fatal' | 'throw' | 'allow'
        #
        # you can set this to 'allow' to make the (i)error() function not
        # exit, but you probably don't want to -- (i)error() is meant to be
        # used to mean serious errors.
        #
        # in fish-lib (i)error() is never preceded by return -- if for some
        # reason you do set this to 'allow' you probably want to do it for
        # short bursts of code and make sure to call 'return (i)error()'
        # instead of just '(i)error()'
        #
        # if it's set to 'throw' it will throw an exception with the given
        # message.

        error: 'fatal'

        # --- 'fatal' | 'throw' | 'allow'
        #
        # in the case of api errors it could be useful to set it to 'allow'.
        #
        # 'throw' works the same as for error().
        #
        # in fish-lib aerror() is always preceded by return.

        api-error: 'fatal'

# --- checks our.opts.fatal and routes through either ierror or iwarn.
#
# usage: complain <args to ierror/iwarn ... >, opts = {}
#
# stack-rewind is set to 2 ( HERE>> function -> icomplain -> ierror/iwarn)

function icomplain ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}
    func = if our.opts.complain is 'error' then ierror else iwarn
    opts.stack-rewind ?= 0
    opts.stack-rewind += 2
    func.apply null msg ++ [opts]

# --- checks our.opts.fatal and routes through either error or warn.
#
# usage: complain <args to error/warn ... >, opts = {}
#
# stack-rewind is set to 2 by default ( HERE>> function -> icomplain -> ierror/iwarn)

function complain ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}
    func = if our.opts.complain is 'error' then error else warn
    opts.stack-rewind ?= 0
    opts.stack-rewind += 2
    func.apply null msg ++ [opts]

# --- programmer warnings.
#
# usage: iwarn 'string' [, 'string', ...], opts = {}

function iwarn ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}

    pcomplain opts <<<
        msg: msg
        type: 'iwarn'
        internal: true

# --- programmer errors.
#
# usage: ierror 'string' [, 'string', ...], opts = {}

function ierror ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}

    pcomplain opts <<<
        msg: msg
        type: 'ierror'
        internal: true

# --- user/system warnings.
#
# usage: warn 'string' [, 'string', ...], opts = {}

function warn ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}

    pcomplain opts <<<
        msg: msg
        type: 'warn'
        internal: false

# --- user/system errors.
#
# usage: error 'string' [, 'string', ...], opts = {}

function error ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}

    pcomplain opts <<<
        msg: msg
        type: 'error'
        internal: false

# --- api errors.
#
# usage: aerror 'string' [, 'string', ...], opts = {}

function aerror ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}

    pcomplain opts <<<
        msg: msg
        type: 'aerror'
        internal: false

function init { pkg = {}, } = {}
    # --- clone args; noop if []
    our.pkg <<< pkg

function squeak-set opts
    our.pkg.conf-set do
        source: opts
        target: our.opts
        name: 'err'

function squeak-get key
    return complain 'No such key' bright-red key unless our.opts.has-own-property key
    our.opts[key]

# --- all error and warn functions route through this underlying one.
#
# @private

function pcomplain { msg, type, internal, print-stack-trace, code, stack-rewind = 0 }
    util := require 'util' unless util

    print-stack-trace-opt = print-stack-trace

    # --- will call pcomplain() again, but won't infinitely loop.
    return iwarn 'bad param msg' unless is-arr msg

    msg = map do
        -> if is-obj it then util.inspect it else it
        msg

    print-file-and-line = false

    if type is 'aerror'
        msg.push "bad call." unless msg.length
        msg.unshift "Api error:"
        error = true
        print-file-and-line = true
        print-stack-trace = true
        allow = our.opts.api-error is 'allow'
        throws = our.opts.api-error is 'throw'
    else if type is 'ierror'
        msg.push "something's wrong." unless msg.length
        msg.unshift "Internal error:"
        print-file-and-line = true
        print-stack-trace = true
        allow = our.opts.error is 'allow'
        throws = our.opts.error is 'throw'
    else if type is 'iwarn'
        msg.push "something's wrong." unless msg.length
        msg.unshift "Internal warning:"
        print-file-and-line = true
        print-stack-trace = true
        allow = true
        throws = false
    else if type is 'error'
        msg.push "something's wrong." unless msg.length
        msg.unshift "Error:"
        print-file-and-line = false
        print-stack-trace = false
        allow = our.opts.error is 'allow'
        throws = our.opts.error is 'throw'
    else if type is 'warn'
        msg.push "something's wrong." unless msg.length
        msg.unshift "Warning:"
        print-file-and-line = false
        print-stack-trace = false
        allow = true
        throws = false

    print-stack-trace = that if print-stack-trace-opt?
    print-stack-trace = that if our.opts.print-stack-trace?

    # --- disable colors.
    if throws then yellow := green := bright-red := red := ->
        if is-arr it then it.0 else it

    if allow
        bullet-color = bright-red
    else
        bullet-color = red

    if print-stack-trace or print-file-and-line
        [stack, funcname, filename, line-num] = get-stack stack-rewind

    msg.0 = do ->
        ind = ' ' * bullet-get 'indent'
        spa = ' ' * bullet-get 'spacing'

        # --- -warn-on-error to avoid infinite loop.
        bul = bullet-color [bullet!, {-warn-on-error}]

        ind + bul + spa + msg.0

    # --- (file:line)
    if print-file-and-line
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

    if print-stack-trace
        msg.push "\n"
        if m?
            msg.push m[2]
        else
            msg.push stack

    msg.push "\n"
    msg-str = join ' ' msg

    if throws
        throw new Error msg-str

    process.stderr.write join ' ' msg

    if not allow
        code ?= 1
        process.exit code

    void

# --- @private.
function get-stack stack-rewind
    stack = (new Error).stack

    # --- some environments (e.g. phantomjs) don't give us a stack.
    stack = '' unless stack?

    # --- take off 'Error'.
    stack := stack.replace // ^ \s* \S+ \s+ // '   '

    [funcname, filename, line-num] = do ->
        # --- this will all break one day, but here we go:
        #
        # kill three frames to get back to the useful call, and then n more (n
        # = stack-rewind).
        #
        # careful: extended regex not allowed in interpolation.

        regex = ".*\n" * (3 + stack-rewind)
        my-stack = stack.replace // ^ #regex // ''

        if m = my-stack.match // ^ \s+ at \s+ (\S+) \s* \( (.+?) : (\d+) : \d+ \) //
            # --- function, file, line
            [m.1, m.2, m.3]
        else if m = my-stack.match // ^ \s+ at \s+ (.+?) : (\d+) : \d+ //
            [void, m.1, m.2]
        else
            ["«unknown-file»" "«unknown-line»"]

    [stack, funcname, filename, line-num]


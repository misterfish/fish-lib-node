export
    init
    err-set
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
        # Fatal is used for the complain family of functions to decide whether
        # to route through (i)warn or (i)complain.
        # It is not used to make (i)error non-fatal.
        # This module never calls (i)error, leaving it up to the caller to die
        # The only exception is the sys family of functions, which take a 'die'
        # flag (false by default).
        # At some point the iwarn calls for things like invalid function calls
        # might get upgraded to icomplain calls, so they can optionally die.
        # our.opts.fatal might also get set to false by default at some point, so be
        # sure to set it if you really depend on it.
        fatal: true
        print-stack-trace: false

# --- checks our.opts.fatal and routes through either ierror or iwarn.
#
# usage: complain <args to ierror/iwarn ... >, opts = {}
#
# stack-rewind is set to 2 ( HERE>> function -> icomplain -> ierror/iwarn)

function icomplain ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}
    func = if our.opts.fatal then ierror else iwarn
    opts.stack-rewind ?= 0
    opts.stack-rewind += 2
    func msg, opts

# --- checks our.opts.fatal and routes through either error or warn.
#
# usage: complain <args to error/warn ... >, opts = {}
#
# stack-rewind is set to 2 by default ( HERE>> function -> icomplain -> ierror/iwarn)

function complain ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}
    func = if our.opts.fatal then error else warn
    opts.stack-rewind ?= 0
    opts.stack-rewind += 2
    func msg, opts

# --- programmer warnings.
#
# usage: iwarn 'string' [, 'string', ...], opts = {}

function iwarn ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}

    pcomplain opts <<<
        msg: msg
        type: 'internal'
        error: false

# --- programmer errors.
#
# usage: ierror 'string' [, 'string', ...], opts = {}

function ierror ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}

    pcomplain opts <<<
        msg: msg
        type: 'internal'
        error: true

# --- user/system warnings.
#
# usage: warn 'string' [, 'string', ...], opts = {}

function warn ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}

    pcomplain opts <<<
        msg: msg
        type: 'normal'
        error: false

# --- user/system errors.
#
# usage: error 'string' [, 'string', ...], opts = {}

function error ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}

    pcomplain opts <<<
        msg: msg
        type: 'normal'
        error: true

# --- api errors.
#
# usage: aerror 'string' [, 'string', ...], opts = {}

function aerror ...msg
    opts = last msg
    if is-obj opts then msg.pop() else opts = {}

    pcomplain opts <<<
        msg: msg
        type: 'api'

function init { pkg = {}, } = {}
    # --- clone args; noop if []
    our.pkg <<< pkg

function err-set opts
    our.pkg.conf-set do
        source: opts
        target: our.opts
        name: 'err'

"""
# --- like calling icomplain msg, stack-rewind: 1
#
# (since it's another call on the stack, stack-rewind is 2).

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
"""

/**
 * @private
 *
 * All error and warn functions route through this underlying one.
 *
 * msg: array.
 */
function pcomplain { msg, type, error, print-stack-trace, code, stack-rewind = 0 }
    util := require 'util' unless util

    print-stack-trace ?= our.opts.print-stack-trace
    stack = (new Error).stack

    # --- some environments (e.g. phantomjs) don't give us a stack.
    stack = '' unless stack?

    # --- take off 'Error'.
    stack := stack.replace // ^ \s* \S+ \s+ // '   '

    [funcname, filename, line-num] = do ->
        # --- this will all break one day, but here we go:

        # kill two frames to get back to the useful call, and then n more (n
        # = stack-rewind).
        #
        # careful: extended regex not allowed in interpolation.
        regex = ".*\n" * (2 + stack-rewind)
        my-stack = stack.replace // ^ #regex // ''

        if m = my-stack.match // ^ \s+ at \s+ (\S+) \s* \( (.+?) : (\d+) : \d+ \) //
            # --- function, file, line
            [m[1], m[2], m[3]]
        else if m = my-stack.match // ^ \s+ at \s+ (.+?) : (\d+) : \d+ //
            [void, m[1], m[2]]
        else
            ["«unknown-file»", "«unknown-line»"]

    # --- will call pcomplain() again, but won't infinitely loop.
    return iwarn 'bad param msg' unless is-arr msg

    msg = map do
        -> if is-obj it then util.inspect it else it
        msg

    print-file-and-line = false

    if type is 'api'
        msg.unshift "Api error:"
        error = true
        print-file-and-line = true
    else if type is 'internal'
        if error
            msg.unshift "Internal error:"
        else
            msg.unshift "Internal warning:"
        print-file-and-line = true
    else
        if error
            msg.unshift "Error:"
        else
            msg.unshift "Warning:"
        print-file-and-line = false

    if error
        bullet-color = red
    else
        bullet-color = bright-red

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
    process.stderr.write join ' ' msg

    if error
        code ?= 1
        process.exit code

    void



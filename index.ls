# --- Useful stuff for working with node js.
#
# Source: misterfish@github/fish-lib-node
# License: GPL 2.0
# Author: Allen Haim <allen@netherrealm.net>

{ curry, join, last, map, each, compact, keys, values } = require "prelude-ls"
sprintf = require 'sprintf'

{ sys-set, sys-ok, sys-exec, sys-spawn, sys, shell-quote, } = sys-mod = require './sys'
{ bullet, bullet-set, bullet-get, log, info, green, bright-green, blue, bright-blue, red, bright-red, yellow, bright-yellow, cyan, bright-cyan, magenta, bright-magenta, } = speak = require './speak'

{ err-set, icomplain, complain, iwarn, ierror, warn, error, aerror, } = squeak = require './squeak'

{ of-number, of-object, ok-number, is-array, is-object, is-string, is-boolean, is-function, is-integer, is-integer-strict, is-number, is-number-strict, is-integer-positive, is-integer-non-negative, is-buffer, of-num, of-obj, ok-num, is-arr, is-obj, is-str, is-bool, is-func, is-int, is-int-strict, is-num, is-num-strict, is-int-pos, is-int-non-neg, is-buf, } = types = require './types'

config =
    # --- functions which our sister modules in this package might need from
    # us but which we don't want to export to the world.
    pkg: { conf-set, }

sys-mod.init do
    pkg: config.pkg
squeak.init do
    pkg: config.pkg

# --- convenience for importing groups of functions.
Identifier =
    main: {}
    color: {}
    util: {}
    sys: {}

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

function ord
    return icomplain 'Bad call' unless is-str it
    warn "Ignoring extra chars (got '#{ green it.substr 0, 1 }#{ bright-red it.substr 1}' " if it.length > 1
    it.char-code-at 0

function chr
    return icomplain 'Bad call' unless is-num it
    String.from-char-code it

/* 
 * a and b are integers.
 * step by +1 or -1 to get from a to b, inclusive.
 */
function range a, b, func
    return icomplain 'Bad call' unless is-int a and is-int b

    for i from a to b
        func i

function times n, func
    if not is-positive-int n
        return icomplain 'Bad call'
    for i from 1 to n
        func i-1 # 0-based to make it like ruby

# --- functions for importing from fish-lib.

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

# --- array 1 2 3 -> [1 2 3]
function array
    [.. for &]

# --- to-array arguments -> [arguments.0, arguments.1, ...]
function to-array
    [.. for &.0]

# --- @dies.
function conf-set { source, target, name = 'unknown' }
    for k, v of source
        if not target.has-own-property k
            error "Invalid opt for #{ yellow name }: #{ bright-red k }"
        target[k] = v

Identifier.all = {}

Identifier.main = {
    import-all, import-kind,

    #getopt, 
    sprintf,
}

Identifier.speak = {
    bullet, bullet-set, bullet-get, log, info, green, bright-green,
    blue, bright-blue, red, bright-red, yellow, bright-yellow,
    cyan, bright-cyan, magenta, bright-magenta,
}

Identifier.squeak = {
    icomplain, complain, iwarn, ierror, warn, error, aerror, err-set,
}

Identifier.color = {
    red, bright-red, green, bright-green,
    yellow, bright-yellow, blue, bright-blue,
    magenta, bright-magenta, cyan, bright-cyan,
}

Identifier.util = {
    merge-objects, times, range,
    shuffle, ord, chr,
    array, to-array,
}

Identifier.types = {
    is-int, is-integer, is-positive-int, is-non-negative-int, is-num,
    is-number, is-array, is-arr, is-obj, is-object, is-str, is-string,
    is-bool, is-boolean, is-func, is-function, is-a-num, is-a-number, is-buffer,
}

Identifier.sys = {
    sys-set, sys, sys-exec, sys-spawn, sys-ok, shell-quote,
}

<[ main speak squeak color util types sys ]> .for-each ->
    Identifier.all <<< Identifier[it]

for k, v of Identifier.all
    module.exports[k] = v


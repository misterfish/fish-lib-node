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

{ shuffle-array, merge-objects, ord, chr, range, times, array, to-array, } = util = require './util'

config =
    # --- functions which our sister modules in this package might need from
    # us but which we don't want to export to the world.
    pkg: { conf-set, }

sys-mod.init do
    pkg: config.pkg
squeak.init do
    pkg: config.pkg

# --- convenience for importing groups of functions.
Identifier = {}

function import-all target
    for k, v of module.exports
        target[k] = v

# --- import groups of functions.
#
# e.g.
# import-kind 'all'
# import-kind <[ squeak color ]>
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

Identifier.types = {
    is-int, is-integer, is-positive-int, is-non-negative-int, is-num,
    is-number, is-array, is-arr, is-obj, is-object, is-str, is-string,
    is-bool, is-boolean, is-func, is-function, is-a-num, is-a-number, is-buffer,
}

Identifier.sys = {
    sys-set, sys, sys-exec, sys-spawn, sys-ok, shell-quote,
}

Identifier.util = {
    shuffle-array, merge-objects, ord, chr, range, times, array, to-array,
}

<[ main speak squeak color util types sys ]> .for-each ->
    Identifier.all <<< Identifier[it]

for k, v of Identifier.all
    module.exports[k] = v


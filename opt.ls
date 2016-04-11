# --- usage:
#
# node file.js -st --path abc
#
# opt = getopt do
#   s: 'b'
#   t: 'b'
#   # --- will get resolved against cwd if it's not absolute.
#   path: 'p'
#   name: 's'
#   # --- will become an array.
#   alpha: 'ms'
#   n: 'b'
#   a:
#     'b'
#     some-option: 'val' # (1)
#
# { name, math, alpha, path } = opt
# name or error 'Missing name'
#
# note that it's up to the user to enforce the presence of options.
#
# --n, -n, --na, --nam, -nam, all alias to name by default (if it's not a
# cluster of other opts).
#
# but in this case -n and -a cluster. so -na is -n -a while -nam is --name.
# (1) no options are currently supported (nopt doesn't seem very configurable)
#

export
    getopt

# --- lazy loaded module (required when needed).
#
# this is like this as a phantomjs workaround.
#
path = void

nopt = require 'nopt'

{ is-array, } = require './types'
{ bright-red, } = require './speak'
{ complain, } = require './squeak'

function getopt args
    path := require 'path' unless path

    known-opts = {}

    # --- you need short-hands so that clustering works on single letter
    # options.
    short-hands = {}

    # --- another example:  (not using)
    # bloo:   <[ big medium small ]>

    types =
        b:  Boolean
        s:  String
        p:  path
        ms:  Array

    # --- first put all single letter options last, so that -n maps to the
    # 'n' option and not 'name'.
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
            # --- map single letters to the corresponding long one.
            short-hands[long.substring 0 1] = ['--' + long]

    parsed = nopt known-opts, short-hands, process.argv, 2

    for k, v of parsed
        continue if k == 'argv'
        if not known-opts[k] then
            complain "Unknown option:" bright-red k

    parsed


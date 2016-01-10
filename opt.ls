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




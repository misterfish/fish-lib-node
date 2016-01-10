export
    shuffle-array
    merge-objects
    ord
    chr
    range
    times
    array
    to-array

{ is-positive-int, is-int, is-num, is-str, } = require './types'
{ aerror, warn, } = require './squeak'
{ green, bright-red, } = require './speak'

# --- shuffle an array, not particularly efficiently.
function shuffle-array input
    l = input.length
    out = []
    locations = { [i, 42] for i from 0 to l - 1 }
    locations-num-keys = l
    times l, ->
        key = (keys locations)[
            m = Math.floor Math.random! * locations-num-keys
        ]
        delete locations[key]
        out.push input[key]
        locations-num-keys--
    out

# --- merge all argument objects into a new object, going from left to
# right, and only using own properties.

function merge-objects ...obj
    { [k, v] for obj in arguments for k, v of obj }

function ord
    return aerror() unless is-str it
    warn "Ignoring extra chars (got '#{ green it.substr 0, 1 }#{ bright-red it.substr 1}' " if it.length > 1
    it.char-code-at 0

function chr
    return aerror() unless is-num it
    String.from-char-code it

# --- step by +1 or -1 to get from a to b, inclusive.
function range a, b, func
    return aerror() unless is-int a and is-int b

    for i from a to b
        func i

# --- call the function n times, and pass it the counter idx as its arg.
#
# the idx is 0-based to make it like ruby.
function times n, func
    return aerror() unless is-positive-int n
    for i from 1 to n
        func i-1

# --- array 1 2 3 -> [1 2 3]
function array
    [.. for &]

# --- to-array arguments -> [arguments.0, arguments.1, ...]
function to-array
    [.. for &.0]


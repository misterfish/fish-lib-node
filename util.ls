export
    ord
    chr
    range
    times
    array
    to-array
    flat-array

# --- is-int-pos, is-int, is-num, is-str, is-func, is-array,
types = require './types'
# --- aerror, warn,
squeak = require './squeak'
# --- green, bright-red,
speak = require './speak'

function ord
    squeak.aerror it unless types.is-str it
    if it.length > 1
        squeak.warn sprintf do
            "Ignoring extra chars (got '%s%s')"
            speak.green it.substr 0 1
            speak.bright-red it.substr 1
    it.char-code-at 0

function chr
    squeak.aerror it unless types.is-num it
    String.from-char-code it

# --- step by +1 or -1 to get from a to b, inclusive.
#
# if func is given, call it for each step with the value as argument,
#
# if not, return an array.

function range a, b, func
    squeak.aerror() unless types.is-int a and types.is-int b
    squeak.aerror 'bad function' if func and not types.is-func func

    if func
        for i from a to b
            func i
    else
        [a to b]

# --- call the function n times, and pass it the counter idx as its arg.
#
# the idx is 0-based to make it like ruby.

function times n, func
    return squeak.aerror() unless types.is-int-pos n
    for i from 1 to n
        func i-1

# --- array 1 2 3 -> [1 2 3]
function array
    [.. for &]

# --- turn an array-like object (e.g. arguments) into an array.
function to-array
    [.. for &.0]

# --- call like:
#
# flat-array do
#   1
#   [1 2]
#   [1 [2 3]]
#
# (returns [1 1 2 1 2 3])
# 
# A single array arg is just a special case:
#
# flat-array [1 [2 [3 4]]]

function flat-array ...vals
    ret = []
    recursing = false
    vals.for-each ->
        if types.is-array it
            recursing := true
            v = it
        else
            v = [it]
        v.for-each ->
            ret.push it
    if recursing
        flat-array.apply null ret
    else
        ret

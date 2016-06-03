# --- of-number() and of-object() check the value of JS's typeof.
#
# for all other types, just use is-xxx().
#
# for number and object, is-xxx() functions provide stronger checks than
# just 'typeof', because 'object' and 'number' contain their own negations
# (null is an 'object', and NaN is a 'number'); and, arrays are 'objects'
# and 'Infinity' is a 'number'.
#
# so, is-number() returns true if it's really a number -- not NaN or Infinity.
#
# it also returns true if it's a string pretending to be a number -- see
# is-number-strict() to disallow strings.
#
# is-integer() and is-integer-strict() work analogously.
#
# is-object() returns true if it's not null and not an array.
#
# --- ok-number provides more detailed information for inspecting the input
# (see ok-number()).

# --- iwarn,
squeak = require './squeak'
# --- bright-red,
speak = require './speak'

our =
    type-check:
        n:      isNumber
        ns:     isNumberStrict
        i:      isInteger
        is:     isIntegerStrict
        ip:     isIntegerPositive
        ips:    isIntegerPositiveStrict
        iN:     isIntegerNonNegative
        iNs:    isIntegerNonNegativeStrict
        s:      isString
        o:      isObject
        a:      isArray
        f:      isFunction

# --- useful for argument checking.
#
# ok it # => not null and not undef.
# ok it, spec # => check the type of the arg.
#
#     spec:
#
#        'n'    => is-number
#        'ns'   => is-number-strict
#        'i'    => is-integer
#        'is'   => is-integer-strict
#        'ip'   => is-integer-positive
#        'ips'  => is-integer-positive-strict
#        'iN'   => is-integer-non-negative
#        'iNs'  => is-integer-non-negative-strict
#        's'    => is-string
#        'o'    => is-object
#        'a'    => is-array
#        'f'    => is-function

function ok n, spec
    return false unless n?
    return true unless spec?
    func = our.type-check[spec]
    return squeak.iwarn 'bad spec' speak.bright-red spec unless func
    func.call null n

function defined n
    n?

# ------ checks if the input is of type 'number'.
#
# note that Infinity and NaN are both of type 'number'.

function of-number
    typeof! it is 'Number'

# ------ checks if the input is of type 'object'.
#
# note that arrays and null will both return true.

function of-object
    typeof it is 'object'

# ------ further inspection of number types.
#
# returns: {
#   nan: true/false,
#   infinity: true/false
#   is-of-num: true/false (is of type 'number')
#   ok: true/false (is of type 'number' and real)
# }

function ok-number
    nan = isNaN it
    infinity = it == Infinity
    is-of-num = of-number it

    nan: nan
    infinity: infinity
    is-of-num: is-of-num
    ok: is-of-num and !nan and !infinity

# ------ checks if the input is a real number or a string pretending to be
# one.
#
# returns true if:
#
# 1 - the input is of type 'string' and can be parsed as a number, and the
# resulting number is not Infinity or NaN.
#
# or
#
# 2 - the input is of type 'number' and is not Infinity or NaN.

function is-number
    is-number-priv it, strict: false

function is-number-strict
    is-number-priv it, strict: true

# ------ checks if the input is an object, rejecting null and Arrays.
function is-object
    typeof! it is 'Object'

# ------ checks if the input is a string.
function is-string
    typeof! it is 'String'

# ------ checks if the input is a boolean.
function is-boolean
    typeof! it is 'Boolean'

# ------ checks if the input is a function.
function is-function
    typeof! it is 'Function'

# ------ checks if the input is an Array.
function is-array
    typeof! it is 'Array'

# ------ checks if the input is an integer or a string pretending to be one.

function is-integer
    is-integer-priv it, strict: false

# ------ checks if the input is an integer and actually a number.

function is-integer-strict
    is-integer-priv it, strict: true

function is-integer-positive
    is-int it and (it > 0)

function is-integer-positive-strict
    is-int-strict it and (it > 0)

function is-integer-non-negative
    is-int it and (it >= 0)

function is-integer-non-negative-strict
    is-int-strict it and (it >= 0)

# ------ checks if the input is a Buffer.
function is-buffer
    Buffer.is-buffer ...

# --- @private
function is-number-priv n, { strict } = {}
    if is-string n
        if strict
            return false
        else
            n = +n
    ok-number n .ok

# --- @private
function is-integer-priv n, { strict } = {}
    if is-string n
        if strict
            return false
        else
            n = +n

    ok-number n .ok and (n == Math.floor n)

# --- aliases

of-num = of-number
of-obj = of-object
ok-num = ok-number
is-num = is-number
is-num-strict = is-number-strict
is-obj = is-object
is-str = is-string
is-bool = is-boolean
is-func = is-function
is-arr = is-array
is-int = is-integer
is-int-strict = is-integer-strict
is-buf = is-buffer
is-int-pos = is-integer-positive
is-int-pos-strict = is-integer-positive-strict
is-int-non-neg = is-integer-non-negative
is-int-non-neg-strict = is-integer-non-negative-strict

export
    ok
    defined
    of-number
    of-object

    ok-number

    is-array
    is-object
    is-string
    is-boolean
    is-function
    is-integer
    is-integer-strict
    is-number
    is-number-strict
    is-integer-positive
    is-integer-positive-strict
    is-integer-non-negative
    is-integer-non-negative-strict
    is-buffer

    # --- aliases
    of-num
    of-obj

    ok-num

    is-arr
    is-obj
    is-str
    is-bool
    is-func
    is-int
    is-int-strict
    is-num
    is-num-strict
    is-int-pos
    is-int-pos-strict
    is-int-non-neg
    is-int-non-neg-strict
    is-buf

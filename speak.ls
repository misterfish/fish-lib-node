export
    bullet-set
    bullet-get
    bullet

    log
    info

    disable-colors
    force-colors

    green
    bright-green
    blue
    bright-blue
    red
    bright-red
    yellow
    bright-yellow
    cyan
    bright-cyan
    magenta
    bright-magenta

{ curry, values, join, } = require "prelude-ls"

# --- array,
util = require './util'
# --- is-obj, is-num,
types = require './types'
# --- aerror, iwarn,
squeak = require './squeak'

config =
    cols:
        red:                31
        'bright-red':       91
        green:              32
        'bright-green':     92
        yellow:             33
        'bright-yellow':    93
        blue:               34
        'bright-blue':      94
        magenta:            35
        'bright-magenta':   95
        cyan:               36
        'bright-cyan':      96
        reset:              0

    bullets:
        ghost: '꣐'
        star: '٭'
        'bass-clef': '𝄢'
        'parallel-lines': '𝄓'
        ypsili: '𝁐'
        straggismata: '𝁄'
        petasti: '𝁉'
        paraklitiki: '𝀉'
        dipli: '𝀒'
        bengali: 'ঈ'

our =
    bullet:
        # --- values of config.bullets.
        vals: void
        # --- the bullet.
        str: void
        # --- before the bullet.
        indent: 0
        # --- between the bullet and the text.
        spacing: 1
    colors:
        disable: false
        force: false

# --- must take exactly 2 args (for currying to work right).
#
# so s might be an array.

function color col, s
    if typeof! s is 'Array'
        [ str, opt, ] = s
    else
        str = s
        opt = {}

    if our.colors.disable
        return str
    if not is-tty() and not our.colors.force
        return str

    join '' util.array do
        _color col, opt
        str
        _color 'reset', opt

function colored the-color
    (curry color) the-color

# --- set warn-on-error to false to avoid infinite loop if calling from
# within iwarn.

function _color c, { warn-on-error = true, } = {}
    if not (col = config.cols[c])?
        squeak.iwarn "Invalid color:" c if warn-on-error
        return ''
    '[' + col + 'm'

function log
    console~log ...

# --- return our.bullet.str if it's been set, otherwise a random bullet.
function bullet
    return that if our.bullet.str?
    our.bullet.vals := values config.bullets unless our.bullet.vals?
    our.bullet.vals[ Math.floor Math.random() * our.bullet.vals.length ]

function info
    return unless &.length
    prnt = [].slice.call &
    ind = ' ' * our.bullet.indent
    spa = ' ' * our.bullet.spacing
    bul = blue bullet()
    prnt.0 = ind + bul + spa + prnt.0
    console.log.apply console, prnt
    void

# --- returns `this` for convenient chaining.
function bullet-set arg
    if types.is-obj (opts = arg)
        if opts.str?
            our.bullet.str = that
        else if opts.type?
            our.bullet.str = config.bullets[that] ? ' '
        if (s = opts.spacing)?
            return squeak.iwarn 'bad spacing' unless types.is-num s
            our.bullet.spacing = s
        if (s = opts.indent)?
            return squeak.iwarn 'bad indent' unless types.is-num s
            our.bullet.indent = s
    else
        our.bullet.str = arg
    @

function bullet-get val
    squeak.aerror 'no such bullet property' bright-red val unless our.bullet.has-own-property val

    our.bullet[val]

function green
    (colored 'green') ...

function bright-green
    (colored 'bright-green') ...

function blue
    (colored 'blue') ...

function bright-blue
    (colored 'blue') ...

function red
    (colored 'red') ...

function bright-red
    (colored 'bright-red') ...

function yellow
    (colored 'yellow') ...

function bright-yellow
    (colored 'bright-yellow') ...

function cyan
    (colored 'cyan') ...

function bright-cyan
    (colored 'bright-cyan') ...

function magenta
    (colored 'magenta') ...

function bright-magenta
    (colored 'bright-magenta') ...

function disable-colors
    our.colors.disable = true
    @

function force-colors
    our.colors.force = true
    @

# --- @private
function is-tty
    process.stdout.isTTY

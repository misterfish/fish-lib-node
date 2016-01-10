export
    bullet-set
    bullet-get
    bullet

    log
    info

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

config =
    bullets:
        ghost: '꣐'
        star: '٭'
        bass-clef: '𝄢'
        parallel-lines: '𝄓'
        segno: '𝄋'
        ypsili: '𝁐'
        straggismata: '𝁄'
        petasti: '𝁉'
        paraklitiki: '𝀉'
        dipli: '𝀒'
        satanga: '᳅'
        bengali: 'ঈ'

our =
    bullet:
        vals: void # values of config.bullets
        str: void # the bullet
        indent: 0 # before the bullet
        spacing: 1 # between the bullet and the text

# Must take exactly 2 args (for fancy currying to work right).
function color col, s
    if typeof! s is 'Array'
        [str, opt] = s
    else
        str = s
        opt = {}
    join '' array do
        _color col, opt
        str
        _color 'reset', opt

function colored the-color
    (curry color) the-color

function _color c, { warn-on-error } = {}
    # set warn-on-error to false to avoid infinite loop if calling from
    # within iwarn.
    warn-on-error ?= true
    col = {
        red:            	31,
        'bright-red':   	91,
        green:          	32,
        'bright-green': 	92,
        yellow:         	33,
        'bright-yellow':	93,
        blue:           	34,
        'bright-blue':  	94,
        magenta:        	35,
        'bright-magenta': 	95,
        cyan:           	36,
        'bright-cyan':  	96,
        reset:          	0,
    }[c]

    if not col?
        if warn-on-error then iwarn "Invalid color:" c
        return ''

    '[' + col + 'm'


/**
 * @private
 */

function log ...msg
    console.log.apply console, msg

/**
 * Return our.bullet.str if it's been set, otherwise a random bullet.
 */
function bullet
    return that if our.bullet.str?
    our.bullet.vals := values config.bullets unless our.bullet.vals?
    our.bullet.vals[ Math.floor Math.random() * our.bullet.vals.length ]

function info
    return unless arguments.length
    prnt = [].slice.call arguments
    ind = ' ' * our.bullet.indent
    spa = ' ' * our.bullet.spacing
    bul = blue bullet()
    prnt.0 = ind + bul + spa + prnt.0
    console.log.apply console, prnt
    void

function bullet-set opts
    if opts.str?
        our.bullet.str = that
    else if opts.key?
        our.bullet.str = config.bullets[that] ? ' '
    if (s = opts.spacing)?
        return iwarn 'bad spacing' unless is-num s
        our.bullet.spacing = s
    if (s = opts.indent)?
        return iwarn 'bad indent' unless is-num s
        our.bullet.indent = s

function bullet-get val
    return aerror 'no such bullet property' bright-red val unless our.bullet.has-own-property val

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

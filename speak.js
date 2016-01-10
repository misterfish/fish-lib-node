var ref$, curry, values, join, array, config, our, out$ = typeof exports != 'undefined' && exports || this, toString$ = {}.toString, slice$ = [].slice;
out$.bulletSet = bulletSet;
out$.bulletGet = bulletGet;
out$.bullet = bullet;
out$.log = log;
out$.info = info;
out$.disableColors = disableColors;
out$.forceColors = forceColors;
out$.green = green;
out$.brightGreen = brightGreen;
out$.blue = blue;
out$.brightBlue = brightBlue;
out$.red = red;
out$.brightRed = brightRed;
out$.yellow = yellow;
out$.brightYellow = brightYellow;
out$.cyan = cyan;
out$.brightCyan = brightCyan;
out$.magenta = magenta;
out$.brightMagenta = brightMagenta;
ref$ = require("prelude-ls"), curry = ref$.curry, values = ref$.values, join = ref$.join;
array = require('./util').array;
config = {
  bullets: {
    ghost: '꣐',
    star: '٭',
    bassClef: '𝄢',
    parallelLines: '𝄓',
    segno: '𝄋',
    ypsili: '𝁐',
    straggismata: '𝁄',
    petasti: '𝁉',
    paraklitiki: '𝀉',
    dipli: '𝀒',
    satanga: '᳅',
    bengali: 'ঈ'
  }
};
our = {
  bullet: {
    vals: void 8,
    str: void 8,
    indent: 0,
    spacing: 1
  },
  colors: {
    disable: false,
    force: false
  }
};
function color(col, s){
  var str, opt;
  if (our.colors.disable) {
    return s;
  }
  if (!isTty() && !our.colors.force) {
    return s;
  }
  if (toString$.call(s).slice(8, -1) === 'Array') {
    str = s[0], opt = s[1];
  } else {
    str = s;
    opt = {};
  }
  return join('', array(_color(col, opt), str, _color('reset', opt)));
}
function colored(theColor){
  return curry(color)(theColor);
}
function _color(c, arg$){
  var warnOnError, col;
  warnOnError = (arg$ != null
    ? arg$
    : {}).warnOnError;
  warnOnError == null && (warnOnError = true);
  col = {
    red: 31,
    'bright-red': 91,
    green: 32,
    'bright-green': 92,
    yellow: 33,
    'bright-yellow': 93,
    blue: 34,
    'bright-blue': 94,
    magenta: 35,
    'bright-magenta': 95,
    cyan: 36,
    'bright-cyan': 96,
    reset: 0
  }[c];
  if (col == null) {
    if (warnOnError) {
      iwarn("Invalid color:", c);
    }
    return '';
  }
  return '[' + col + 'm';
}
function log(){
  var msg;
  msg = slice$.call(arguments);
  return console.log.apply(console, msg);
}
function bullet(){
  var that;
  if ((that = our.bullet.str) != null) {
    return that;
  }
  if (our.bullet.vals == null) {
    our.bullet.vals = values(config.bullets);
  }
  return our.bullet.vals[Math.floor(Math.random() * our.bullet.vals.length)];
}
function info(){
  var prnt, ind, spa, bul;
  if (!arguments.length) {
    return;
  }
  prnt = [].slice.call(arguments);
  ind = repeatString$(' ', our.bullet.indent);
  spa = repeatString$(' ', our.bullet.spacing);
  bul = blue(bullet());
  prnt[0] = ind + bul + spa + prnt[0];
  console.log.apply(console, prnt);
}
function bulletSet(opts){
  var that, ref$, s;
  if ((that = opts.str) != null) {
    our.bullet.str = that;
  } else if ((that = opts.key) != null) {
    our.bullet.str = (ref$ = config.bullets[that]) != null ? ref$ : ' ';
  }
  if ((s = opts.spacing) != null) {
    if (!isNum(s)) {
      return iwarn('bad spacing');
    }
    our.bullet.spacing = s;
  }
  if ((s = opts.indent) != null) {
    if (!isNum(s)) {
      return iwarn('bad indent');
    }
    return our.bullet.indent = s;
  }
}
function bulletGet(val){
  if (!our.bullet.hasOwnProperty(val)) {
    return aerror('no such bullet property', brightRed(val));
  }
  return our.bullet[val];
}
function green(){
  return colored('green').apply(this, arguments);
}
function brightGreen(){
  return colored('bright-green').apply(this, arguments);
}
function blue(){
  return colored('blue').apply(this, arguments);
}
function brightBlue(){
  return colored('blue').apply(this, arguments);
}
function red(){
  return colored('red').apply(this, arguments);
}
function brightRed(){
  return colored('bright-red').apply(this, arguments);
}
function yellow(){
  return colored('yellow').apply(this, arguments);
}
function brightYellow(){
  return colored('bright-yellow').apply(this, arguments);
}
function cyan(){
  return colored('cyan').apply(this, arguments);
}
function brightCyan(){
  return colored('bright-cyan').apply(this, arguments);
}
function magenta(){
  return colored('magenta').apply(this, arguments);
}
function brightMagenta(){
  return colored('bright-magenta').apply(this, arguments);
}
function disableColors(){
  return our.colors.disable = true;
}
function forceColors(){
  return our.colors.force = true;
}
function isTty(){
  return process.stdout.isTTY;
}
function repeatString$(str, n){
  for (var r = ''; n > 0; (n >>= 1) && (str += str)) if (n & 1) r += str;
  return r;
}
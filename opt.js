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
function getopt(args){
  var nopt, path, knownOpts, shortHands, types, arrangedKeys, i$, len$, opt, v, type, opts, parsed, k;
  nopt = require('nopt');
  path == null && (path = require('path'));
  knownOpts = {};
  shortHands = {};
  types = {
    b: Boolean,
    s: String,
    r: Number,
    p: path,
    ms: Array
  };
  arrangedKeys = function(){
    var list, opt, ref$, v;
    list = [];
    for (opt in ref$ = args) {
      v = ref$[opt];
      if (opt.length === 1) {
        list.push(opt);
      } else {
        list.unshift(opt);
      }
    }
    return list;
  }();
  for (i$ = 0, len$ = arrangedKeys.length; i$ < len$; ++i$) {
    opt = arrangedKeys[i$];
    v = args[opt];
    if (isArray(v)) {
      type = v[0], opts = v[1];
    } else {
      type = v;
    }
    fn$();
  }
  parsed = nopt(knownOpts, shortHands, process.argv, 2);
  for (k in parsed) {
    v = parsed[k];
    if (k === 'argv') {
      continue;
    }
    if (!knownOpts[k]) {
      complain("Unknown option:", brightRed(k));
    }
  }
  return parsed;
  function fn$(){
    var long, longType, ref$;
    long = opt;
    longType = (ref$ = types[type]) != null
      ? ref$
      : complain('Invalid type:', brightRed(type));
    knownOpts[long] = longType;
    return shortHands[long.substring(0, 1)] = ['--' + long];
  }
}
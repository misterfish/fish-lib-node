var fs, path, sprintf, test, xtest, config, our;
fs = require('fs');
path = require('path');
sprintf = require('sprintf');
test = global.it;
xtest = global.xit;
config = {
  dir: {
    spec: '/../spec',
    test: '/data/sysSpec'
  }
};
our = {
  target: require('../index'),
  dir: {
    bin: path.dirname(process.argv[1]),
    spec: void 8,
    test: void 8
  }
};
our.dir.spec = path.resolve(our.dir.bin + config.dir.spec);
our.dir.test = path.resolve(our.dir.spec + config.dir.test);
describe('Sys', function(){
  var tgt;
  tgt = our.target;
  tgt.sysSet({
    verbose: false
  });
  beforeEach(function(){
    spyOn(console, 'warn');
    spyOn(console, 'error');
    spyOn(process.stdout, 'write');
    return spyOn(process.stderr, 'write');
  });
  describe('sys-exec, async', function(){
    var cmd;
    cmd = sprintf('ls -Q "%s"/*.txt | xargs cat | wc -w', our.dir.test);
    beforeEach(function(){
      return tgt.sysSet({
        sync: false
      });
    });
    test('usage 1', function(done){
      return tgt.sysExec({
        cmd: cmd,
        oncomplete: function(arg$){
          var out, ok, code, signal, stdout, stderr;
          out = arg$.out, ok = arg$.ok, code = arg$.code, signal = arg$.signal, stdout = arg$.stdout, stderr = arg$.stderr;
          expect(out.trim()).toEqual('12');
          expect(process.stdout.write).not.toHaveBeenCalled();
          expect(out).toEqual(stdout);
          expect(tgt.isStr(stderr)).toEqual(true);
          return done();
        }
      });
    });
    test('usage 1 with exit code', function(done){
      return tgt.sysExec({
        cmd: 'find non/existent/path',
        oncomplete: function(arg$){
          var out, ok, code, signal, stdout, stderr;
          out = arg$.out, ok = arg$.ok, code = arg$.code, signal = arg$.signal, stdout = arg$.stdout, stderr = arg$.stderr;
          expect(code).toEqual(1);
          return done();
        }
      });
    });
    test('usage 1 with exit code and signal', function(done){
      var child;
      child = tgt.sysExec({
        cmd: 'while [ ok ]; do echo a > /dev/null; done',
        oncomplete: function(arg$){
          var out, ok, code, signal, stdout, stderr;
          out = arg$.out, ok = arg$.ok, code = arg$.code, signal = arg$.signal, stdout = arg$.stdout, stderr = arg$.stderr;
          expect(code).toEqual(null);
          expect(signal).toEqual('SIGHUP');
          return done();
        }
      });
      return child.kill('SIGHUP');
    });
    test('usage 3', function(done){
      return tgt.sysExec(cmd, {
        oncomplete: function(arg$){
          var out;
          out = arg$.out;
          expect(out.trim()).toEqual('12');
          expect(process.stdout.write).not.toHaveBeenCalled();
          return done();
        }
      });
    });
    test('usage 8', function(done){
      return tgt.sysExec(cmd, function(arg$){
        var out;
        out = arg$.out;
        expect(out.trim()).toEqual('12');
        expect(process.stdout.write).not.toHaveBeenCalled();
        return done();
      });
    });
    test('usage 9', function(done){
      return tgt.sysExec(cmd, {
        verbose: false
      }, function(arg$){
        var out;
        out = arg$.out;
        expect(out.trim()).toEqual('12');
        expect(process.stdout.write).not.toHaveBeenCalled();
        return done();
      });
    });
    test('usage 9 (verbose)', function(done){
      return tgt.sysExec(cmd, {
        verbose: true
      }, function(arg$){
        var out;
        out = arg$.out;
        expect(out.trim()).toEqual('12');
        expect(process.stdout.write).toHaveBeenCalled();
        return done();
      });
    });
    test('usage 10', function(done){
      return tgt.sysExec('ls', '-1', '-Q', sprintf('"%s"/*.txt', our.dir.test), '|', 'xargs', 'cat', '|', 'wc', '-w', function(arg$){
        var out;
        out = arg$.out;
        expect(out.trim()).toEqual('12');
        expect(process.stdout.write).not.toHaveBeenCalled();
        return done();
      });
    });
    return test('usage 11', function(done){
      return tgt.sysExec('ls', '-Q', sprintf('"%s"/*.txt', our.dir.test), '|', 'xargs', 'cat', '|', 'wc', '-w', {
        verbose: true
      }, function(arg$){
        var out;
        out = arg$.out;
        expect(out.trim()).toEqual('12');
        expect(process.stdout.write).toHaveBeenCalled();
        return done();
      });
    });
  });
  return describe('sys-exec, sync', function(){
    var cmd;
    cmd = sprintf('ls -Q "%s"/*.txt | xargs cat | wc -w', our.dir.test);
    beforeEach(function(){
      return tgt.sysSet({
        sync: true
      });
    });
    test('usage 1, function form', function(){
      return tgt.sysExec({
        cmd: cmd,
        oncomplete: function(arg$){
          var out, ok, code, signal, stdout, stderr;
          out = arg$.out, ok = arg$.ok, code = arg$.code, signal = arg$.signal, stdout = arg$.stdout, stderr = arg$.stderr;
          expect(out.trim()).toEqual('12');
          expect(process.stdout.write).not.toHaveBeenCalled();
          expect(out).toEqual(stdout);
          return expect(tgt.isStr(stderr)).toEqual(true);
        }
      });
    });
    test('usage 1, return form', function(){
      var ref$, out, ok, code, signal, stdout, stderr;
      ref$ = tgt.sysExec({
        cmd: cmd
      }), out = ref$.out, ok = ref$.ok, code = ref$.code, signal = ref$.signal, stdout = ref$.stdout, stderr = ref$.stderr;
      expect(out.trim()).toEqual('12');
      expect(process.stdout.write).not.toHaveBeenCalled();
      expect(out).toEqual(stdout);
      return expect(tgt.isStr(stderr)).toEqual(true);
    });
    test('usage 1 with exit code', function(done){
      return tgt.sysExec({
        cmd: 'find non/existent/path 2>/dev/null',
        oncomplete: function(arg$){
          var out, ok, code, signal, stdout, stderr;
          out = arg$.out, ok = arg$.ok, code = arg$.code, signal = arg$.signal, stdout = arg$.stdout, stderr = arg$.stderr;
          expect(code).toEqual(1);
          return done();
        }
      });
    });
    test('usage 2', function(){
      var ref$, out, ok, code, signal, stdout, stderr;
      ref$ = tgt.sysExec(cmd), out = ref$.out, ok = ref$.ok, code = ref$.code, signal = ref$.signal, stdout = ref$.stdout, stderr = ref$.stderr;
      expect(out.trim()).toEqual('12');
      return expect(process.stdout.write).not.toHaveBeenCalled();
    });
    test('usage 3', function(){
      var ref$, out, ok, code, signal, stdout, stderr;
      ref$ = tgt.sysExec(cmd, {
        verbose: true
      }), out = ref$.out, ok = ref$.ok, code = ref$.code, signal = ref$.signal, stdout = ref$.stdout, stderr = ref$.stderr;
      expect(out.trim()).toEqual('12');
      return expect(process.stdout.write).toHaveBeenCalled();
    });
    test('usage 8', function(){
      return tgt.sysExec(cmd, {
        oncomplete: function(arg$){
          var out, ok, code, signal, stdout, stderr;
          out = arg$.out, ok = arg$.ok, code = arg$.code, signal = arg$.signal, stdout = arg$.stdout, stderr = arg$.stderr;
          expect(out.trim()).toEqual('12');
          return expect(process.stdout.write).not.toHaveBeenCalled();
        }
      });
    });
    test('usage 9', function(){
      return tgt.sysExec(cmd, {
        verbose: true,
        oncomplete: function(arg$){
          var out, ok, code, signal, stdout, stderr;
          out = arg$.out, ok = arg$.ok, code = arg$.code, signal = arg$.signal, stdout = arg$.stdout, stderr = arg$.stderr;
          expect(out.trim()).toEqual('12');
          return expect(process.stdout.write).toHaveBeenCalled();
        }
      });
    });
    test('usage 10', function(){
      return tgt.sysExec('ls', '-1', '-Q', sprintf('"%s"/*.txt', our.dir.test), '|', 'xargs', 'cat', '|', 'wc', '-w', function(arg$){
        var out;
        out = arg$.out;
        expect(out.trim()).toEqual('12');
        return expect(process.stdout.write).not.toHaveBeenCalled();
      });
    });
    test('usage 11', function(){
      return tgt.sysExec('ls', '-Q', sprintf('"%s"/*.txt', our.dir.test), '|', 'xargs', 'cat', '|', 'wc', '-w', {
        verbose: true
      }, function(arg$){
        var out;
        out = arg$.out;
        expect(out.trim()).toEqual('12');
        return expect(process.stdout.write).toHaveBeenCalled();
      });
    });
    test('usage 12', function(){
      var ref$, out, ok, code, signal, stdout, stderr;
      ref$ = tgt.sysExec('ls', '-Q', sprintf('"%s"/*.txt', our.dir.test), '|', 'xargs', 'cat', '|', 'wc', '-w'), out = ref$.out, ok = ref$.ok, code = ref$.code, signal = ref$.signal, stdout = ref$.stdout, stderr = ref$.stderr;
      expect(out.trim()).toEqual('12');
      return expect(process.stdout.write).not.toHaveBeenCalled();
    });
    return test('usage 13', function(){
      var ref$, out, ok, code, signal, stdout, stderr;
      ref$ = tgt.sysExec('ls', '-Q', sprintf('"%s"/*.txt', our.dir.test), '|', 'xargs', 'cat', '|', 'wc', '-w', {
        verbose: true
      }), out = ref$.out, ok = ref$.ok, code = ref$.code, signal = ref$.signal, stdout = ref$.stdout, stderr = ref$.stderr;
      expect(out.trim()).toEqual('12');
      return expect(process.stdout.write).toHaveBeenCalled();
    });
  });
});
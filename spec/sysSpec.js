var fs, path, sprintf, split, test, xtest, config, our;
fs = require('fs');
path = require('path');
sprintf = require('sprintf');
split = require('prelude-ls').split;
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
    test('usage 1 with exit code and stderr', function(done){
      return tgt.sysExec({
        cmd: 'find non/existent/path',
        errPrint: false,
        oncomplete: function(arg$){
          var out, ok, code, signal, stdout, stderr;
          out = arg$.out, ok = arg$.ok, code = arg$.code, signal = arg$.signal, stdout = arg$.stdout, stderr = arg$.stderr;
          expect(code).not.toEqual(0);
          expect(/no\ssuch\sfile/i.exec(stderr)).not.toBe(null);
          return done();
        }
      });
    });
    test('usage 1 with non-existent cmd', function(done){
      return tgt.sysExec({
        cmd: './non-existent-cmd',
        errPrint: false,
        oncomplete: function(arg$){
          var out, ok, code, signal, stdout, stderr;
          out = arg$.out, ok = arg$.ok, code = arg$.code, signal = arg$.signal, stdout = arg$.stdout, stderr = arg$.stderr;
          expect(/not\sfound/i.exec(stderr)).not.toBe(null);
          expect(code).not.toEqual(0);
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
    test('usage 11', function(done){
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
    return test('usage 13', function(done){
      return tgt.sysExec('ls', '-Q', sprintf('"%s"/*.txt', our.dir.test), '|', 'xargs', 'cat', '|', 'wc', '-w', {
        verbose: true,
        oncomplete: function(arg$){
          var out;
          out = arg$.out;
          expect(out.trim()).toEqual('12');
          expect(process.stdout.write).toHaveBeenCalled();
          return done();
        }
      });
    });
  });
  describe('sys-exec, sync', function(){
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
        cmd: 'find non/existent/path',
        errPrint: false,
        oncomplete: function(arg$){
          var out, ok, code, signal, stdout, stderr;
          out = arg$.out, ok = arg$.ok, code = arg$.code, signal = arg$.signal, stdout = arg$.stdout, stderr = arg$.stderr;
          expect(/no\ssuch\sfile/i.exec(stderr)).not.toBe(null);
          expect(code).not.toEqual(0);
          return done();
        }
      });
    });
    test('usage 1 with non-existent cmd', function(done){
      return tgt.sysExec({
        cmd: './non-existent-cmd',
        errPrint: false,
        oncomplete: function(arg$){
          var out, ok, code, signal, stdout, stderr;
          out = arg$.out, ok = arg$.ok, code = arg$.code, signal = arg$.signal, stdout = arg$.stdout, stderr = arg$.stderr;
          expect(/not\sfound/i.exec(stderr)).not.toBe(null);
          expect(code).not.toEqual(0);
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
      return tgt.sysExec(cmd, function(arg$){
        var out, ok, code, signal, stdout, stderr;
        out = arg$.out, ok = arg$.ok, code = arg$.code, signal = arg$.signal, stdout = arg$.stdout, stderr = arg$.stderr;
        expect(out.trim()).toEqual('12');
        return expect(process.stdout.write).not.toHaveBeenCalled();
      });
    });
    test('usage 9', function(){
      return tgt.sysExec(cmd, {
        verbose: true
      }, function(arg$){
        var out, ok, code, signal, stdout, stderr;
        out = arg$.out, ok = arg$.ok, code = arg$.code, signal = arg$.signal, stdout = arg$.stdout, stderr = arg$.stderr;
        expect(out.trim()).toEqual('12');
        return expect(process.stdout.write).toHaveBeenCalled();
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
  describe('sys-spawn, async', function(){
    var cmd, arg1, arg2, args;
    cmd = 'cat';
    arg1 = '-E';
    arg2 = sprintf("%s/3 words.txt", our.dir.test);
    args = [arg1, arg2];
    beforeEach(function(){
      return tgt.sysSet({
        sync: false
      });
    });
    test('usage 1', function(done){
      return tgt.sysSpawn({
        cmd: 'true',
        oncomplete: function(arg$){
          var out, ok, code, signal, stdout, stderr;
          out = arg$.out, ok = arg$.ok, code = arg$.code, signal = arg$.signal, stdout = arg$.stdout, stderr = arg$.stderr;
          expect(out.trim()).toEqual('');
          expect(process.stdout.write).not.toHaveBeenCalled();
          expect(code).toEqual(0);
          expect(out).toEqual(stdout);
          expect(tgt.isStr(stderr)).toEqual(true);
          return done();
        }
      });
    });
    test('usage 1 with non-existent cmd', function(done){
      return tgt.sysSpawn({
        cmd: './non-existent-cmd',
        errPrint: false,
        oncomplete: function(arg$){
          var out, ok, code, signal, stdout, stderr;
          out = arg$.out, ok = arg$.ok, code = arg$.code, signal = arg$.signal, stdout = arg$.stdout, stderr = arg$.stderr;
          expect(code).toEqual(void 8);
          expect(stderr).toEqual('');
          return done();
        }
      });
    });
    test('usage 3', function(done){
      return tgt.sysSpawn('true', {
        oncomplete: function(arg$){
          var out, ok, code, signal, stdout, stderr;
          out = arg$.out, ok = arg$.ok, code = arg$.code, signal = arg$.signal, stdout = arg$.stdout, stderr = arg$.stderr;
          expect(out.trim()).toEqual('');
          expect(process.stdout.write).not.toHaveBeenCalled();
          expect(code).toEqual(0);
          return done();
        }
      });
    });
    test('usage 3, verbose', function(done){
      return tgt.sysSpawn('true', {
        verbose: true,
        oncomplete: function(arg$){
          var out;
          out = arg$.out;
          expect(out.trim()).toEqual('');
          expect(process.stdout.write).toHaveBeenCalled();
          return done();
        }
      });
    });
    test('usage 5', function(done){
      return tgt.sysSpawn(cmd, args, {
        verbose: true,
        oncomplete: function(arg$){
          var out;
          out = arg$.out;
          expect(out.trim()).toEqual('one two$\n$\nthree$');
          expect(process.stdout.write).toHaveBeenCalled();
          return done();
        }
      });
    });
    test('usage 5 with exit code', function(done){
      return tgt.sysSpawn('find', ['./non/existent'], {
        oncomplete: function(arg$){
          var out, code;
          out = arg$.out, code = arg$.code;
          expect(out).toEqual('');
          expect(code).not.toEqual(0);
          expect(process.stdout.write).not.toHaveBeenCalled();
          return done();
        }
      });
    });
    test('usage 5 with exit code and signal', function(done){
      var child;
      child = tgt.sysSpawn('yes', [], {
        verbose: true,
        oncomplete: function(arg$){
          var out, code, signal;
          out = arg$.out, code = arg$.code, signal = arg$.signal;
          expect(process.stdout.write).toHaveBeenCalled();
          expect(code).toEqual(null);
          expect(signal).toEqual('SIGHUP');
          return done();
        }
      });
      return child.kill('SIGHUP');
    });
    test('usage 6', function(done){
      return tgt.sysSpawn(cmd, args, function(arg$){
        var out;
        out = arg$.out;
        expect(out.trim()).toEqual('one two$\n$\nthree$');
        expect(process.stdout.write).not.toHaveBeenCalled();
        return done();
      });
    });
    test('usage 7', function(done){
      return tgt.sysSpawn(cmd, args, {
        verbose: true
      }, function(arg$){
        var out;
        out = arg$.out;
        expect(out.trim()).toEqual('one two$\n$\nthree$');
        expect(process.stdout.write).toHaveBeenCalled();
        return done();
      });
    });
    test('usage 8', function(done){
      return tgt.sysSpawn('true', function(arg$){
        var out;
        out = arg$.out;
        expect(out.trim()).toEqual('');
        expect(process.stdout.write).not.toHaveBeenCalled();
        return done();
      });
    });
    test('usage 9', function(done){
      return tgt.sysSpawn('true', {
        verbose: true
      }, function(arg$){
        var out;
        out = arg$.out;
        expect(out.trim()).toEqual('');
        expect(process.stdout.write).toHaveBeenCalled();
        return done();
      });
    });
    test('usage 10', function(done){
      return tgt.sysSpawn(cmd, arg1, arg2, function(arg$){
        var out;
        out = arg$.out;
        expect(out.trim()).toEqual('one two$\n$\nthree$');
        expect(process.stdout.write).not.toHaveBeenCalled();
        return done();
      });
    });
    test('usage 11', function(done){
      return tgt.sysSpawn(cmd, arg1, arg2, {
        verbose: true
      }, function(arg$){
        var out;
        out = arg$.out;
        expect(out.trim()).toEqual('one two$\n$\nthree$');
        expect(process.stdout.write).toHaveBeenCalled();
        return done();
      });
    });
    test('usage 13', function(done){
      return tgt.sysSpawn(cmd, arg1, arg2, {
        verbose: true,
        oncomplete: function(arg$){
          var out;
          out = arg$.out;
          expect(out.trim()).toEqual('one two$\n$\nthree$');
          expect(process.stdout.write).toHaveBeenCalled();
          return done();
        }
      });
    });
    test('output', function(done){
      var file;
      file = 'spec/sysSpec.ls';
      return tgt.sysSpawn('cat', [file], {
        oncomplete: function(arg$){
          var out, code, readOk, e;
          out = arg$.out, code = arg$.code;
          readOk = void 8;
          try {
            expect(out).toEqual(fs.readFileSync(file).toString());
            readOk = true;
          } catch (e$) {
            e = e$;
          }
          expect(readOk).toEqual(true);
          return done();
        }
      });
    });
    return test('output split', function(done){
      var file;
      file = 'spec/sysSpec.ls';
      return tgt.sysSpawn('cat', [file], {
        outSplit: true,
        outSplitRemoveTrailingElement: false,
        oncomplete: function(arg$){
          var out, code, readOk, e;
          out = arg$.out, code = arg$.code;
          readOk = void 8;
          try {
            expect(out).toEqual(split('\n', fs.readFileSync(file).toString()));
            readOk = true;
          } catch (e$) {
            e = e$;
          }
          expect(readOk).toEqual(true);
          return done();
        }
      });
    });
  });
  return describe('sys-spawn, sync', function(){
    var cmd, arg1, arg2, args;
    cmd = 'cat';
    arg1 = '-E';
    arg2 = sprintf("%s/3 words.txt", our.dir.test);
    args = [arg1, arg2];
    beforeEach(function(){
      return tgt.sysSet({
        sync: true
      });
    });
    test('usage 1, function form', function(){
      return tgt.sysSpawn({
        cmd: 'true',
        oncomplete: function(arg$){
          var out, ok, code, signal, stdout, stderr;
          out = arg$.out, ok = arg$.ok, code = arg$.code, signal = arg$.signal, stdout = arg$.stdout, stderr = arg$.stderr;
          expect(out.trim()).toEqual('');
          expect(process.stdout.write).not.toHaveBeenCalled();
          expect(code).toEqual(0);
          expect(out).toEqual(stdout);
          return expect(stderr).toBe(null);
        }
      });
    });
    test('usage 1, return form', function(){
      var ref$, out, ok, code, signal, stdout, stderr;
      ref$ = tgt.sysSpawn({
        cmd: 'true'
      }), out = ref$.out, ok = ref$.ok, code = ref$.code, signal = ref$.signal, stdout = ref$.stdout, stderr = ref$.stderr;
      expect(out.trim()).toEqual('');
      expect(process.stdout.write).not.toHaveBeenCalled();
      expect(code).toEqual(0);
      expect(out).toEqual(stdout);
      return expect(stderr).toBe(null);
    });
    test('usage 1 with non-existent cmd', function(){
      return tgt.sysSpawn({
        cmd: './non-existent-cmd',
        errPrint: false,
        oncomplete: function(arg$){
          var out, ok, code, signal, stdout, stderr;
          out = arg$.out, ok = arg$.ok, code = arg$.code, signal = arg$.signal, stdout = arg$.stdout, stderr = arg$.stderr;
          return expect(code).toEqual(null);
        }
      });
    });
    test('usage 3', function(){
      return tgt.sysSpawn('true', {
        oncomplete: function(arg$){
          var out, ok, code, signal, stdout, stderr;
          out = arg$.out, ok = arg$.ok, code = arg$.code, signal = arg$.signal, stdout = arg$.stdout, stderr = arg$.stderr;
          expect(out.trim()).toEqual('');
          expect(process.stdout.write).not.toHaveBeenCalled();
          return expect(code).toEqual(0);
        }
      });
    });
    test('usage 3, verbose', function(){
      return tgt.sysSpawn('true', {
        verbose: true,
        oncomplete: function(arg$){
          var out;
          out = arg$.out;
          expect(out.trim()).toEqual('');
          return expect(process.stdout.write).toHaveBeenCalled();
        }
      });
    });
    test('usage 5', function(){
      return tgt.sysSpawn(cmd, args, {
        verbose: true,
        oncomplete: function(arg$){
          var out;
          out = arg$.out;
          expect(out.trim()).toEqual('one two$\n$\nthree$');
          return expect(process.stdout.write).toHaveBeenCalled();
        }
      });
    });
    test('usage 5 with exit code', function(){
      return tgt.sysSpawn('find', ['./non/existent'], {
        errPrint: false,
        oncomplete: function(arg$){
          var out, code, stderr;
          out = arg$.out, code = arg$.code, stderr = arg$.stderr;
          expect(out).toEqual('');
          expect(code).not.toEqual(0);
          expect(code).not.toEqual(null);
          expect(process.stdout.write).not.toHaveBeenCalled();
          return expect(/no\ssuch\sfile/i.exec(stderr)).not.toBe(null);
        }
      });
    });
    test('usage 6', function(){
      return tgt.sysSpawn(cmd, args, function(arg$){
        var out;
        out = arg$.out;
        expect(out.trim()).toEqual('one two$\n$\nthree$');
        return expect(process.stdout.write).not.toHaveBeenCalled();
      });
    });
    test('usage 7', function(){
      return tgt.sysSpawn(cmd, args, {
        verbose: true
      }, function(arg$){
        var out;
        out = arg$.out;
        expect(out.trim()).toEqual('one two$\n$\nthree$');
        return expect(process.stdout.write).toHaveBeenCalled();
      });
    });
    test('usage 8', function(){
      return tgt.sysSpawn('true', function(arg$){
        var out;
        out = arg$.out;
        expect(out.trim()).toEqual('');
        return expect(process.stdout.write).not.toHaveBeenCalled();
      });
    });
    test('usage 9', function(){
      return tgt.sysSpawn('true', {
        verbose: true
      }, function(arg$){
        var out;
        out = arg$.out;
        expect(out.trim()).toEqual('');
        return expect(process.stdout.write).toHaveBeenCalled();
      });
    });
    test('usage 10', function(){
      return tgt.sysSpawn(cmd, arg1, arg2, function(arg$){
        var out;
        out = arg$.out;
        expect(out.trim()).toEqual('one two$\n$\nthree$');
        return expect(process.stdout.write).not.toHaveBeenCalled();
      });
    });
    test('usage 11', function(){
      return tgt.sysSpawn(cmd, arg1, arg2, {
        verbose: true
      }, function(arg$){
        var out;
        out = arg$.out;
        expect(out.trim()).toEqual('one two$\n$\nthree$');
        return expect(process.stdout.write).toHaveBeenCalled();
      });
    });
    return test('usage 13', function(){
      return tgt.sysSpawn(cmd, arg1, arg2, {
        verbose: true,
        oncomplete: function(arg$){
          var out;
          out = arg$.out;
          expect(out.trim()).toEqual('one two$\n$\nthree$');
          return expect(process.stdout.write).toHaveBeenCalled();
        }
      });
    });
  });
});
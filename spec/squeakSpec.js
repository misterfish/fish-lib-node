var test, xtest, our;
test = global.it;
xtest = global.xit;
our = {
  target: require('../index')
};
test = global.it;
xtest = global.xit;
describe('Squeak', function(){
  var tgt;
  tgt = our.target;
  describe('iwarn', function(){
    var doTest, warning, opts;
    doTest = void 8;
    warning = void 8;
    opts = {};
    afterEach(function(){
      spyOn(console, 'warn').and.callFake(function(theWarning){
        return expect(doTest(theWarning)).toEqual(true);
      });
      tgt.iwarn(warning, opts);
      return expect(console.warn).toHaveBeenCalled();
    });
    test('says "Internal warning"', function(){
      warning = "everything's broke";
      return doTest = function(theWarning){
        var ok;
        ok = /Internal\s+warning/.exec(theWarning);
        return ok !== null;
      };
    });
    test('text + location', function(){
      warning = "everything's broke";
      return doTest = function(theWarning){
        var ok;
        ok = /everything's\sbroke\s\(.+?:.+?:.+\)/.exec(theWarning);
        return ok !== null;
      };
    });
    test('has stack trace', function(){
      warning = "everything's broke";
      return doTest = function(theWarning){
        var ok;
        ok = /at\spcomplain\s\(.+:\d+:\d+\)/.exec(theWarning);
        return ok !== null;
      };
    });
    return test('has no stack trace', function(){
      opts = {
        printStackTrace: false
      };
      warning = "everything's broke";
      return doTest = function(theWarning){
        var ok;
        ok = /at\spcomplain\s\(.+:\d+:\d+\)/.exec(theWarning);
        return ok === null;
      };
    });
  });
  describe('warn', function(){
    var doTest, warning, opts;
    doTest = void 8;
    warning = void 8;
    opts = {};
    afterEach(function(){
      spyOn(console, 'warn').and.callFake(function(theWarning){
        return expect(doTest(theWarning)).toEqual(true);
      });
      tgt.warn(warning, opts);
      return expect(console.warn).toHaveBeenCalled();
    });
    test('says "Warning"', function(){
      warning = "everything's broke";
      return doTest = function(theWarning){
        var ok;
        ok = /Warning/.exec(theWarning);
        return ok !== null;
      };
    });
    test('text + no location', function(){
      warning = "everything's broke";
      return doTest = function(theWarning){
        var ok;
        ok = /everything's\sbroke\s*$/.exec(theWarning);
        return ok !== null;
      };
    });
    test('has no stack trace', function(){
      warning = "everything's broke";
      return doTest = function(theWarning){
        var ok;
        ok = /at\spcomplain\s\(.+:\d+:\d+\)/.exec(theWarning);
        return ok === null;
      };
    });
    return test('has stack trace', function(){
      warning = "everything's broke";
      opts = {
        printStackTrace: true
      };
      return doTest = function(theWarning){
        var ok;
        ok = /at\spcomplain\s\(.+:\d+:\d+\)/.exec(theWarning);
        return ok !== null;
      };
    });
  });
  describe('squeak-set', function(){
    test('force stack trace on warn', function(){
      var doTest;
      tgt.squeakSet({
        printStackTrace: true
      });
      doTest = function(theWarning){
        var ok;
        ok = /at\spcomplain\s\(.+:\d+:\d+\)/.exec(theWarning);
        return ok !== null;
      };
      spyOn(console, 'warn').and.callFake(function(theWarning){
        return expect(doTest(theWarning)).toEqual(true);
      });
      return tgt.warn('a warning');
    });
    test('force no stack trace on iwarn', function(){
      var doTest;
      tgt.squeakSet({
        printStackTrace: false
      });
      doTest = function(theWarning){
        var ok;
        ok = /at\spcomplain\s\(.+:\d+:\d+\)/.exec(theWarning);
        return ok === null;
      };
      spyOn(console, 'warn').and.callFake(function(theWarning){
        return expect(doTest(theWarning)).toEqual(true);
      });
      return tgt.iwarn('a warning');
    });
    return test('stack trace back to default on iwarn', function(){
      var doTest;
      tgt.squeakSet({
        printStackTrace: void 8
      });
      doTest = function(theWarning){
        var ok;
        ok = /at\spcomplain\s\(.+:\d+:\d+\)/.exec(theWarning);
        return ok !== null;
      };
      spyOn(console, 'warn').and.callFake(function(theWarning){
        return expect(doTest(theWarning)).toEqual(true);
      });
      return tgt.iwarn('a warning');
    });
  });
  describe('complain property', function(){
    beforeEach(function(){
      return spyOn(console, 'warn');
    });
    test('complain = warn', function(){
      tgt.squeakSet({
        complain: 'warn'
      });
      spyOn(process, 'exit');
      tgt.complain();
      expect(process.exit).not.toHaveBeenCalled();
      tgt.icomplain();
      return expect(process.exit).not.toHaveBeenCalled();
    });
    return test('complain = error', function(){
      tgt.squeakSet({
        complain: 'error'
      });
      spyOn(process, 'exit');
      tgt.complain();
      expect(process.exit).toHaveBeenCalled();
      tgt.icomplain();
      return expect(process.exit).toHaveBeenCalled();
    });
  });
  describe('error property', function(){
    beforeEach(function(){
      spyOn(console, 'warn');
      return spyOn(process, 'exit');
    });
    test('error = fatal', function(){
      tgt.squeakSet({
        error: 'fatal'
      });
      tgt.error();
      return expect(process.exit).toHaveBeenCalled();
    });
    test('error = throw', function(){
      var threw, e;
      tgt.squeakSet({
        error: 'throw'
      });
      threw = void 8;
      try {
        tgt.error();
      } catch (e$) {
        e = e$;
        threw = true;
      }
      expect(process.exit).not.toHaveBeenCalled();
      return expect(threw).toBe(true);
    });
    test('error = allow', function(){
      var threw, e;
      tgt.squeakSet({
        error: 'allow'
      });
      threw = void 8;
      try {
        tgt.error();
      } catch (e$) {
        e = e$;
        threw = true;
      }
      expect(process.exit).not.toHaveBeenCalled();
      return expect(threw).not.toBe(true);
    });
    return test('error = unknown value -> fatal', function(){
      tgt.squeakSet({
        error: 'xxx'
      });
      tgt.error();
      return expect(process.exit).toHaveBeenCalled();
    });
  });
  describe('api-error property', function(){
    beforeEach(function(){
      spyOn(console, 'warn');
      return spyOn(process, 'exit');
    });
    test('api-error = fatal', function(){
      tgt.squeakSet({
        apiError: 'fatal'
      });
      tgt.aerror();
      return expect(process.exit).toHaveBeenCalled();
    });
    test('api-error = throw', function(){
      var threw, e;
      tgt.squeakSet({
        apiError: 'throw'
      });
      threw = void 8;
      try {
        tgt.aerror();
      } catch (e$) {
        e = e$;
        threw = true;
      }
      expect(process.exit).not.toHaveBeenCalled();
      return expect(threw).toBe(true);
    });
    test('api-error = allow', function(){
      var threw, e;
      tgt.squeakSet({
        apiError: 'allow'
      });
      threw = void 8;
      try {
        tgt.aerror();
      } catch (e$) {
        e = e$;
        threw = true;
      }
      expect(process.exit).not.toHaveBeenCalled();
      return expect(threw).not.toBe(true);
    });
    return test('api-error = unknown value -> fatal', function(){
      tgt.squeakSet({
        apiError: 'xxx'
      });
      tgt.aerror();
      return expect(process.exit).toHaveBeenCalled();
    });
  });
  describe('ierror', function(){
    var doTest, warning, opts;
    doTest = void 8;
    warning = void 8;
    opts = {};
    beforeEach(function(){
      return spyOn(process, 'exit');
    });
    afterEach(function(){
      spyOn(console, 'warn').and.callFake(function(theWarning){
        return expect(doTest(theWarning)).toEqual(true);
      });
      tgt.ierror(warning, opts);
      expect(console.warn).toHaveBeenCalled();
      return expect(process.exit).toHaveBeenCalled();
    });
    test('says "Internal error"', function(){
      warning = "everything's broke";
      return doTest = function(theWarning){
        var ok;
        ok = /Internal\s+error/.exec(theWarning);
        return ok !== null;
      };
    });
    test('text + location', function(){
      warning = "everything's broke";
      return doTest = function(theWarning){
        var ok;
        ok = /everything's\sbroke\s\(.+?:.+?:.+\)/.exec(theWarning);
        return ok !== null;
      };
    });
    test('has stack trace', function(){
      warning = "everything's broke";
      return doTest = function(theWarning){
        var ok;
        ok = /at\spcomplain\s\(.+:\d+:\d+\)/.exec(theWarning);
        return ok !== null;
      };
    });
    return test('has no stack trace', function(){
      opts = {
        printStackTrace: false
      };
      warning = "everything's broke";
      return doTest = function(theWarning){
        var ok;
        ok = /at\spcomplain\s\(.+:\d+:\d+\)/.exec(theWarning);
        return ok === null;
      };
    });
  });
  describe('error', function(){
    var doTest, warning, opts;
    doTest = void 8;
    warning = void 8;
    opts = {};
    beforeEach(function(){
      return spyOn(process, 'exit');
    });
    afterEach(function(){
      spyOn(console, 'warn').and.callFake(function(theWarning){
        return expect(doTest(theWarning)).toEqual(true);
      });
      tgt.error(warning, opts);
      expect(console.warn).toHaveBeenCalled();
      return expect(process.exit).toHaveBeenCalled();
    });
    test('says "Error"', function(){
      warning = "everything's broke";
      return doTest = function(theWarning){
        var ok;
        ok = /Error/.exec(theWarning);
        return ok !== null;
      };
    });
    test('text + no location', function(){
      warning = "everything's broke";
      return doTest = function(theWarning){
        var ok;
        ok = /everything's\sbroke\s*$/.exec(theWarning);
        return ok !== null;
      };
    });
    test('has no stack trace', function(){
      warning = "everything's broke";
      return doTest = function(theWarning){
        var ok;
        ok = /at\spcomplain\s\(.+:\d+:\d+\)/.exec(theWarning);
        return ok === null;
      };
    });
    return test('has stack trace', function(){
      warning = "everything's broke";
      opts = {
        printStackTrace: true
      };
      return doTest = function(theWarning){
        var ok;
        ok = /at\spcomplain\s\(.+:\d+:\d+\)/.exec(theWarning);
        return ok !== null;
      };
    });
  });
  describe('error with exit code', function(){
    return test('code 42', function(){
      spyOn(console, 'warn');
      spyOn(process, 'exit');
      tgt.error('', {
        code: 42
      });
      return expect(process.exit).toHaveBeenCalledWith(42);
    });
  });
  return describe('aerror', function(){
    var doTest, warning, opts;
    doTest = void 8;
    warning = void 8;
    opts = {};
    beforeEach(function(){
      return spyOn(process, 'exit');
    });
    afterEach(function(){
      spyOn(console, 'warn').and.callFake(function(theWarning){
        return expect(doTest(theWarning)).toEqual(true);
      });
      tgt.aerror(warning, opts);
      expect(console.warn).toHaveBeenCalled();
      return expect(process.exit).toHaveBeenCalled();
    });
    test('says "Api error"', function(){
      warning = "everything's broke";
      return doTest = function(theWarning){
        var ok;
        ok = /Api\s+error/.exec(theWarning);
        return ok !== null;
      };
    });
    test('text + location', function(){
      warning = "everything's broke";
      return doTest = function(theWarning){
        var ok;
        ok = /everything's\sbroke\s\(.+?:.+?:.+\)/.exec(theWarning);
        return ok !== null;
      };
    });
    test('has stack trace', function(){
      warning = "everything's broke";
      return doTest = function(theWarning){
        var ok;
        ok = /at\spcomplain\s\(.+:\d+:\d+\)/.exec(theWarning);
        return ok !== null;
      };
    });
    return test('has no stack trace', function(){
      opts = {
        printStackTrace: false
      };
      warning = "everything's broke";
      return doTest = function(theWarning){
        var ok;
        ok = /at\spcomplain\s\(.+:\d+:\d+\)/.exec(theWarning);
        return ok === null;
      };
    });
  });
});
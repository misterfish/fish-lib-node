var test, xtest, our;
test = global.it;
xtest = global.xit;
our = {
  target: require('../squeak')
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
  return describe('squeak-set', function(){
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
});
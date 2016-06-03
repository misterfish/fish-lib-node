var squeak, test, xtest, our;
squeak = require('../squeak');
test = global.it;
xtest = global.xit;
our = {
  target: require('../index')
};
test = global.it;
xtest = global.xit;
describe('Types', function(){
  var tgt;
  tgt = our.target;
  describe('ok', function(){
    var func, obj;
    func = tgt.ok;
    test('undefined (test for defined) -> not ok', function(){
      return expect(func(void 8)).toEqual(false);
    });
    test('1 (test for defined) -> ok', function(){
      return expect(func(1)).toEqual(true);
    });
    obj = {
      xxx: 'yyy'
    };
    test("'n' routes through isNumber()", function(){
      return expect(func(obj, 'n')).toEqual(tgt.isNumber(obj));
    });
    test("'ns' routes through isNumberStrict()", function(){
      return expect(func(obj, 'ns')).toEqual(tgt.isNumberStrict(obj));
    });
    test("'i' routes through isInteger()", function(){
      return expect(func(obj, 'i')).toEqual(tgt.isInteger(obj));
    });
    test("'is' routes through isIntegerStrict()", function(){
      return expect(func(obj, 'is')).toEqual(tgt.isIntegerStrict(obj));
    });
    test("'ip' routes through isIntegerPositive()", function(){
      return expect(func(obj, 'ip')).toEqual(tgt.isIntegerPositive(obj));
    });
    test("'ips' routes through isIntegerPositiveStrict()", function(){
      return expect(func(obj, 'ips')).toEqual(tgt.isIntegerPositiveStrict(obj));
    });
    test("'iN' routes through isIntegerNonNegative()", function(){
      return expect(func(obj, 'iN')).toEqual(tgt.isIntegerNonNegative(obj));
    });
    test("'iNs' routes through isIntegerNonNegativeStrict()", function(){
      return expect(func(obj, 'iNs')).toEqual(tgt.isIntegerNonNegativeStrict(obj));
    });
    test("'s' routes through isString()", function(){
      return expect(func(obj, 's')).toEqual(tgt.isString(obj));
    });
    test("'o' routes through isObject()", function(){
      return expect(func(obj, 'o')).toEqual(tgt.isObject(obj));
    });
    test("'a' routes through isArray()", function(){
      return expect(func(obj, 'a')).toEqual(tgt.isArray(obj));
    });
    test("'f' routes through isFunction()", function(){
      return expect(func(obj, 'f')).toEqual(tgt.isFunction(obj));
    });
    return test("invalid arg", function(){
      var stubbed;
      stubbed = stubIwarn();
      expect(func(obj, 'xxx')).toEqual(void 8);
      expect(stubbed.called).toEqual(true);
      return unstubIwarn(stubbed);
    });
  });
  describe('defined', function(){
    var func;
    func = tgt.defined;
    test('undefined', function(){
      return expect(func(void 8)).toEqual(false);
    });
    test('1', function(){
      return expect(func(1)).toEqual(true);
    });
    test('"1"', function(){
      return expect(func("1")).toEqual(true);
    });
    test('{}', function(){
      return expect(func({})).toEqual(true);
    });
    return test('[]', function(){
      return expect(func([])).toEqual(true);
    });
  });
  describe('ofNumber', function(){
    var func;
    func = tgt.ofNumber;
    test('"x" is not', function(){
      return expect(func('x')).toEqual(false);
    });
    test('3 is', function(){
      return expect(func(3)).toEqual(true);
    });
    test('3.1 is', function(){
      return expect(func(3.1)).toEqual(true);
    });
    test('"3" is not', function(){
      return expect(func('3')).toEqual(false);
    });
    test('"3.1" is not', function(){
      return expect(func('3.1')).toEqual(false);
    });
    return test('undefined is not', function(){
      return expect(func(void 8)).toEqual(false);
    });
  });
  describe('ofObject', function(){
    var func;
    func = tgt.ofObject;
    test('"x" is not', function(){
      return expect(func('x')).toEqual(false);
    });
    test('3 is not', function(){
      return expect(func(3)).toEqual(false);
    });
    test('[] is', function(){
      return expect(func([])).toEqual(true);
    });
    test('null is', function(){
      return expect(func(null)).toEqual(true);
    });
    return test('undefined is not', function(){
      return expect(func(void 8)).toEqual(false);
    });
  });
  describe('okNumber', function(){
    var func;
    func = tgt.okNumber;
    test('"x" is not', function(){
      expect(func('x').ok).toEqual(false);
      return expect(func('x').isOfNum).toEqual(false);
    });
    test('{} is not', function(){
      expect(func({}).ok).toEqual(false);
      return expect(func({}).isOfNum).toEqual(false);
    });
    test('[] is not', function(){
      expect(func([]).ok).toEqual(false);
      return expect(func([]).isOfNum).toEqual(false);
    });
    test('NaN', function(){
      expect(func(NaN).nan).toEqual(true);
      expect(func(NaN).infinity).toEqual(false);
      expect(func(NaN).isOfNum).toEqual(true);
      return expect(func(NaN).ok).toEqual(false);
    });
    test('Infinity', function(){
      expect(func(Infinity).infinity).toEqual(true);
      expect(func(Infinity).nan).toEqual(false);
      expect(func(Infinity).isOfNum).toEqual(true);
      return expect(func(Infinity).ok).toEqual(false);
    });
    test(3.5, function(){
      expect(func(3.5).ok).toEqual(true);
      expect(func(3.5).nan).toEqual(false);
      expect(func(3.5).isOfNum).toEqual(true);
      return expect(func(3.5).infinity).toEqual(false);
    });
    return test('undefined is not', function(){
      return expect(func(void 8).ok).toEqual(false);
    });
  });
  describe('isNumber', function(){
    var func;
    func = tgt.isNumber;
    test('3 is', function(){
      return expect(func(3)).toEqual(true);
    });
    test('3.1 is', function(){
      return expect(func(3.1)).toEqual(true);
    });
    test('"3" is', function(){
      return expect(func('3')).toEqual(true);
    });
    test('"3.1" is', function(){
      return expect(func('3.1')).toEqual(true);
    });
    test('"3.1.1" is not', function(){
      return expect(func('3.1.1')).toEqual(false);
    });
    test('"a" is not', function(){
      return expect(func('a')).toEqual(false);
    });
    test('null is not', function(){
      return expect(func(null)).toEqual(false);
    });
    test('NaN is not', function(){
      return expect(func(NaN)).toEqual(false);
    });
    test('Infinity is not', function(){
      return expect(func(Infinity)).toEqual(false);
    });
    return test('undefined is not', function(){
      return expect(func(void 8)).toEqual(false);
    });
  });
  describe('isNumberStrict', function(){
    var func;
    func = tgt.isNumberStrict;
    test('3 is', function(){
      return expect(func(3)).toEqual(true);
    });
    test('3.1 is', function(){
      return expect(func(3.1)).toEqual(true);
    });
    test('"3" is not', function(){
      return expect(func('3')).toEqual(false);
    });
    test('"3.1" is not', function(){
      return expect(func('3.1')).toEqual(false);
    });
    test('"3.1.1" is not', function(){
      return expect(func('3.1.1')).toEqual(false);
    });
    test('"a" is not', function(){
      return expect(func('a')).toEqual(false);
    });
    test('null is not', function(){
      return expect(func(null)).toEqual(false);
    });
    test('NaN is not', function(){
      return expect(func(NaN)).toEqual(false);
    });
    test('Infinity is not', function(){
      return expect(func(Infinity)).toEqual(false);
    });
    return test('undefined is not', function(){
      return expect(func(void 8)).toEqual(false);
    });
  });
  describe('isObject', function(){
    var func;
    func = tgt.isObject;
    test('3 is not', function(){
      return expect(func(3)).toEqual(false);
    });
    test('"3" is not', function(){
      return expect(func('3')).toEqual(false);
    });
    test('null is not', function(){
      return expect(func(null)).toEqual(false);
    });
    test('[] is not', function(){
      return expect(func([])).toEqual(false);
    });
    test('{} is', function(){
      return expect(func({})).toEqual(true);
    });
    return test('undefined is not', function(){
      return expect(func(void 8)).toEqual(false);
    });
  });
  describe('isString', function(){
    var func;
    func = tgt.isString;
    test('"x" is', function(){
      return expect(func('x')).toEqual(true);
    });
    test('3 is not', function(){
      return expect(func(3)).toEqual(false);
    });
    return test('undefined is not', function(){
      return expect(func(void 8)).toEqual(false);
    });
  });
  describe('isBoolean', function(){
    var func;
    func = tgt.isBoolean;
    test('"x" is not', function(){
      return expect(func('x')).toEqual(false);
    });
    test('3 is not', function(){
      return expect(func(3)).toEqual(false);
    });
    test('[] is not', function(){
      return expect(func([])).toEqual(false);
    });
    test('null is not', function(){
      return expect(func(null)).toEqual(false);
    });
    test('true is', function(){
      return expect(func(true)).toEqual(true);
    });
    test('false is', function(){
      return expect(func(false)).toEqual(true);
    });
    return test('undefined is not', function(){
      return expect(func(void 8)).toEqual(false);
    });
  });
  describe('isFunction', function(){
    var func;
    func = tgt.isFunction;
    test('"x" is not', function(){
      return expect(func('x')).toEqual(false);
    });
    test('3 is not', function(){
      return expect(func(3)).toEqual(false);
    });
    test('[] is not', function(){
      return expect(func([])).toEqual(false);
    });
    test('{} is not', function(){
      return expect(func({})).toEqual(false);
    });
    test('null is not', function(){
      return expect(func(null)).toEqual(false);
    });
    test('true is not', function(){
      return expect(func(true)).toEqual(false);
    });
    test('false is not', function(){
      return expect(func(false)).toEqual(false);
    });
    test('undefined is not', function(){
      return expect(func(void 8)).toEqual(false);
    });
    test('new Function() is ', function(){
      return expect(func(new Function)).toEqual(true);
    });
    return test('function(){} is ', function(){
      return expect(func(function(){})).toEqual(true);
    });
  });
  describe('isArray', function(){
    var func;
    func = tgt.isArray;
    test('"x" is not', function(){
      return expect(func('x')).toEqual(false);
    });
    test('3 is not', function(){
      return expect(func(3)).toEqual(false);
    });
    test('[] is', function(){
      return expect(func([])).toEqual(true);
    });
    test('{} is not', function(){
      return expect(func({})).toEqual(false);
    });
    test('null is not', function(){
      return expect(func(null)).toEqual(false);
    });
    test('true is not', function(){
      return expect(func(true)).toEqual(false);
    });
    test('false is not', function(){
      return expect(func(false)).toEqual(false);
    });
    return test('undefined is not', function(){
      return expect(func(void 8)).toEqual(false);
    });
  });
  describe('isBuffer', function(){
    var func;
    func = tgt.isBuffer;
    test('"x" is not', function(){
      return expect(func('x')).toEqual(false);
    });
    test('3 is not', function(){
      return expect(func(3)).toEqual(false);
    });
    test('[] is not', function(){
      return expect(func([])).toEqual(false);
    });
    test('{} is not', function(){
      return expect(func({})).toEqual(false);
    });
    test('null is not', function(){
      return expect(func(null)).toEqual(false);
    });
    test('true is not', function(){
      return expect(func(true)).toEqual(false);
    });
    test('false is not', function(){
      return expect(func(false)).toEqual(false);
    });
    test('undefined is not', function(){
      return expect(func(void 8)).toEqual(false);
    });
    return test('new Buffer("abc") is', function(){
      return expect(func(new Buffer('abc'))).toEqual(true);
    });
  });
  describe('isInteger', function(){
    var func;
    func = tgt.isInteger;
    test('3 is', function(){
      return expect(func(3)).toEqual(true);
    });
    test('"3" is', function(){
      return expect(func('3')).toEqual(true);
    });
    test('3.2 is not', function(){
      return expect(func(3.2)).toEqual(false);
    });
    test('"3.2" is not', function(){
      return expect(func('3.2')).toEqual(false);
    });
    test('null is not', function(){
      return expect(func(null)).toEqual(false);
    });
    test('{} is not', function(){
      return expect(func({})).toEqual(false);
    });
    test('[] is not', function(){
      return expect(func([])).toEqual(false);
    });
    return test('undefined is not', function(){
      return expect(func(void 8)).toEqual(false);
    });
  });
  describe('isIntegerStrict', function(){
    var func;
    func = tgt.isIntegerStrict;
    test('3 is', function(){
      return expect(func(3)).toEqual(true);
    });
    test('"3" is not', function(){
      return expect(func('3')).toEqual(false);
    });
    test('3.2 is not', function(){
      return expect(func(3.2)).toEqual(false);
    });
    test('"3.2" is not', function(){
      return expect(func('3.2')).toEqual(false);
    });
    test('null is not', function(){
      return expect(func(null)).toEqual(false);
    });
    test('{} is not', function(){
      return expect(func({})).toEqual(false);
    });
    test('[] is not', function(){
      return expect(func([])).toEqual(false);
    });
    return test('undefined is not', function(){
      return expect(func(void 8)).toEqual(false);
    });
  });
  describe('isIntegerNonNegative', function(){
    var func;
    func = tgt.isIntegerNonNegative;
    test('3 is', function(){
      return expect(func(3)).toEqual(true);
    });
    test('0 is', function(){
      return expect(func(0)).toEqual(true);
    });
    test('-3 is not', function(){
      return expect(func(-3)).toEqual(false);
    });
    test('"3" is', function(){
      return expect(func('3')).toEqual(true);
    });
    test('"0" is', function(){
      return expect(func('0')).toEqual(true);
    });
    test('"-3" is not', function(){
      return expect(func('-3')).toEqual(false);
    });
    test('3.2 is not', function(){
      return expect(func(3.2)).toEqual(false);
    });
    test('"3.2" is not', function(){
      return expect(func('3.2')).toEqual(false);
    });
    test('null is not', function(){
      return expect(func(null)).toEqual(false);
    });
    test('{} is not', function(){
      return expect(func({})).toEqual(false);
    });
    test('[] is not', function(){
      return expect(func([])).toEqual(false);
    });
    return test('undefined is not', function(){
      return expect(func(void 8)).toEqual(false);
    });
  });
  describe('isIntegerPositive', function(){
    var func;
    func = tgt.isIntegerPositive;
    test('3 is', function(){
      return expect(func(3)).toEqual(true);
    });
    test('0 is not', function(){
      return expect(func(0)).toEqual(false);
    });
    test('-3 is not', function(){
      return expect(func(-3)).toEqual(false);
    });
    test('"3" is', function(){
      return expect(func('3')).toEqual(true);
    });
    test('"0" is not', function(){
      return expect(func('0')).toEqual(false);
    });
    test('"-3" is not', function(){
      return expect(func('-3')).toEqual(false);
    });
    test('3.2 is not', function(){
      return expect(func(3.2)).toEqual(false);
    });
    test('"3.2" is not', function(){
      return expect(func('3.2')).toEqual(false);
    });
    test('null is not', function(){
      return expect(func(null)).toEqual(false);
    });
    test('{} is not', function(){
      return expect(func({})).toEqual(false);
    });
    test('[] is not', function(){
      return expect(func([])).toEqual(false);
    });
    return test('undefined is not', function(){
      return expect(func(void 8)).toEqual(false);
    });
  });
  describe('isIntegerPositiveStrict', function(){
    var func;
    func = tgt.isIntegerPositiveStrict;
    test('3 is', function(){
      return expect(func(3)).toEqual(true);
    });
    test('0 is not', function(){
      return expect(func(0)).toEqual(false);
    });
    test('-3 is not', function(){
      return expect(func(-3)).toEqual(false);
    });
    test('"3" is not', function(){
      return expect(func('3')).toEqual(false);
    });
    test('"0" is not', function(){
      return expect(func('0')).toEqual(false);
    });
    test('"-3" is not', function(){
      return expect(func('-3')).toEqual(false);
    });
    test('3.2 is not', function(){
      return expect(func(3.2)).toEqual(false);
    });
    test('"3.2" is not', function(){
      return expect(func('3.2')).toEqual(false);
    });
    test('null is not', function(){
      return expect(func(null)).toEqual(false);
    });
    test('{} is not', function(){
      return expect(func({})).toEqual(false);
    });
    test('[] is not', function(){
      return expect(func([])).toEqual(false);
    });
    return test('undefined is not', function(){
      return expect(func(void 8)).toEqual(false);
    });
  });
  describe('isIntegerNonNegativeStrict', function(){
    var func;
    func = tgt.isIntegerNonNegativeStrict;
    test('3 is', function(){
      return expect(func(3)).toEqual(true);
    });
    test('0 is', function(){
      return expect(func(0)).toEqual(true);
    });
    test('-3 is not', function(){
      return expect(func(-3)).toEqual(false);
    });
    test('"3" is not', function(){
      return expect(func('3')).toEqual(false);
    });
    test('"0" is not', function(){
      return expect(func('0')).toEqual(false);
    });
    test('"-3" is not', function(){
      return expect(func('-3')).toEqual(false);
    });
    test('3.2 is not', function(){
      return expect(func(3.2)).toEqual(false);
    });
    test('"3.2" is not', function(){
      return expect(func('3.2')).toEqual(false);
    });
    test('null is not', function(){
      return expect(func(null)).toEqual(false);
    });
    test('{} is not', function(){
      return expect(func({})).toEqual(false);
    });
    test('[] is not', function(){
      return expect(func([])).toEqual(false);
    });
    return test('undefined is not', function(){
      return expect(func(void 8)).toEqual(false);
    });
  });
  return describe('abbreviations', function(){
    test('ofNum -> ofNumber', function(){
      return expect(tgt.ofNum).toEqual(tgt.ofNumber);
    });
    test('ofStr -> ofString', function(){
      return expect(tgt.ofStr).toEqual(tgt.ofString);
    });
    test('ofObj -> ofObject', function(){
      return expect(tgt.ofObj).toEqual(tgt.ofObject);
    });
    test('isBool -> isBoolean', function(){
      return expect(tgt.isBool).toEqual(tgt.isBoolean);
    });
    test('isArr -> isArray', function(){
      return expect(tgt.isArr).toEqual(tgt.isArray);
    });
    test('isInt -> isInteger', function(){
      return expect(tgt.isInt).toEqual(tgt.isInteger);
    });
    test('isIntStrict -> isIntegerStrict', function(){
      return expect(tgt.isIntStrict).toEqual(tgt.isIntegerStrict);
    });
    test('okNum -> okNumber', function(){
      return expect(tgt.okNum).toEqual(tgt.okNumber);
    });
    test('isNum -> isNumber', function(){
      return expect(tgt.isNum).toEqual(tgt.isNumber);
    });
    return test('isObj -> isObject', function(){
      return expect(tgt.isObj).toEqual(tgt.isObject);
    });
  });
});
function stubIwarn(){
  var stubbed;
  stubbed = {
    save: squeak.iwarn,
    called: void 8
  };
  squeak.iwarn = function(){
    stubbed.called = true;
  };
  return stubbed;
}
function unstubIwarn(stub){
  return squeak.iwarn = stub.save;
}
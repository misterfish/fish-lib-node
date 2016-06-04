var test, xtest, our;
test = global.it;
xtest = global.xit;
our = {
  target: require('../index')
};
test = global.it;
xtest = global.xit;
describe('Util', function(){
  var tgt;
  tgt = our.target;
  beforeEach(function(){
    spyOn(console, 'warn');
    return tgt.squeakSet({
      apiError: 'throw'
    });
  });
  test('ord invalid', function(){
    var threw, e;
    threw = void 8;
    try {
      tgt.ord(10);
    } catch (e$) {
      e = e$;
      threw = true;
    }
    return expect(threw).toEqual(true);
  });
  test('ord "Z"', function(){
    return expect(tgt.ord('Z')).toEqual(90);
  });
  test('ord "Z"', function(){
    return expect(tgt.ord('γ')).toEqual(947);
  });
  test('chr invalid', function(){
    var threw, e;
    threw = void 8;
    try {
      tgt.chr('abc');
    } catch (e$) {
      e = e$;
      threw = true;
    }
    return expect(threw).toEqual(true);
  });
  test('chr 90 -> Z', function(){
    return expect(tgt.chr(90)).toEqual('Z');
  });
  test('chr 947 -> γ', function(){
    return expect(tgt.chr(947)).toEqual('γ');
  });
  test('range', function(){
    var cnt, val;
    cnt = 0;
    val = 0;
    tgt.range(3, 7, function(n){
      cnt = cnt + 1;
      return val = val + n;
    });
    expect(cnt).toEqual(5);
    return expect(val).toEqual(25);
  });
  test('range invalid', function(){
    var threw, e;
    threw = void 8;
    try {
      tgt.range('abc', 1);
    } catch (e$) {
      e = e$;
      threw = true;
    }
    expect(threw).toEqual(true);
    threw = void 8;
    try {
      tgt.range(4, 6.5);
    } catch (e$) {
      e = e$;
      threw = true;
    }
    return expect(threw).toEqual(true);
  });
  test('times', function(){
    var cnt, val;
    cnt = 0;
    val = 0;
    tgt.times(4, function(n){
      cnt = cnt + 1;
      return val = val + n;
    });
    expect(cnt).toEqual(4);
    return expect(val).toEqual(6);
  });
  test('times invalid', function(){
    var threw, e;
    threw = void 8;
    try {
      tgt.times(-3);
    } catch (e$) {
      e = e$;
      threw = true;
    }
    return expect(threw).toEqual(true);
  });
  test('array', function(){
    return expect(tgt.array(1, 5, 'a', {
      b: 12
    })).toEqual([
      1, 5, 'a', {
        b: 12
      }
    ]);
  });
  test('to-array', function(){
    var fun;
    fun = function(a, b, c){
      return expect(tgt.toArray(arguments)).toEqual([10, 20, 30]);
    };
    return fun(10, 20, 30);
  });
  test('flat-array 1', function(){
    return expect(tgt.flatArray(1, [1, 2], [1, [2, 3]])).toEqual([1, 1, 2, 1, 2, 3]);
  });
  test('flat-array 2', function(){
    return expect(tgt.flatArray(1, 2, 3, 4, 5)).toEqual([1, 2, 3, 4, 5]);
  });
  return test('flat-array 3', function(){
    var obj;
    obj = {
      a: 1,
      b: 2
    };
    return expect(tgt.flatArray([[obj, obj], obj], obj, [obj])).toEqual([obj, obj, obj, obj, obj]);
  });
});
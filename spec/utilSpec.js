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
  return test('chr 947 -> γ', function(){
    return expect(tgt.chr(947)).toEqual('γ');
  });
});
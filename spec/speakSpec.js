var test, xtest, our;
test = global.it;
xtest = global.xit;
our = {
  target: require('../index')
};
test = global.it;
xtest = global.xit;
describe('Speak', function(){
  var tgt;
  tgt = our.target;
  tgt.disableColors();
  describe('log', function(){
    beforeEach(function(){
      return spyOn(console, 'log');
    });
    test('string', function(){
      tgt.log('abc');
      return expect(console.log).toHaveBeenCalledWith('abc');
    });
    return test('string, string, string', function(){
      tgt.log('abc', 'def', 'ghi');
      return expect(console.log).toHaveBeenCalledWith('abc', 'def', 'ghi');
    });
  });
  describe('bullet', function(){
    test('custom string, direct', function(){
      tgt.bulletSet('x');
      expect(tgt.bulletGet('str')).toEqual('x');
      expect(tgt.bulletGet('indent')).toEqual(0);
      return expect(tgt.bulletGet('spacing')).toEqual(1);
    });
    test('custom string, object', function(){
      tgt.bulletSet({
        str: 'x'
      });
      expect(tgt.bulletGet('str')).toEqual('x');
      expect(tgt.bulletGet('indent')).toEqual(0);
      return expect(tgt.bulletGet('spacing')).toEqual(1);
    });
    test('ghost', function(){
      tgt.bulletSet({
        type: 'ghost'
      });
      expect(tgt.bulletGet('str')).toEqual('꣐');
      expect(tgt.bulletGet('indent')).toEqual(0);
      return expect(tgt.bulletGet('spacing')).toEqual(1);
    });
    return test('invalid', function(){
      tgt.bulletSet({
        type: 'xxx'
      });
      expect(tgt.bulletGet('str')).toEqual(' ');
      expect(tgt.bulletGet('indent')).toEqual(0);
      return expect(tgt.bulletGet('spacing')).toEqual(1);
    });
  });
  return describe('info', function(){
    var bullet;
    bullet = '꣐';
    beforeEach(function(){
      tgt.bulletSet({
        type: 'ghost'
      });
      return spyOn(console, 'log');
    });
    test('string', function(){
      tgt.info('abc');
      return expect(console.log).toHaveBeenCalledWith(bullet + " abc");
    });
    test('string, string, string', function(){
      tgt.info('abc', 'def', 'ghi');
      return expect(console.log).toHaveBeenCalledWith(bullet + " abc", "def", "ghi");
    });
    return test('indent, spacing', function(){
      tgt.bulletSet({
        indent: 4,
        spacing: 2
      });
      tgt.info('abc');
      return expect(console.log).toHaveBeenCalledWith("    " + bullet + "  abc");
    });
  });
});
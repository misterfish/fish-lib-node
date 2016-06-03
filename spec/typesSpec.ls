squeak = require '../squeak'

test = global.it
xtest = global.xit

our =
    target: require '../index'

test = global.it
xtest = global.xit

describe 'Types' ->
    tgt = our.target

    describe 'ok' ->
        func = tgt.ok
        test 'undefined (test for defined) -> not ok' ->
            expect func void .to-equal false
        test '1 (test for defined) -> ok' ->
            expect func 1 .to-equal true

        # --- arbitrary value.
        obj = xxx: 'yyy'

        test "'n' routes through isNumber()" ->
            expect func obj, 'n' .to-equal tgt.isNumber obj
        test "'ns' routes through isNumberStrict()" ->
            expect func obj, 'ns' .to-equal tgt.isNumberStrict obj
        test "'i' routes through isInteger()" ->
            expect func obj, 'i' .to-equal tgt.isInteger obj
        test "'is' routes through isIntegerStrict()" ->
            expect func obj, 'is' .to-equal tgt.isIntegerStrict obj
        test "'ip' routes through isIntegerPositive()" ->
            expect func obj, 'ip' .to-equal tgt.isIntegerPositive obj
        test "'ips' routes through isIntegerPositiveStrict()" ->
            expect func obj, 'ips' .to-equal tgt.isIntegerPositiveStrict obj
        test "'iN' routes through isIntegerNonNegative()" ->
            expect func obj, 'iN' .to-equal tgt.isIntegerNonNegative obj
        test "'iNs' routes through isIntegerNonNegativeStrict()" ->
            expect func obj, 'iNs' .to-equal tgt.isIntegerNonNegativeStrict obj
        test "'s' routes through isString()" ->
            expect func obj, 's' .to-equal tgt.isString obj
        test "'o' routes through isObject()" ->
            expect func obj, 'o' .to-equal tgt.isObject obj
        test "'a' routes through isArray()" ->
            expect func obj, 'a' .to-equal tgt.isArray obj
        test "'f' routes through isFunction()" ->
            expect func obj, 'f' .to-equal tgt.isFunction obj
        test "invalid arg" ->
            stubbed = stub-iwarn()

            expect func obj, 'xxx' .to-equal void
            expect stubbed.called .to-equal true

            unstub-iwarn stubbed

    describe 'defined' ->
        func = tgt.defined
        test 'undefined' ->
            expect func void .to-equal false
        test '1' ->
            expect func 1 .to-equal true
        test '"1"' ->
            expect func "1" .to-equal true
        test '{}' ->
            expect func {} .to-equal true
        test '[]' ->
            expect func [] .to-equal true

    describe 'ofNumber' ->
        func = tgt.ofNumber
        test '"x" is not' ->
            expect func 'x' .to-equal false
        test '3 is' ->
            expect func 3 .to-equal true
        test '3.1 is' ->
            expect func 3.1 .to-equal true
        test '"3" is not' ->
            expect func '3' .to-equal false
        test '"3.1" is not' ->
            expect func '3.1' .to-equal false
        test 'undefined is not' ->
            expect func void .to-equal false

    describe 'ofObject' ->
        func = tgt.ofObject
        test '"x" is not' ->
            expect func 'x' .to-equal false
        test '3 is not' ->
            expect func 3 .to-equal false
        test '[] is' ->
            expect func [] .to-equal true
        test 'null is' ->
            expect func null .to-equal true
        test 'undefined is not' ->
            expect func void .to-equal false

    describe 'okNumber' ->
        func = tgt.okNumber
        test '"x" is not' ->
            expect func('x').ok .to-equal false
            expect func('x').isOfNum .to-equal false
        test '{} is not' ->
            expect func({}).ok .to-equal false
            expect func({}).isOfNum .to-equal false
        test '[] is not' ->
            expect func([]).ok .to-equal false
            expect func([]).isOfNum .to-equal false
        test 'NaN' ->
            expect func(NaN).nan .to-equal true
            expect func(NaN).infinity .to-equal false
            expect func(NaN).isOfNum .to-equal true
            expect func(NaN).ok .to-equal false
        test 'Infinity' ->
            expect func(Infinity).infinity .to-equal true
            expect func(Infinity).nan .to-equal false
            expect func(Infinity).isOfNum .to-equal true
            expect func(Infinity).ok .to-equal false
        test 3.5 ->
            expect func(3.5).ok .to-equal true
            expect func(3.5).nan .to-equal false
            expect func(3.5).isOfNum .to-equal true
            expect func(3.5).infinity .to-equal false
        test 'undefined is not' ->
            expect func(void).ok .to-equal false
    describe 'isNumber' ->
        func = tgt.isNumber
        test '3 is' ->
            expect func 3 .to-equal true
        test '3.1 is' ->
            expect func 3.1 .to-equal true
        test '"3" is' ->
            expect func '3' .to-equal true
        test '"3.1" is' ->
            expect func '3.1' .to-equal true
        test '"3.1.1" is not' ->
            expect func '3.1.1' .to-equal false
        test '"a" is not' ->
            expect func 'a' .to-equal false
        test 'null is not' ->
            expect func null .to-equal false
        test 'NaN is not' ->
            expect func NaN .to-equal false
        test 'Infinity is not' ->
            expect func Infinity .to-equal false
        test 'undefined is not' ->
            expect func void .to-equal false
    describe 'isNumberStrict' ->
        func = tgt.isNumberStrict
        test '3 is' ->
            expect func 3 .to-equal true
        test '3.1 is' ->
            expect func 3.1 .to-equal true
        test '"3" is not' ->
            expect func '3' .to-equal false
        test '"3.1" is not' ->
            expect func '3.1' .to-equal false
        test '"3.1.1" is not' ->
            expect func '3.1.1' .to-equal false
        test '"a" is not' ->
            expect func 'a' .to-equal false
        test 'null is not' ->
            expect func null .to-equal false
        test 'NaN is not' ->
            expect func NaN .to-equal false
        test 'Infinity is not' ->
            expect func Infinity .to-equal false
        test 'undefined is not' ->
            expect func void .to-equal false
    describe 'isObject' ->
        func = tgt.isObject
        test '3 is not' ->
            expect func 3 .to-equal false
        test '"3" is not' ->
            expect func '3' .to-equal false
        test 'null is not' ->
            expect func null .to-equal false
        test '[] is not' ->
            expect func [] .to-equal false
        test '{} is' ->
            expect func {} .to-equal true
        test 'undefined is not' ->
            expect func void .to-equal false
    describe 'isString' ->
        func = tgt.isString
        test '"x" is' ->
            expect func 'x' .to-equal true
        test '3 is not' ->
            expect func 3 .to-equal false
        test 'undefined is not' ->
            expect func void .to-equal false
    describe 'isBoolean' ->
        func = tgt.isBoolean
        test '"x" is not' ->
            expect func 'x' .to-equal false
        test '3 is not' ->
            expect func 3 .to-equal false
        test '[] is not' ->
            expect func [] .to-equal false
        test 'null is not' ->
            expect func null .to-equal false
        test 'true is' ->
            expect func true .to-equal true
        test 'false is' ->
            expect func false .to-equal true
        test 'undefined is not' ->
            expect func void .to-equal false
    describe 'isFunction' ->
        func = tgt.isFunction
        test '"x" is not' ->
            expect func 'x' .to-equal false
        test '3 is not' ->
            expect func 3 .to-equal false
        test '[] is not' ->
            expect func [] .to-equal false
        test '{} is not' ->
            expect func {} .to-equal false
        test 'null is not' ->
            expect func null .to-equal false
        test 'true is not' ->
            expect func true .to-equal false
        test 'false is not' ->
            expect func false .to-equal false
        test 'undefined is not' ->
            expect func void .to-equal false
        test 'new Function() is ' ->
            expect func new Function .to-equal true
        test 'function(){} is ' ->
            expect func -> .to-equal true
    describe 'isArray' ->
        func = tgt.isArray
        test '"x" is not' ->
            expect func 'x' .to-equal false
        test '3 is not' ->
            expect func 3 .to-equal false
        test '[] is' ->
            expect func [] .to-equal true
        test '{} is not' ->
            expect func {} .to-equal false
        test 'null is not' ->
            expect func null .to-equal false
        test 'true is not' ->
            expect func true .to-equal false
        test 'false is not' ->
            expect func false .to-equal false
        test 'undefined is not' ->
            expect func void .to-equal false
    describe 'isBuffer' ->
        func = tgt.isBuffer
        test '"x" is not' ->
            expect func 'x' .to-equal false
        test '3 is not' ->
            expect func 3 .to-equal false
        test '[] is not' ->
            expect func [] .to-equal false
        test '{} is not' ->
            expect func {} .to-equal false
        test 'null is not' ->
            expect func null .to-equal false
        test 'true is not' ->
            expect func true .to-equal false
        test 'false is not' ->
            expect func false .to-equal false
        test 'undefined is not' ->
            expect func void .to-equal false
        test 'new Buffer("abc") is' ->
            expect func new Buffer 'abc' .to-equal true
    describe 'isInteger' ->
        func = tgt.isInteger
        test '3 is' ->
            expect func 3 .to-equal true
        test '"3" is' ->
            expect func '3' .to-equal true
        test '3.2 is not' ->
            expect func 3.2 .to-equal false
        test '"3.2" is not' ->
            expect func '3.2' .to-equal false
        test 'null is not' ->
            expect func null .to-equal false
        test '{} is not' ->
            expect func {} .to-equal false
        test '[] is not' ->
            expect func [] .to-equal false
        test 'undefined is not' ->
            expect func void .to-equal false
    describe 'isIntegerStrict' ->
        func = tgt.isIntegerStrict
        test '3 is' ->
            expect func 3 .to-equal true
        test '"3" is not' ->
            expect func '3' .to-equal false
        test '3.2 is not' ->
            expect func 3.2 .to-equal false
        test '"3.2" is not' ->
            expect func '3.2' .to-equal false
        test 'null is not' ->
            expect func null .to-equal false
        test '{} is not' ->
            expect func {} .to-equal false
        test '[] is not' ->
            expect func [] .to-equal false
        test 'undefined is not' ->
            expect func void .to-equal false
    describe 'isIntegerNonNegative' ->
        func = tgt.isIntegerNonNegative
        test '3 is' ->
            expect func 3 .to-equal true
        test '0 is' ->
            expect func 0 .to-equal true
        test '-3 is not' ->
            expect func -3 .to-equal false
        test '"3" is' ->
            expect func '3' .to-equal true
        test '"0" is' ->
            expect func '0' .to-equal true
        test '"-3" is not' ->
            expect func '-3' .to-equal false
        test '3.2 is not' ->
            expect func 3.2 .to-equal false
        test '"3.2" is not' ->
            expect func '3.2' .to-equal false
        test 'null is not' ->
            expect func null .to-equal false
        test '{} is not' ->
            expect func {} .to-equal false
        test '[] is not' ->
            expect func [] .to-equal false
        test 'undefined is not' ->
            expect func void .to-equal false
    describe 'isIntegerPositive' ->
        func = tgt.isIntegerPositive
        test '3 is' ->
            expect func 3 .to-equal true
        test '0 is not' ->
            expect func 0 .to-equal false
        test '-3 is not' ->
            expect func -3 .to-equal false
        test '"3" is' ->
            expect func '3' .to-equal true
        test '"0" is not' ->
            expect func '0' .to-equal false
        test '"-3" is not' ->
            expect func '-3' .to-equal false
        test '3.2 is not' ->
            expect func 3.2 .to-equal false
        test '"3.2" is not' ->
            expect func '3.2' .to-equal false
        test 'null is not' ->
            expect func null .to-equal false
        test '{} is not' ->
            expect func {} .to-equal false
        test '[] is not' ->
            expect func [] .to-equal false
        test 'undefined is not' ->
            expect func void .to-equal false
    describe 'isIntegerPositiveStrict' ->
        func = tgt.isIntegerPositiveStrict
        test '3 is' ->
            expect func 3 .to-equal true
        test '0 is not' ->
            expect func 0 .to-equal false
        test '-3 is not' ->
            expect func -3 .to-equal false
        test '"3" is not' ->
            expect func '3' .to-equal false
        test '"0" is not' ->
            expect func '0' .to-equal false
        test '"-3" is not' ->
            expect func '-3' .to-equal false
        test '3.2 is not' ->
            expect func 3.2 .to-equal false
        test '"3.2" is not' ->
            expect func '3.2' .to-equal false
        test 'null is not' ->
            expect func null .to-equal false
        test '{} is not' ->
            expect func {} .to-equal false
        test '[] is not' ->
            expect func [] .to-equal false
        test 'undefined is not' ->
            expect func void .to-equal false
    describe 'isIntegerNonNegativeStrict' ->
        func = tgt.isIntegerNonNegativeStrict
        test '3 is' ->
            expect func 3 .to-equal true
        test '0 is' ->
            expect func 0 .to-equal true
        test '-3 is not' ->
            expect func -3 .to-equal false
        test '"3" is not' ->
            expect func '3' .to-equal false
        test '"0" is not' ->
            expect func '0' .to-equal false
        test '"-3" is not' ->
            expect func '-3' .to-equal false
        test '3.2 is not' ->
            expect func 3.2 .to-equal false
        test '"3.2" is not' ->
            expect func '3.2' .to-equal false
        test 'null is not' ->
            expect func null .to-equal false
        test '{} is not' ->
            expect func {} .to-equal false
        test '[] is not' ->
            expect func [] .to-equal false
        test 'undefined is not' ->
            expect func void .to-equal false
    describe 'abbreviations' ->
        test 'ofNum -> ofNumber' ->
            expect tgt.ofNum .to-equal tgt.ofNumber
        test 'ofStr -> ofString' ->
            expect tgt.ofStr .to-equal tgt.ofString
        test 'ofObj -> ofObject' ->
            expect tgt.ofObj .to-equal tgt.ofObject
        test 'isBool -> isBoolean' ->
            expect tgt.isBool .to-equal tgt.isBoolean
        test 'isArr -> isArray' ->
            expect tgt.isArr .to-equal tgt.isArray
        test 'isInt -> isInteger' ->
            expect tgt.isInt .to-equal tgt.isInteger
        test 'isIntStrict -> isIntegerStrict' ->
            expect tgt.isIntStrict .to-equal tgt.isIntegerStrict
        test 'okNum -> okNumber' ->
            expect tgt.okNum .to-equal tgt.okNumber
        test 'isNum -> isNumber' ->
            expect tgt.isNum .to-equal tgt.isNumber
        test 'isObj -> isObject' ->
            expect tgt.isObj .to-equal tgt.isObject

function stub-iwarn
    stubbed =
        save: squeak.iwarn
        called: void
    squeak.iwarn = ->
        stubbed.called = true
        void
    stubbed
function unstub-iwarn stub
    squeak.iwarn = stub.save


test = global.it
xtest = global.xit

our =
    target: require '../index'

test = global.it
xtest = global.xit

describe 'Util' ->
    tgt = our.target

    before-each ->
        spy-on console, 'warn'
        tgt.squeak-set api-error: 'throw'

    test 'ord invalid' ->
        threw = void
        try
            tgt.ord 10
        catch
            threw = true
        expect threw .to-equal true
    test 'ord "Z"' ->
        expect tgt.ord 'Z' .to-equal 90
    test 'ord "Z"' ->
        expect tgt.ord 'γ' .to-equal 947
    test 'chr invalid' ->
        threw = void
        try
            tgt.chr 'abc'
        catch
            threw = true
        expect threw .to-equal true
    test 'chr 90 -> Z' ->
        expect tgt.chr 90 .to-equal 'Z'
    test 'chr 947 -> γ' ->
        expect tgt.chr 947 .to-equal 'γ'

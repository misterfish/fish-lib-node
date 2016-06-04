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

    test 'range' ->
        cnt = 0
        val = 0
        tgt.range 3 7 (n) ->
            cnt := cnt + 1
            val := val + n
        expect cnt .to-equal 5
        expect val .to-equal 25

    test 'range invalid' ->
        threw = void
        try
            tgt.range 'abc' 1
        catch
            threw = true
        expect threw .to-equal true

        threw = void
        try
            tgt.range 4 6.5
        catch
            threw = true
        expect threw .to-equal true

    test 'times' ->
        cnt = 0
        val = 0
        tgt.times 4 (n) ->
            cnt := cnt + 1
            val := val + n
        expect cnt .to-equal 4
        expect val .to-equal 6

    test 'times invalid' ->
        threw = void
        try
            tgt.times -3
        catch
            threw = true
        expect threw .to-equal true

    test 'array' ->
        expect tgt.array 1 5 'a' b: 12 .to-equal [
            1 5 'a' b: 12
        ]

    test 'to-array' ->
        fun = (a, b, c) ->
            expect tgt.to-array & .to-equal [10 20 30]
        fun 10 20 30

    test 'flat-array 1' ->
        expect tgt.flat-array do
            1
            [1 2]
            [1 [2 3]]
        .to-equal do
            [1 1 2 1 2 3]

    test 'flat-array 2' ->
        expect tgt.flat-array do
            1 2 3 4 5
        .to-equal do
            [1 2 3 4 5]

    test 'flat-array 3' ->
        obj = a:1 b:2
        expect tgt.flat-array do
            [[obj, obj], obj]
            obj
            [obj]
        .to-equal do
            [obj] * 5

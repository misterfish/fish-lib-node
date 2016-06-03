test = global.it
xtest = global.xit

our =
    target: require '../index'

test = global.it
xtest = global.xit

# --- we don't test any colors -- just disable them.

describe 'Speak' ->
    tgt = our.target

    tgt.disable-colors()

    describe 'log' ->
        before-each ->
            spy-on console, 'log'
        test 'string' ->
            tgt.log 'abc'
            expect console.log .to-have-been-called-with 'abc'
        test 'string, string, string' ->
            tgt.log 'abc' 'def' 'ghi'
            expect console.log .to-have-been-called-with 'abc' 'def' 'ghi'

    describe 'bullet' ->
        test 'custom string, direct' ->
            tgt.bullet-set 'x'
            expect tgt.bullet-get 'str' .to-equal 'x'
            expect tgt.bullet-get 'indent' .to-equal 0
            expect tgt.bullet-get 'spacing' .to-equal 1
        test 'custom string, object' ->
            tgt.bullet-set str: 'x'
            expect tgt.bullet-get 'str' .to-equal 'x'
            expect tgt.bullet-get 'indent' .to-equal 0
            expect tgt.bullet-get 'spacing' .to-equal 1
        test 'ghost' ->
            tgt.bullet-set type: 'ghost'
            expect tgt.bullet-get 'str' .to-equal '꣐'
            expect tgt.bullet-get 'indent' .to-equal 0
            expect tgt.bullet-get 'spacing' .to-equal 1
        test 'invalid' ->
            tgt.bullet-set type: 'xxx'
            expect tgt.bullet-get 'str' .to-equal ' '
            expect tgt.bullet-get 'indent' .to-equal 0
            expect tgt.bullet-get 'spacing' .to-equal 1

    describe 'info' ->
        bullet = '꣐'
        before-each ->
            tgt.bullet-set type: 'ghost'
            spy-on console, 'log'
        test 'string' ->
            tgt.info 'abc'
            expect console.log .to-have-been-called-with "#bullet abc"
        test 'string, string, string' ->
            tgt.info 'abc' 'def' 'ghi'
            expect console.log .to-have-been-called-with "#bullet abc" "def" "ghi"
        test 'indent, spacing' ->
            tgt.bullet-set do
                indent: 4
                spacing: 2
            tgt.info 'abc'
            expect console.log .to-have-been-called-with "    #bullet  abc"

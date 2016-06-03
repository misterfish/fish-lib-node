test = global.it
xtest = global.xit

our =
    target: require '../squeak'

test = global.it
xtest = global.xit

describe 'Squeak' ->
    tgt = our.target

    describe 'iwarn' ->
        do-test = void
        warning = void
        opts = {}

        after-each ->
            spy-on console, 'warn' .and.call-fake (the-warning) ->
                expect do-test the-warning .to-equal true
            tgt.iwarn warning, opts
            expect console.warn .to-have-been-called()

        test 'says "Internal warning"' ->
            warning := "everything's broke"
            do-test := (the-warning) ->
                ok = the-warning == // Internal \s+ warning //
                ok is not null
        test 'text + location' ->
            warning := "everything's broke"
            do-test := (the-warning) ->
                ok = the-warning == // everything's \s broke \s \( .+? :.+?:.+ \) //
                ok is not null
        test 'has stack trace' ->
            warning := "everything's broke"
            do-test := (the-warning) ->
                ok = the-warning == // at \s pcomplain \s \( .+ :\d+:\d+ \)//
                ok is not null
        test 'has no stack trace' ->
            opts := print-stack-trace: false
            warning := "everything's broke"
            do-test := (the-warning) ->
                ok = the-warning == // at \s pcomplain \s \( .+ :\d+:\d+ \)//
                ok is null

    describe 'warn' ->
        do-test = void
        warning = void
        opts = {}

        after-each ->
            spy-on console, 'warn' .and.call-fake (the-warning) ->
                expect do-test the-warning .to-equal true
            tgt.warn warning, opts
            expect console.warn .to-have-been-called()

        test 'says "Warning"' ->
            warning := "everything's broke"
            do-test := (the-warning) ->
                ok = the-warning == // Warning //
                ok is not null
        test 'text + no location' ->
            warning := "everything's broke"
            do-test := (the-warning) ->
                ok = the-warning == // everything's \s broke \s* $ //
                ok is not null
        test 'has no stack trace' ->
            warning := "everything's broke"
            do-test := (the-warning) ->
                ok = the-warning == // at \s pcomplain \s \( .+ :\d+:\d+ \)//
                ok is null
        test 'has stack trace' ->
            warning := "everything's broke"
            opts := print-stack-trace: true
            do-test := (the-warning) ->
                ok = the-warning == // at \s pcomplain \s \( .+ :\d+:\d+ \)//
                ok is not null

    describe 'squeak-set' ->
        test 'force stack trace on warn' ->
            tgt.squeak-set print-stack-trace: true
            do-test = (the-warning) ->
                ok = the-warning == // at \s pcomplain \s \( .+ :\d+:\d+ \)//
                ok is not null
            spy-on console, 'warn' .and.call-fake (the-warning) ->
                expect do-test the-warning .to-equal true
            tgt.warn 'a warning'
        test 'force no stack trace on iwarn' ->
            tgt.squeak-set print-stack-trace: false
            do-test = (the-warning) ->
                ok = the-warning == // at \s pcomplain \s \( .+ :\d+:\d+ \)//
                ok is null
            spy-on console, 'warn' .and.call-fake (the-warning) ->
                expect do-test the-warning .to-equal true
            tgt.iwarn 'a warning'
        test 'stack trace back to default on iwarn' ->
            tgt.squeak-set print-stack-trace: void
            do-test = (the-warning) ->
                ok = the-warning == // at \s pcomplain \s \( .+ :\d+:\d+ \)//
                ok is not null
            spy-on console, 'warn' .and.call-fake (the-warning) ->
                expect do-test the-warning .to-equal true
            tgt.iwarn 'a warning'

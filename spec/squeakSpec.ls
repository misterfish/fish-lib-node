test = global.it
xtest = global.xit

our =
    target: require '../index'

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

    describe 'complain property' ->
        before-each ->
            # --- silence console.
            spy-on console, 'warn'
        test 'complain = warn' ->
            tgt.squeak-set complain: 'warn'
            spy-on process, 'exit'
            tgt.complain()
            expect process.exit .not.to-have-been-called()
            tgt.icomplain()
            expect process.exit .not.to-have-been-called()
        test 'complain = error' ->
            tgt.squeak-set complain: 'error'
            spy-on process, 'exit'
            tgt.complain()
            expect process.exit .to-have-been-called()
            tgt.icomplain()
            expect process.exit .to-have-been-called()

    describe 'error property' ->
        before-each ->
            # --- silence console.
            spy-on console, 'warn'
            spy-on process, 'exit'
        test 'error = fatal' ->
            tgt.squeak-set error: 'fatal'
            tgt.error()
            expect process.exit .to-have-been-called()
        test 'error = throw' ->
            tgt.squeak-set error: 'throw'
            threw = void
            try
                tgt.error()
            catch
                threw = true
            expect process.exit .not.to-have-been-called()
            expect threw .to-be true
        test 'error = allow' ->
            tgt.squeak-set error: 'allow'
            threw = void
            try
                tgt.error()
            catch
                threw = true
            expect process.exit .not.to-have-been-called()
            expect threw .not.to-be true
        test 'error = unknown value -> fatal' ->
            tgt.squeak-set error: 'xxx'
            tgt.error()
            expect process.exit .to-have-been-called()

    describe 'api-error property' ->
        before-each ->
            # --- silence console.
            spy-on console, 'warn'
            spy-on process, 'exit'
        test 'api-error = fatal' ->
            tgt.squeak-set api-error: 'fatal'
            tgt.aerror()
            expect process.exit .to-have-been-called()
        test 'api-error = throw' ->
            tgt.squeak-set api-error: 'throw'
            threw = void
            try
                tgt.aerror()
            catch
                threw = true
            expect process.exit .not.to-have-been-called()
            expect threw .to-be true
        test 'api-error = allow' ->
            tgt.squeak-set api-error: 'allow'
            threw = void
            try
                tgt.aerror()
            catch
                threw = true
            expect process.exit .not.to-have-been-called()
            expect threw .not.to-be true
        test 'api-error = unknown value -> fatal' ->
            tgt.squeak-set api-error: 'xxx'
            tgt.aerror()
            expect process.exit .to-have-been-called()

    # --- not testing 'stack-rewind' property or the stack text
    # substitution.

    describe 'ierror' ->
        do-test = void
        warning = void
        opts = {}

        before-each ->
            spy-on process, 'exit'

        after-each ->
            spy-on console, 'warn' .and.call-fake (the-warning) ->
                expect do-test the-warning .to-equal true
            tgt.ierror warning, opts
            expect console.warn .to-have-been-called()
            expect process.exit .to-have-been-called()

        test 'says "Internal error"' ->
            warning := "everything's broke"
            do-test := (the-warning) ->
                ok = the-warning == // Internal \s+ error //
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

    describe 'error' ->
        do-test = void
        warning = void
        opts = {}

        before-each ->
            spy-on process, 'exit'

        after-each ->
            spy-on console, 'warn' .and.call-fake (the-warning) ->
                expect do-test the-warning .to-equal true
            tgt.error warning, opts
            expect console.warn .to-have-been-called()
            expect process.exit .to-have-been-called()

        test 'says "Error"' ->
            warning := "everything's broke"
            do-test := (the-warning) ->
                ok = the-warning == // Error //
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

    describe 'error with exit code' ->
        test 'code 42' ->
            # --- silence console.
            spy-on console, 'warn'
            spy-on process, 'exit'
            tgt.error '' code: 42
            expect process.exit .to-have-been-called-with 42

    describe 'aerror' ->
        do-test = void
        warning = void
        opts = {}

        before-each ->
            spy-on process, 'exit'

        after-each ->
            spy-on console, 'warn' .and.call-fake (the-warning) ->
                expect do-test the-warning .to-equal true
            tgt.aerror warning, opts
            expect console.warn .to-have-been-called()
            expect process.exit .to-have-been-called()

        test 'says "Api error"' ->
            warning := "everything's broke"
            do-test := (the-warning) ->
                ok = the-warning == // Api \s+ error //
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

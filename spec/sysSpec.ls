fs = require 'fs'
path = require 'path'

sprintf = require 'sprintf'

{ split, } = require 'prelude-ls'

test = global.it
xtest = global.xit

config =
    dir:
        spec: '/../spec'
        test: '/data/sysSpec'

our =
    target: require '../index'
    dir:
        bin: path.dirname process.argv.1
        spec: void
        test: void

our.dir.spec = path.resolve our.dir.bin + config.dir.spec
our.dir.test = path.resolve our.dir.spec + config.dir.test

describe 'Sys' ->
    tgt = our.target
    tgt.sys-set verbose: false

    before-each ->
        # --- silence console on warn and write..
        spy-on console, 'warn'
        spy-on console, 'error'
        spy-on process.stdout, 'write'
        spy-on process.stderr, 'write'

    describe 'sys-exec, async' ->
        # --- just an overly complicated shell command.
        cmd = sprintf 'ls -Q "%s"/*.txt | xargs cat | wc -w', our.dir.test

        before-each ->
            tgt.sys-set sync: false

        test 'usage 1' (done) ->
            tgt.sys-exec do
                cmd: cmd
                oncomplete: ({ out, ok, code, signal, stdout, stderr, }) ->
                    expect out.trim() .to-equal '12'
                    expect process.stdout.write .not.to-have-been-called()
                    expect out .to-equal stdout
                    # --- could it be a buffer? XXX
                    expect tgt.is-str stderr .to-equal true
                    done()

        test 'usage 1 with exit code and stderr' (done) ->
            tgt.sys-exec do
                cmd: 'find non/existent/path'
                err-print: false
                oncomplete: ({ out, ok, code, signal, stdout, stderr, }) ->
                    expect code .not.to-equal 0
                    # --- gnu-specific XXX
                    expect(stderr == // no \s such \s file //i).not.to-be null
                    done()

        test 'usage 1 with non-existent cmd' (done) ->
            tgt.sys-exec do
                cmd: './non-existent-cmd'
                err-print: false
                oncomplete: ({ out, ok, code, signal, stdout, stderr, }) ->
                    # --- gnu-specific XXX
                    expect(stderr == // not \s found //i).not.to-be null
                    expect code .not.to-equal 0
                    done()

        test 'usage 1 with exit code and signal' (done) ->
            child = tgt.sys-exec do
                cmd: 'while [ ok ]; do echo a > /dev/null; done'
                oncomplete: ({ out, ok, code, signal, stdout, stderr, }) ->
                    expect code .to-equal null
                    expect signal .to-equal 'SIGHUP'
                    done()
            child.kill 'SIGHUP'

        # --- usage 2, 12, and 13 tested in sync case.

        test 'usage 3' (done) ->
            tgt.sys-exec do
                cmd
                oncomplete: ({ out, }) ->
                    expect out.trim() .to-equal '12'
                    expect process.stdout.write .not.to-have-been-called()
                    done()

        test 'usage 8' (done) ->
            tgt.sys-exec do
                cmd
                ({ out, }) ->
                    expect out.trim() .to-equal '12'
                    expect process.stdout.write .not.to-have-been-called()
                    done()

        test 'usage 9' (done) ->
            tgt.sys-exec do
                cmd
                verbose: false
                ({ out, }) ->
                    expect out.trim() .to-equal '12'
                    expect process.stdout.write .not.to-have-been-called()
                    done()

        test 'usage 9 (verbose)' (done) ->
            tgt.sys-exec do
                cmd
                verbose: true
                ({ out, }) ->
                    expect out.trim() .to-equal '12'
                    expect process.stdout.write .to-have-been-called()
                    done()

        test 'usage 10' (done) ->
            tgt.sys-exec do
                'ls' '-1' '-Q'
                sprintf '"%s"/*.txt' our.dir.test
                '|' 'xargs' 'cat' '|' 'wc' '-w'
                ({ out, }) ->
                    expect out.trim() .to-equal '12'
                    expect process.stdout.write .not.to-have-been-called()
                    done()

        test 'usage 11' (done) ->
            tgt.sys-exec do
                'ls' '-Q'
                sprintf '"%s"/*.txt' our.dir.test
                '|' 'xargs' 'cat' '|' 'wc' '-w'
                verbose: true
                ({ out, }) ->
                    expect out.trim() .to-equal '12'
                    expect process.stdout.write .to-have-been-called()
                    done()

        test 'usage 13' (done) ->
            tgt.sys-exec do
                'ls' '-Q'
                sprintf '"%s"/*.txt' our.dir.test
                '|' 'xargs' 'cat' '|' 'wc' '-w'
                verbose: true
                oncomplete: ({ out, }) ->
                    expect out.trim() .to-equal '12'
                    expect process.stdout.write .to-have-been-called()
                    done()

    describe 'sys-exec, sync' ->

        # --- just an overly complicated shell command.
        cmd = sprintf 'ls -Q "%s"/*.txt | xargs cat | wc -w', our.dir.test

        before-each ->
            tgt.sys-set sync: true

        test 'usage 1, function form' ->
            tgt.sys-exec do
                cmd: cmd
                oncomplete: ({ out, ok, code, signal, stdout, stderr, }) ->
                    expect out.trim() .to-equal '12'
                    expect process.stdout.write .not.to-have-been-called()
                    expect out .to-equal stdout
                    # --- could it be a buffer? XXX
                    expect tgt.is-str stderr .to-equal true

        test 'usage 1, return form' ->
            { out, ok, code, signal, stdout, stderr, } = tgt.sys-exec do
                cmd: cmd

            expect out.trim() .to-equal '12'
            expect process.stdout.write .not.to-have-been-called()
            expect out .to-equal stdout
            # --- could it be a buffer? XXX
            expect tgt.is-str stderr .to-equal true

        test 'usage 1 with exit code' (done) ->
            tgt.sys-exec do
                cmd: 'find non/existent/path'
                err-print: false
                oncomplete: ({ out, ok, code, signal, stdout, stderr, }) ->
                    # --- gnu-specific XXX
                    expect(stderr == // no \s such \s file //i).not.to-be null
                    expect code .not.to-equal 0
                    done()

        test 'usage 1 with non-existent cmd' (done) ->
            tgt.sys-exec do
                cmd: './non-existent-cmd'
                err-print: false
                oncomplete: ({ out, ok, code, signal, stdout, stderr, }) ->
                    # --- gnu-specific XXX
                    expect(stderr == // not \s found //i).not.to-be null
                    expect code .not.to-equal 0
                    done()

        # --- sync with signal not tested.

        test 'usage 2' ->
            { out, ok, code, signal, stdout, stderr, } = tgt.sys-exec do
                cmd
            expect out.trim() .to-equal '12'
            expect process.stdout.write .not.to-have-been-called()

        test 'usage 3' ->
            { out, ok, code, signal, stdout, stderr, } = tgt.sys-exec do
                cmd
                verbose: true
            expect out.trim() .to-equal '12'
            expect process.stdout.write .to-have-been-called()

        test 'usage 8' ->
            tgt.sys-exec do
                cmd
                ({ out, ok, code, signal, stdout, stderr, }) ->
                    expect out.trim() .to-equal '12'
                    expect process.stdout.write .not.to-have-been-called()

        test 'usage 9' ->
            tgt.sys-exec do
                cmd
                verbose: true
                ({ out, ok, code, signal, stdout, stderr, }) ->
                    expect out.trim() .to-equal '12'
                    expect process.stdout.write .to-have-been-called()

        test 'usage 10' ->
            tgt.sys-exec do
                'ls' '-1' '-Q'
                sprintf '"%s"/*.txt' our.dir.test
                '|' 'xargs' 'cat' '|' 'wc' '-w'
                ({ out, }) ->
                    expect out.trim() .to-equal '12'
                    expect process.stdout.write .not.to-have-been-called()

        test 'usage 11' ->
            tgt.sys-exec do
                'ls' '-Q'
                sprintf '"%s"/*.txt' our.dir.test
                '|' 'xargs' 'cat' '|' 'wc' '-w'
                verbose: true
                ({ out, }) ->
                    expect out.trim() .to-equal '12'
                    expect process.stdout.write .to-have-been-called()

        test 'usage 12' ->
            { out, ok, code, signal, stdout, stderr, } = tgt.sys-exec do
                'ls' '-Q'
                sprintf '"%s"/*.txt' our.dir.test
                '|' 'xargs' 'cat' '|' 'wc' '-w'
            expect out.trim() .to-equal '12'
            expect process.stdout.write .not.to-have-been-called()

        test 'usage 13' ->
            { out, ok, code, signal, stdout, stderr, } = tgt.sys-exec do
                'ls' '-Q'
                sprintf '"%s"/*.txt' our.dir.test
                '|' 'xargs' 'cat' '|' 'wc' '-w'
                verbose: true
            expect out.trim() .to-equal '12'
            expect process.stdout.write .to-have-been-called()

    describe 'sys-spawn, async' ->
        cmd = 'cat'
        arg1 = '-E'
        arg2 = sprintf "%s/3 words.txt" our.dir.test
        args = [ arg1, arg2, ]

        before-each ->
            tgt.sys-set sync: false

        test 'usage 1' (done) ->
            tgt.sys-spawn do
                cmd: 'true'
                oncomplete: ({ out, ok, code, signal, stdout, stderr, }) ->
                    expect out.trim() .to-equal ''
                    expect process.stdout.write .not.to-have-been-called()
                    expect code .to-equal 0
                    expect out .to-equal stdout
                    # --- could it be a buffer? XXX
                    expect tgt.is-str stderr .to-equal true
                    done()

        test 'usage 1 with non-existent cmd' (done) ->
            tgt.sys-spawn do
                cmd: './non-existent-cmd'
                err-print: false
                oncomplete: ({ out, ok, code, signal, stdout, stderr, }) ->
                    expect code .to-equal void
                    # XXX
                    expect stderr .to-equal ''
                    done()

        test 'usage 3' (done) ->
            tgt.sys-spawn do
                'true'
                oncomplete: ({ out, ok, code, signal, stdout, stderr, }) ->
                    expect out.trim() .to-equal ''
                    expect process.stdout.write .not.to-have-been-called()
                    expect code .to-equal 0
                    done()

        # --- no 2, 4, 12 for async.

        test 'usage 3, verbose' (done) ->
            tgt.sys-spawn do
                'true'
                verbose: true
                oncomplete: ({ out, }) ->
                    expect out.trim() .to-equal ''
                    expect process.stdout.write .to-have-been-called()
                    done()

        test 'usage 5' (done) ->
            tgt.sys-spawn do
                cmd
                args
                verbose: true
                oncomplete: ({ out, }) ->
                    expect out.trim() .to-equal 'one two$\n$\nthree$'
                    expect process.stdout.write .to-have-been-called()
                    done()

        test 'usage 5 with exit code' (done) ->
            tgt.sys-spawn do
                'find'
                ['./non/existent']
                oncomplete: ({ out, code, }) ->
                    expect out .to-equal ''
                    expect code .not.to-equal 0
                    expect process.stdout.write .not.to-have-been-called()
                    done()

        test 'usage 5 with exit code and signal' (done) ->
            child = tgt.sys-spawn do
                'yes'
                []
                verbose: true
                oncomplete: ({ out, code, signal, }) ->
                    expect process.stdout.write .to-have-been-called()
                    expect code .to-equal null
                    expect signal .to-equal 'SIGHUP'
                    done()
            child.kill 'SIGHUP'

        test 'usage 6' (done) ->
            tgt.sys-spawn do
                cmd
                args
                ({ out, }) ->
                    expect out.trim() .to-equal 'one two$\n$\nthree$'
                    expect process.stdout.write .not.to-have-been-called()
                    done()

        test 'usage 7' (done) ->
            tgt.sys-spawn do
                cmd
                args
                verbose: true
                ({ out, }) ->
                    expect out.trim() .to-equal 'one two$\n$\nthree$'
                    expect process.stdout.write .to-have-been-called()
                    done()

        test 'usage 8' (done) ->
            tgt.sys-spawn do
                'true'
                ({ out, }) ->
                    expect out.trim() .to-equal ''
                    expect process.stdout.write .not.to-have-been-called()
                    done()

        test 'usage 9' (done) ->
            tgt.sys-spawn do
                'true'
                verbose: true
                ({ out, }) ->
                    expect out.trim() .to-equal ''
                    expect process.stdout.write .to-have-been-called()
                    done()

        test 'usage 10' (done) ->
            tgt.sys-spawn do
                cmd
                arg1
                arg2
                ({ out, }) ->
                    expect out.trim() .to-equal 'one two$\n$\nthree$'
                    expect process.stdout.write .not.to-have-been-called()
                    done()

        test 'usage 11' (done) ->
            tgt.sys-spawn do
                cmd
                arg1
                arg2
                verbose: true
                ({ out, }) ->
                    expect out.trim() .to-equal 'one two$\n$\nthree$'
                    expect process.stdout.write .to-have-been-called()
                    done()

        test 'usage 13' (done) ->
            tgt.sys-spawn do
                cmd
                arg1
                arg2
                verbose: true
                oncomplete: ({ out, }) ->
                    expect out.trim() .to-equal 'one two$\n$\nthree$'
                    expect process.stdout.write .to-have-been-called()
                    done()

        test 'output' (done) ->
            file = 'spec/sysSpec.ls'
            tgt.sys-spawn do
                'cat'
                [file]
                oncomplete: ({ out, code, }) ->
                    read-ok = void
                    try
                        expect out .to-equal do
                            fs.read-file-sync file .to-string()
                        read-ok = true
                    catch
                    expect read-ok .to-equal true
                    done()

        test 'output split' (done) ->
            file = 'spec/sysSpec.ls'
            tgt.sys-spawn do
                'cat'
                [file]
                out-split: true
                out-split-remove-trailing-element: false
                oncomplete: ({ out, code, }) ->
                    read-ok = void
                    try
                        expect out .to-equal split '\n',
                            fs.read-file-sync file .to-string()
                        read-ok = true
                    catch
                    expect read-ok .to-equal true
                    done()

    describe 'sys-spawn, sync' ->
        cmd = 'cat'
        arg1 = '-E'
        arg2 = sprintf "%s/3 words.txt" our.dir.test
        args = [ arg1, arg2, ]

        before-each ->
            tgt.sys-set sync: true

        test 'usage 1, function form' ->
            tgt.sys-spawn do
                cmd: 'true'
                oncomplete: ({ out, ok, code, signal, stdout, stderr, }) ->
                    expect out.trim() .to-equal ''
                    expect process.stdout.write .not.to-have-been-called()
                    expect code .to-equal 0
                    expect out .to-equal stdout
                    expect stderr .to-be null

        test 'usage 1, return form' ->
            { out, ok, code, signal, stdout, stderr, } = tgt.sys-spawn do
                cmd: 'true'

            expect out.trim() .to-equal ''
            expect process.stdout.write .not.to-have-been-called()
            expect code .to-equal 0
            expect out .to-equal stdout
            expect stderr .to-be null

        test 'usage 1 with non-existent cmd' ->
            tgt.sys-spawn do
                cmd: './non-existent-cmd'
                err-print: false
                oncomplete: ({ out, ok, code, signal, stdout, stderr, }) ->
                    # XXX
                    #expect stderr .to-be 'hop'
                    expect code .to-equal null

        test 'usage 3' ->
            tgt.sys-spawn do
                'true'
                oncomplete: ({ out, ok, code, signal, stdout, stderr, }) ->
                    expect out.trim() .to-equal ''
                    expect process.stdout.write .not.to-have-been-called()
                    expect code .to-equal 0

        # --- no 2, 4, 12 for async.

        test 'usage 3, verbose' ->
            tgt.sys-spawn do
                'true'
                verbose: true
                oncomplete: ({ out, }) ->
                    expect out.trim() .to-equal ''
                    expect process.stdout.write .to-have-been-called()

        test 'usage 5' ->
            tgt.sys-spawn do
                cmd
                args
                verbose: true
                oncomplete: ({ out, }) ->
                    expect out.trim() .to-equal 'one two$\n$\nthree$'
                    expect process.stdout.write .to-have-been-called()

        test 'usage 5 with exit code' ->
            tgt.sys-spawn do
                'find'
                ['./non/existent']
                err-print: false
                oncomplete: ({ out, code, stderr, }) ->
                    expect out .to-equal ''
                    expect code .not.to-equal 0
                    expect code .not.to-equal null
                    expect process.stdout.write .not.to-have-been-called()
                    # --- gnu-specific XXX
                    expect(stderr == // no \s such \s file //i).not.to-be null

        # --- sync with signal not tested.

        test 'usage 6' ->
            tgt.sys-spawn do
                cmd
                args
                ({ out, }) ->
                    expect out.trim() .to-equal 'one two$\n$\nthree$'
                    expect process.stdout.write .not.to-have-been-called()

        test 'usage 7' ->
            tgt.sys-spawn do
                cmd
                args
                verbose: true
                ({ out, }) ->
                    expect out.trim() .to-equal 'one two$\n$\nthree$'
                    expect process.stdout.write .to-have-been-called()

        test 'usage 8' ->
            tgt.sys-spawn do
                'true'
                ({ out, }) ->
                    expect out.trim() .to-equal ''
                    expect process.stdout.write .not.to-have-been-called()

        test 'usage 9' ->
            tgt.sys-spawn do
                'true'
                verbose: true
                ({ out, }) ->
                    expect out.trim() .to-equal ''
                    expect process.stdout.write .to-have-been-called()

        test 'usage 10' ->
            tgt.sys-spawn do
                cmd
                arg1
                arg2
                ({ out, }) ->
                    expect out.trim() .to-equal 'one two$\n$\nthree$'
                    expect process.stdout.write .not.to-have-been-called()

        test 'usage 11' ->
            tgt.sys-spawn do
                cmd
                arg1
                arg2
                verbose: true
                ({ out, }) ->
                    expect out.trim() .to-equal 'one two$\n$\nthree$'
                    expect process.stdout.write .to-have-been-called()

        test 'usage 13' ->
            tgt.sys-spawn do
                cmd
                arg1
                arg2
                verbose: true
                oncomplete: ({ out, }) ->
                    expect out.trim() .to-equal 'one two$\n$\nthree$'
                    expect process.stdout.write .to-have-been-called()

fs = require 'fs'
path = require 'path'

sprintf = require 'sprintf'

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
                    expect tgt.is-str stderr .to-equal true
                    done()

        test 'usage 1 with exit code' (done) ->
            tgt.sys-exec do
                cmd: 'find non/existent/path'
                oncomplete: ({ out, ok, code, signal, stdout, stderr, }) ->
                    expect code .to-equal 1
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
                    expect tgt.is-str stderr .to-equal true

        test 'usage 1, return form' ->
            { out, ok, code, signal, stdout, stderr, } = tgt.sys-exec do
                cmd: cmd

            expect out.trim() .to-equal '12'
            expect process.stdout.write .not.to-have-been-called()
            expect out .to-equal stdout
            expect tgt.is-str stderr .to-equal true

        test 'usage 1 with exit code' (done) ->
            tgt.sys-exec do
                # --- otherwise the shell will write straight to our stderr.
                cmd: 'find non/existent/path 2>/dev/null'
                oncomplete: ({ out, ok, code, signal, stdout, stderr, }) ->
                    expect code .to-equal 1
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
                oncomplete: ({ out, ok, code, signal, stdout, stderr, }) ->
                    expect out.trim() .to-equal '12'
                    expect process.stdout.write .not.to-have-been-called()

        test 'usage 9' ->
            tgt.sys-exec do
                cmd
                verbose: true
                oncomplete: ({ out, ok, code, signal, stdout, stderr, }) ->
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


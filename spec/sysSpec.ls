fs = require 'fs'
path = require 'path'

sprintf = require 'sprintf'
{ Obj } = require 'prelude-ls'

fish-lib-ls = require '../index'

test = global.it
xtest = global.xit

dir = {}
dir.bin = path.dirname process.argv.1
dir.spec = dir.bin + '/../spec'
dir.test = dir.spec + '/data/sysSpec'

dir = Obj.map (path.resolve), dir

init()

describe 'sys-exec' ->

    before-each (done) ->
        done()

    # just an overly complicated shell command
    cmd = sprintf 'ls -Q "%s"/*.txt | xargs cat | wc -w', dir.test

    # providing (done) makes it async -- they actually check the function
    # definition

    # there's no callback XX
    xtest 'string' (done) ->
        fish-lib-ls.sys-exec cmd

    test 'string, object' (done) ->
        fish-lib-ls.sys-exec do
            cmd
            oncomplete: ({ out, ok }) ->
                if not ok
                    error()
                expect out.trim() .to-equal '12'
                done()

function init
    void
    #log fs.readdir-sync test-dir

function log
    console.log.apply console, arguments

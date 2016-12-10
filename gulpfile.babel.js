import fs from 'fs'
import path from 'path'
import express from 'express'
import gulp from 'gulp'
import gutil from 'gulp-util'
import jasmine from 'gulp-jasmine'
import runSequence from 'run-sequence'
import jasmineReporter from 'jasmine-terminal-reporter'
import webpack from 'webpack'
import ncu from 'npm-check-updates'
import leftPad from 'left-pad'
import cfg from './webpack.config.babel.js'


function log (task, err, stats) {
    if (err) {
        throw new gutil.PluginError(task, err)
    }
    gutil.log('[' + task + ']', stats.toString({ colors: true }))
}


gulp.task('build', (done) => {
    webpack(cfg.get(), (err, stats) => {
        log('build', err, stats)
        done()
    })
})

gulp.task('start-dev-server', (done) => {
    let server = express()
    server.use(express.static(path.join(__dirname, cfg.ROOT.BUILD)))

    server.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'))
    })

    let port = gutil.env.port ? parseInt(gutil.env.port) : 3000
    server.listen(port, (err) => {
        if (err) {
            return gutil.error(err)
        }

        webpack(cfg.get(true), (err, stats) => {
            log('watch', err, stats)
            gutil.log('Listening at http://localhost:' + port)
        })
    })
})

gulp.task('test', (done) => {
    gulp.src(cfg.ROOT.SRC + '/**/*.test.js')
        .pipe(jasmine({
            reporter: new jasmineReporter({
                isVerbose: true,
                done: (success) => {
                    if (success) {
                        done()
                    }
                }
            })
        }))
})

gulp.task('deps', (done) => {
    ncu.run({ packageFile: 'package.json' })
       .then((dependencies) => {

            let maxLen = Object.keys(dependencies).reduce((maxLen, name) => {
                let nameLen = name.length
                return nameLen > maxLen ? nameLen : maxLen
            }, 0)

            gutil.log('Dependencies to upgrade:')
            for (let name in dependencies) {
                gutil.log(leftPad(name, maxLen), '  -->  ', dependencies[name])
            }

            done()
        })
})

gulp.task('default', (done) => {
    let taskNamesArray = ['test', 'build', done]
    runSequence.apply(null, taskNamesArray)
})
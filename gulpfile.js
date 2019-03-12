'use strict'

var fs = require('fs')
var path = require('path')
var gulp = require('gulp')
var gutil = require('gulp-util')
var exec = require('done-exec')
var run = require('run-sequence')
var jsx = require('react-jsx-anywhere/gulp')

function requirify(file, lib, callback) {
	fs.appendFile(
		file,
		'\nif (typeof module === "object" && typeof module.exports === "object") { module.exports = ' + lib + ' } else { window.' + lib + ' = ' + lib + ' }',
		{encoding: 'utf8'},
		callback
	)
}

function tsc(ts, module) {
	return [
		'node',
		'tsc/tsc.js',
		'--target es5',
		'--module ' + module,
		'--sourcemap',
		'--declaration',
		ts
	].join(' ')
}

gulp.task('jsx-commonjs', function() {
	gulp.src('src/**/*.ts')
		.pipe(jsx())
		.pipe(gulp.dest('dist_commonjs'))
})

gulp.task('jsx-amd', function() {
	gulp.src('src/**/*.ts')
		.pipe(jsx())
		.pipe(gulp.dest('dist_amd'))
})

gulp.task('tsc-commonjs', function (done) {
	exec(tsc('dist_commonjs/ssenkit.ts', 'commonjs')).run(done)
})

gulp.task('tsc-amd', function (done) {
	exec(tsc('dist_amd/ssenkit.ts', 'amd')).run(done)
})

gulp.task('clear', function (done) {
	exec('rm -rf dist_*/*').run(done)
})

gulp.task('learn-annotations', function(done) {
	exec(tsc('test/learn-annotations.ts', 'commonjs'))
		// .add('node test/learn-annotations')
		.run(done)
})

gulp.task('learn-bind', function(done) {
	exec(tsc('test/learn-bind.ts', 'commonjs'))
		// .add('node test/learn-bind')
		.run(done)
})

gulp.task('test-di', function(done) {
	exec(tsc('test/test-di.ts', 'commonjs'))
		// .add('node test/test-di')
		.run(done)
})

gulp.task('learn', function() {
	run(
		'clear',
		'jsx-commonjs',
		'learn-annotations'
		//'learn-bind',
		//'test-di'
	)
})

gulp.task('build-www', function(done) {
	exec(tsc('www/js/main.ts', 'www/js/main.js', 'amd'))
		.run(done)
})

gulp.task('www', function() {
	run('clear', 'jsx-amd', 'tsc-amd', 'build-www')
})

gulp.task('default', function () {
	run(
		'clear',
		['jsx-commonjs', 'jsx-amd'], 
		['tsc-commonjs', 'tsc-amd']
	)
})

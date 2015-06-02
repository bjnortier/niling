var gulp = require('gulp');
var path = require('path');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var mocha = require('gulp-mocha');
var webpack = require('gulp-webpack-build');

var srcFiles = path.join('lib', '**', '*.js');
var unitTestFiles = path.join('test', 'unit', '**', '*.test.js');
var functionalTestFiles = path.join('test', 'functional', 'src', '*.js');

// ----- Individual Tasks -----

gulp.task('clearconsole', function() {
  process.stdout.write('\x1Bc');
});

gulp.task('jshint', function() {
  return gulp.src([srcFiles, unitTestFiles, functionalTestFiles])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function() {
  return gulp.src([srcFiles, unitTestFiles])
    .pipe(jscs());
});

gulp.task('unit', function() {
  return gulp.src(unitTestFiles)
    .pipe(mocha({}));
});

var webpackOptions = {
  debug: true,
};
var webpackConfig = {};

gulp.task('webpack:functional', [], function() {
  return gulp.src(path.join('webpack.functional.config.js'))
    .pipe(webpack.configure(webpackConfig))
    .pipe(webpack.overrides(webpackOptions))
    .pipe(webpack.compile())
    .pipe(webpack.format({
      version: false,
      timings: true
    }))
    .pipe(webpack.failAfter({
      errors: true,
      warnings: true
    }));
});

gulp.task('webpack:unit', [], function() {
  return gulp.src(path.join('webpack.unit.config.js'))
    .pipe(webpack.configure(webpackConfig))
    .pipe(webpack.overrides(webpackOptions))
    .pipe(webpack.compile())
    .pipe(webpack.format({
      version: false,
      timings: true
    }))
    .pipe(webpack.failAfter({
      errors: true,
      warnings: true
    }));
});

// ----- Aggregate Tasks -----

gulp.task('test', ['jshint', 'jscs', 'unit', 'webpack:unit', 'webpack:functional']);

gulp.task('default', ['test']);

gulp.task('watch', function() {
  gulp.watch(srcFiles, ['clearconsole', 'jshint', 'jscs', 'unit', 'webpack:unit', 'webpack:functional']);
  gulp.watch([unitTestFiles, 'test/unit/storetestgenerate.js'], ['clearconsole', 'jshint', 'jscs', 'unit', 'webpack:unit'])
  gulp.watch(functionalTestFiles, ['clearconsole', 'jshint', 'jscs', 'webpack:functional']);
});
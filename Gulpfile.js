'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourceMaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var PATHS = {
  BUILD_DIR: 'dashboardClient/build',

  SCSS: [
    'dashboardClient/scss/**/*.scss'
  ],

  SCSS_INCLUDE: [
    'node_modules/bootstrap-sass/assets/stylesheets'
  ]
};

gulp.task('styles', function () {
  return gulp.src(PATHS.SCSS)
    .pipe(sourceMaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(PATHS.BUILD_DIR));
});

gulp.task('styles:watch', function () {
  return gulp.watch(PATHS.SCSS, ['styles']);
});

gulp.task('default', [
  'styles',
  'styles:watch'
]);

var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    bs           = require('browser-sync').create(),
    imagemin     = require('gulp-imagemin'),
    plumber      = require('gulp-plumber'),
    clean        = require('gulp-clean'),
    gh_pages     = require('gulp-gh-pages');

gulp.task('html', function() {
  // copy any html files in source/ to public/
  gulp.src('src/*.html').pipe(gulp.dest('dist'));
});

gulp.task('css', function() {
  gulp.src('src/css/styles.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['./node_modules']
    }))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(gulp.dest('dist/css'))
    .pipe(bs.stream());
});

gulp.task('img', function() {
  gulp.src('src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
    .pipe(bs.stream())
});

gulp.task('watch', function(){
  gulp.watch('src/css/**/*.scss', ['css']);
  gulp.watch('src/*.html', ['html']).on('change', bs.reload);
  gulp.watch('src/img/*', ['img']);
});

gulp.task('browser-sync', function() {
  bs.init({
    server: { baseDir: './dist' }
  });
});

gulp.task('clean', function() {
  gulp.src('dist/*', { read: false }).pipe(clean());
});

gulp.task('deploy', function() {
  gulp.src('dist/**/*').pipe(gh_pages());
});

gulp.task('production', function() {
  // Copy CNAME to dist folder for GH Pages
  gulp.src('src/CNAME').pipe(gulp.dest('dist'));
});

// Basic build task
gulp.task('build:dev', ['html', 'css', 'img']);

// Build production task
gulp.task('build:prod', ['html', 'css', 'img', 'production']);

// Default task for development: build, browser sync, watch
gulp.task('default', ['build:dev', 'browser-sync', 'watch']);

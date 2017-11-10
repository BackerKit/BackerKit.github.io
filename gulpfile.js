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
  return gulp.src('dist/**/*', { read: false }).pipe(clean());
});

gulp.task('push', function() {
  return gulp.src('dist/**/*').pipe(gh_pages())
});


// Basic build task
gulp.task('build', ['html', 'css', 'img']);

// Default task for development: build, browser sync, watch
gulp.task('default', ['build', 'browser-sync', 'watch']);

// Deployment task: cleans dist/, builds, and pushes to gh-pages
gulp.task('deploy', ['clean', 'build', 'push']);

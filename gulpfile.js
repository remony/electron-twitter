var gulp = require('gulp');
var run = require('gulp-run');
var livereload = require('gulp-livereload');
var sass = require('gulp-sass');
var electron = require('electron-connect').server.create();


gulp.task('serve', function () {
  livereload.listen();
  // Start browser process
  electron.start();

  // Restart browser process
  gulp.watch('app.js', electron.restart);

  // Reload renderer process
  // gulp.watch(['index.js', 'index.html'], electron.reload);
  gulp.watch('app/**/*.*', electron.reload);
});

gulp.task('debugger', function () {
  livereload.listen();
  // Start browser process
  electron.start();

  // Restart browser process
  gulp.watch('app.js', electron.restart);

  // Reload renderer process
  // gulp.watch(['index.js', 'index.html'], electron.reload);
  gulp.watch('app/**/*.*', electron.reload);
});

gulp.task('sass', function () {
  electron.reload
  return gulp.src('./app/assets/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/assets/css'));

});

gulp.task('sass:watch', function () {
  gulp.watch('./app/assets/sass/**/*.scss', ['sass']);
});

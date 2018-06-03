var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var child = require('child_process');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function(done) {

  // Bootstrap
  gulp.src([
      './node_modules/bootstrap/dist/**/*',
      '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
      '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
    .pipe(gulp.dest('./vendor/bootstrap'))

  // // Font Awesome
  // gulp.src([
  //     './node_modules/@fortawesome/fontawesome-free-webfonts/**/*',
  //     '!./node_modules/@fortawesome/fontawesome-free-webfonts/{less,less/*}',
  //     '!./node_modules/@fortawesome/fontawesome-free-webfonts/{scss,scss/*}',
  //     '!./node_modules/@fortawesome/fontawesome-free-webfonts/.*',
  //     '!./node_modules/@fortawesome/fontawesome-free-webfonts/*.{txt,json,md}'
  //   ])
  //   .pipe(gulp.dest('./vendor/font-awesome'))

  // Font Animate css
  gulp.src([
      './node_modules/animate.css/animate.css',
      './node_modules/animate.css/animate.min.css'
    ])
    .pipe(gulp.dest('./vendor/animate.css'))

  // Device Mockups
  gulp.src([
      './node_modules/device-mockups/*',
    ])
    .pipe(gulp.dest('./vendor/device-mockups/'))

  // jQuery
  gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'))

  // jQuery Easing
  gulp.src([
      './node_modules/jquery.easing/*.js'
    ])
    .pipe(gulp.dest('./vendor/jquery-easing'))

  // Simple Line Icons
  gulp.src([
      './node_modules/simple-line-icons/fonts/**',
    ])
    .pipe(gulp.dest('./vendor/simple-line-icons/fonts'))

  gulp.src([
      './node_modules/simple-line-icons/css/**',
    ])
    .pipe(gulp.dest('./vendor/simple-line-icons/css'))
    done();
});

// Compile SCSS
gulp.task('css:compile', function() {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./css'))
});

// Minify CSS
gulp.task('css:minify', gulp.series('css:compile', function() {
  return gulp.src([
      './css/*.css',
      '!./css/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./css'));
}));

// CSS
gulp.task('css', gulp.series('css:compile', 'css:minify'));

// Minify JavaScript
gulp.task('js:minify', function() {
  return gulp.src([
      './js/*.js',
      '!./js/*.min.js'
    ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./js'))
});

// JS
gulp.task('js', gulp.series('js:minify'));

// Default task
gulp.task('default', gulp.series('css', 'js', 'vendor'));

// Runs Jekyll serve
gulp.task('jekyll', function() {
    child.spawn('jekyll', [
        'serve',
        '--watch',
        '--incremental',
        '--drafts'
    ] );
});

// Dev task
gulp.task('dev', gulp.series('css', 'js', 'vendor', 'jekyll', function() {
  gulp.watch('./scss/*.scss', ['css']);
  gulp.watch('./js/*.js', ['js']);
}));

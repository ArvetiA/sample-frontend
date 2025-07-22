const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const { deleteAsync } = require('del');

// ✅ All your files are in the project root
const paths = {
  html: ['index.html','Login.html'],
  css: 'style.css',
  js: ['EmployeController.js', 'EmployeService.js', 'LoginController.js', 'LoginService.js'],
  dist: 'dist'
};

// Clean dist folder
function clean() {
  return deleteAsync([paths.dist]);
}

// Copy index.html to dist/
function htmlTask() {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.stream());
}

// Copy style.css to dist/
function cssTask() {
  return gulp.src(paths.css)
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.stream());
}

// Copy JS files to dist/
function jsTask() {
  return gulp.src(paths.js)
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.stream());
}

// Serve files from dist/
function serve(done) {
  browserSync.init({
    server: {
      baseDir: paths.dist
    },
    port: 3002
  });
  done();
}

// Watch for file changes
function watchFiles() {
  gulp.watch(paths.html, htmlTask);
  gulp.watch(paths.css, cssTask);
  gulp.watch(paths.js, jsTask);
}

// Build and dev pipeline
const build = gulp.series(clean, gulp.parallel(htmlTask, cssTask, jsTask));
const dev = gulp.series(build, serve, watchFiles);

// Export tasks
exports.clean = clean;
exports.build = build;
exports.dev = dev;
exports.default = dev;

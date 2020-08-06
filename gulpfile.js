const { src, dest, watch, series, parallel } = require("gulp");

const pug = require("gulp-pug");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

const files = {
  pathSCSS: "app/scss/**/*.scss",
  pathJS: "app/js/**/*.js",
  pathPug: "app/index.pug",
};

// Compiles index.pug into index.html
function compilePug() {
  return src(files.pathPug)
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(dest("dist"));
}

// Compiles style.scss into style.css
function compileSCSS() {
  return src(files.pathSCSS)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist"));
}

// Concatenates and uglifies JS files to all.js
function compileJS() {
  return src([files.pathJS])
    .pipe(concat("all.js"))
    .pipe(uglify())
    .pipe(dest("dist"));
}

// Watch Pug, SCSS and JS files for changes, run compile tasks when they do
function watchForChanges() {
  watch(
    [files.pathPug, files.pathSCSS, files.pathJS],
    series(parallel(compilePug, compileSCSS, compileJS))
  );
}

exports.default = series(
  parallel(compilePug, compileSCSS, compileJS, watchForChanges)
);

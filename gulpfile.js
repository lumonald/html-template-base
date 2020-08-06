const { src, dest, watch, series, parallel } = require("gulp");

const pug = require("gulp-pug");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

const srcFiles = {
  pathPug: "app/index.pug",
  pathSCSS: "app/scss/**/*.scss",
  pathJS: "app/js/**/*.js",
};

const destFolders = {
  readable: "dist",
  minified: "dist-minified",
};

// Compiles index.pug into readable index.html
function compileToReadableHTML() {
  return src(srcFiles.pathPug)
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(dest("dist"));
}

// Compiles index.pug into minified index.html
function compileToMinifiedHTML() {
  return src(srcFiles.pathPug).pipe(pug()).pipe(dest(destFolders.minified));
}

// Compiles style.scss into readable style.css
function compileToReadableCSS() {
  return src(srcFiles.pathSCSS)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(sourcemaps.write("."))
    .pipe(dest(destFolders.readable));
}

// Compiles style.scss into minified style.css
function compileToMinifiedCSS() {
  return src(srcFiles.pathSCSS)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest(destFolders.minified));
}

// Concatenates JS files to all.js
function compileToReadableJS() {
  return src([srcFiles.pathJS])
    .pipe(concat("all.js"))
    .pipe(dest(destFolders.readable));
}

// Concatenates and uglifies JS files to all.js
function compileToMinifiedJS() {
  return src([srcFiles.pathJS])
    .pipe(concat("all.js"))
    .pipe(uglify())
    .pipe(dest(destFolders.minified));
}

// Watch Pug, SCSS and JS files for changes, run compile tasks when they do
function watchForChanges() {
  watch(
    [srcFiles.pathPug, srcFiles.pathSCSS, srcFiles.pathJS],
    series(
      parallel(compileToReadableHTML, compileToReadableCSS, compileToReadableJS)
    )
  );
}

// Default command will run the functions to make redable versions and
// then will watch files for changes and re-run the functions when needed
exports.default = series(
  parallel(
    compileToReadableHTML,
    compileToReadableCSS,
    compileToReadableJS,
    watchForChanges
  )
);

// Creates minified version of everything in destFolders.minified
exports.minify = series(
  parallel(compileToMinifiedHTML, compileToMinifiedCSS, compileToMinifiedJS)
);

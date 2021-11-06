const { src, dest, parallel, series, watch } = require("gulp");

// Load plugins

//const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
//const sass = require("gulp-sass")(require("sass"));
//const autoprefixer = require("gulp-autoprefixer");
//const cssnano = require("gulp-cssnano");
const concat = require("gulp-concat");
const clean = require("gulp-clean");
//const imagemin = require("gulp-imagemin");
//const cwebp = require('gulp-cwebp');
//const imageminMozjpeg = require('imagemin-mozjpeg');
const changed = require("gulp-changed");
const stripDebug = require("gulp-strip-debug");
const browsersync = require("browser-sync").create();

// Clean dist

function clear() {
  return src("./dist/*", {
    read: false
  }).pipe(clean());
}

// JS function

/* function js() {
  const source = "./src/js/*.js";

  return (
    src(source)
      .pipe(changed(source))
      .pipe(concat("bundle.js"))
      //.pipe(uglify())
      .pipe(
        rename({
          extname: ".min.js"
        })
      )
      .pipe(stripDebug())
      .pipe(dest("./dist/js/"))
      .pipe(browsersync.stream())
  );
} */

// html function
function html() {
  const source = "./src/*.html";

  return src(source)
    .pipe(changed(source))
    .pipe(dest("./dist/"))
    .pipe(browsersync.stream());
}

// CSS function

function css() {
  const source = "./src/css/*.css";

  return (
    src(source)
      .pipe(changed(source))
      //.pipe(sass())
      /*.pipe(
      autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false,
      })
    )*/
      .pipe(concat("styles.css"))
      .pipe(
        rename({
          extname: ".min.css"
        })
      )
      //.pipe(cssnano())
      .pipe(dest("./dist/css/"))
      .pipe(browsersync.stream())
  );
}

// Optimize images

function img() {
  return (
    src("./src/images/*")
      /* .pipe(
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          //imagemin.mozjpeg({ quality: 75, progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
          imagemin.svgo({
            plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
          })
        ])
      ) */
      //.pipe(cwebp())
      .pipe(dest("./dist/images"))
  );
}

// Watch files

function watchFiles() {
  watch("./src/css/*", css);
  //watch("./src/js/*", js);
  watch("./src/images/*", img);
  watch("./src/*.html", html);
}

// BrowserSync

function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./dist"
    },
    port: 3000
  });
}

// Tasks to define the execution of the functions simultaneously or in series

exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, parallel(css, img, html));

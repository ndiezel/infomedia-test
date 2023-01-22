//Подключаем модули галпа
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cleancss = require('gulp-clean-css');
const rigger = require('gulp-rigger');
const uglify = require('gulp-uglify-es').default;
const notify = require('gulp-notify');
const del = require('del');
const browserSync = require('browser-sync').create();
const cached = require('gulp-cached');
const dependents = require('gulp-dependents');
const imagemin = require('gulp-imagemin');

//Порядок подключения css файлов
const cssFiles = [
    './src/style/**/*.scss'
]
//Порядок подключения js файлов
const jsFiles = [
    './src/js/**/*.js'
]

//Таск на стили CSS
function styles() {
    //Шаблон для поиска файлов CSS
    //Всей файлы по шаблону './src/css/**/*.css'
    return gulp.src(cssFiles)
        .pipe(sass({
            outputStyle: 'compressed'
        }).on("error", notify.onError()))
        .pipe(postcss([autoprefixer()]))
        .pipe(cleancss({
            level: {
                1: {
                    specialComments: 0
                }
            }
        })) // Opt., comment out when debugging
        //Выходная папка для стилей
        .pipe(cached('sass'))
        .pipe(dependents())
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}

//Таск на скрипты JS
function scripts() {
    //Шаблон для поиска файлов JS
    //Всей файлы по шаблону './src/js/**/*.js'
    return gulp.src(jsFiles)
        //Объединение файлов в один
        .pipe(rigger())
        //Минификация JS
        .pipe(uglify())
        //Выходная папка для скриптов
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}

// HTML Live Reload
function htmlFile() {
    return gulp.src('./src/*.html')
        .pipe(rigger())
        .pipe(cached())
        .pipe(dependents())
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
}

// Img task
function imgFile() {
    return gulp.src('./src/img/**/*.*')
       // .pipe(imagemin())
        .pipe(gulp.dest('./build/img'))
}

// fonts task
function fontsFile() {
    return gulp.src('./src/fonts/*.*')
        .pipe(gulp.dest('./build/fonts'))
}

//Удалить всё в указанной папке
function clean() {
    return del(['build/*'])
}

//Просматривать файлы
function watch() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
    //Следить за CSS файлами
    gulp.watch('./src/style/**/*.scss', styles)
    //Следить за JS файлами
    gulp.watch('./src/js/**/*.js', scripts)

    gulp.watch('./src/img/**/*.*', imgFile)
    gulp.watch('./src/**/*.html', htmlFile);
}

//Таск вызывающий функцию styles
gulp.task('styles', styles);

//Таск вызывающий функцию scripts
gulp.task('scripts', scripts);

gulp.task('imgFile', imgFile);

gulp.task('fontsFile', fontsFile);

gulp.task('htmlFile', htmlFile);
//Таск для очистки папки build
//gulp.task('del', clean);
//Таск для отслеживания изменений
gulp.task('watch', watch);
//Таск для удаления файлов в папке build и запуск styles и scripts
gulp.task('build', gulp.series(gulp.parallel(styles, scripts, htmlFile, fontsFile, imgFile)));
//Таск запускает таск build и watch последовательно
gulp.task('default', gulp.series('build', 'watch'));
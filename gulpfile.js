'use strict';

const {series, parallel}	= require('gulp'),
			gulp 								= require('gulp'),
			sass 								= require('gulp-sass'),
			browserSync 				= require('browser-sync').create(),
			concat							= require('gulp-concat'),
			uglify							= require('gulp-uglifyjs'),
			cssnano							=	require('gulp-cssnano'),
			rename							= require('gulp-rename'),
			del									= require('del'),
			imagemin						= require('gulp-imagemin'),
			pngquant						= require('imagemin-pngquant'),
			cache								= require('gulp-cache'),
			autoprefixer				= require('gulp-autoprefixer');

function styles() {
	return gulp
		.src('app/scss/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.stream());
}

// минимизация и добавления суффикса 'min' файлу стилей сторонних библиотек (libs.css становится libsьшт.css)
function csslibs() {
	return gulp
		.src('app/css/libs.css')
		.pipe(cssnano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/css'));
}

// конкатинация и сжимание файлов js подключаемых библиотек
function scripts() {
	return gulp
		.src([
			'app/libs/jquery/dist/jquery.min.js',
			'app/libs/owl.carousel/dist/owl.carousel.min.js'
		])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js/'));
}

// сжатие картинок
function img() {
	return gulp.src('app/img/**/*')
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('dist/img'));
}

// слежение за изменениями файлов при разработке
function watch() {
	browserSync.init({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
	gulp.watch('app/sass/**/*.sass', styles);
	gulp.watch('app/*.html').on('change', browserSync.reload);
	gulp.watch('app/js/**/*.js').on('change', browserSync.reload);
}

// удаление (очистка) директории 'dist' перед сборкой
function clean(done) {
	return del('dist');
		done();
}

// очистка кеша изображений
function cleanCache(done) {
	return cache.clearAll();
		done();
}

//сборка без очистки
function build(done) {

	const buildCss = gulp.src([
			'app/css/libs.min.css',
			'app/css/main.css'
		])
		.pipe(gulp.dest('dist/css'));

	const buildFonts = gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));

	const buildJs = gulp.src('app/js/**/*')
		.pipe(gulp.dest('dist/js'));

	const buildHtml = gulp.src('app/*.html')
		.pipe(gulp.dest('dist'));

	done();
}

exports.styles						= styles;
exports.csslibs						= csslibs;
exports.cssnano						= cssnano;
exports.rename						= rename;
exports.concat						= concat;
exports.uglify						= uglify;
exports.scripts						= scripts;
exports.img								= img;
exports.browserSync				= browserSync;
exports.watch							= watch;
exports.clean							= clean;
exports.cleanCache				= cleanCache;// запускать вручную, при необходимости
exports.build							= build;

// очистка + окончательная сборак
exports.finalBuild				= series(clean, styles, csslibs, scripts, img, build);
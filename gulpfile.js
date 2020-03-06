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
		.pipe(sass({outputStyle: 'expanded'}))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.stream());
}

function cssmin() {
	return gulp
		.src('app/css/main.css')
		.pipe(cssnano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/css'));
}

function scripts() {
	return gulp
		.src([
			'app/libs/jquery-3.4.1/jquery-3.4.1.js',
			'app/libs/slick-slider/slick.min.js'
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
	gulp.watch('app/scss/**/*.scss', styles);
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

	const buildCss = gulp.src('app/css/main.min.css')
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
exports.cssmin						= cssmin;
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
exports.finalBuild				= series(clean, styles, cssmin, scripts, img, build);
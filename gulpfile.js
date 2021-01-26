const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');


// Static server
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });

	gulp.watch('src/*.html').on('change', browserSync.reload);
});


//Сжатие css-файлов
gulp.task('styles', function() {
	return gulp.src("src/sass/**/*.+(scss|sass)")
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
			.pipe(rename({
				prefix: "",
				suffix: ".min",
			}))
			.pipe(autoprefixer()) //[autoprefixer()] будет брать свои настройки из файла package.json
								 //к объекту [browsersList] 
			.pipe(cleanCSS({compatibility: 'ie8'}))
			.pipe(gulp.dest("dist/css"))
			.pipe(browserSync.stream()); //Перезапуск browserSync		
})


gulp.task('watch', function() {
	gulp.watch('src/sass/**/*.+(scss|sass|css)', gulp.parallel("styles"));
	gulp.watch('src/*.html').on('change', gulp.parallel('html'));
});


//Сжатие html-кода
gulp.task('html', function() {
	return gulp.src("src/*.html")
				.pipe(htmlmin({ collapseWhitespace: true }))
				.pipe(gulp.dest("dist/"));
});


//Сжатие script-ов
gulp.task('scripts', function() {
	return gulp.src("src/js/**/*.js") //Добывает все файлы js
				.pipe(gulp.dest("dist/js"));
});

//Сжатие шрифтов
gulp.task('fonts', function() {
	return gulp.src("src/fonts/**/*")
				.pipe(gulp.dest("dist/fonts"));
});


gulp.task('images', function() {
	return gulp.src("src/img/**/*")
				.pipe(imagemin())
				.pipe(gulp.dest("dist/img"));
});


gulp.task('icons', function() {
	return gulp.src("src/icons/**/*")
				.pipe(gulp.dest("dist/icons"));
});


//Перемещение папки [mailer] в папку [dist]
gulp.task('mailer', function() {
	return gulp.src("src/mailer/**/*")
				.pipe(gulp.dest("dist/mailer"));
});




gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'scripts', 'fonts', 'images', 'icons', 'mailer', 'html')); //Запуск компиляции указанных файлов
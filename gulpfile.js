const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');


// Static server
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "src"
        }
    });
});


gulp.task('styles', function() {
	return gulp.src("src/sass/blocks/*.+(scss|sass)")
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
			.pipe(rename({
				prefix: "",
				suffix: ".min",
			}))
			.pipe(autoprefixer()) //[autoprefixer()] будет брать свои настройки из файла package.json
								 //к объекту [browsersList] 
			.pipe(cleanCSS({compatibility: 'ie8'}))
			.pipe(gulp.dest("src/css"))
			.pipe(browserSync.stream()); //Перезапуск browserSync		
})


gulp.task('watch', function() {
	gulp.watch('src/sass/*.+(scss|sass)', gulp.parallel("styles"));
	gulp.watch('src/*.html').on('change', browserSync.reload);
});


gulp.task('default', gulp.parallel('watch', 'server', 'styles')); //Запуск компиляции указанных файлов
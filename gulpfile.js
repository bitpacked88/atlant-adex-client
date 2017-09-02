var gulp = require('gulp');
var combiner = require('stream-combiner2');
var plugins = require('gulp-load-plugins')();

var runSequence = require('run-sequence'),
    del = require('del'),
    path = require('path'),
    through = require('through2');

var htmlMinOptions = {
    collapseWhitespace: true,
    removeComments: true
};

gulp.task('default', function(){
    gulp.watch('./src/less/**/*.less', ['less']);
});

gulp.task('less', function() {

    var combined = combiner.obj([
        gulp.src('./src/less/style.less'),
        plugins.less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }),
        gulp.dest('./src/css')
    ]);

    // any errors in the above streams will get caught
    // by this listener, instead of being thrown:
    combined.on('error', function(){
        //gulp.task('default');
    });

    return combined;
});

gulp.task('clean', function(cb){
    del(['./dist/**/*'], cb);
});

gulp.task('copy.swf', function(){
    return gulp.src('./src/bower_components/zeroclipboard/dist/ZeroClipboard.swf').pipe(gulp.dest('./dist/js/'));
});

gulp.task('copy.assets', function() {
    return gulp.src('./src/assets/**/*').
        pipe(gulp.dest('./dist/assets/'));
});

gulp.task('copy.html', function() {
    return gulp.src(['./src/404.html', './src/favicon.ico', './src/robots.txt']).
        pipe(gulp.dest('./dist/'));
});

gulp.task('copy.cssprint', function() {
    return gulp.src(['./src/css/print.css']).
        pipe(gulp.dest('./dist/css'));
});

gulp.task('copy.pages', function(){
    return gulp.src(['src/pages/**/*.html']).pipe(plugins.htmlmin(htmlMinOptions)).pipe(gulp.dest('./dist/pages'));
});

gulp.task('copy', ['copy.assets', 'copy.html', 'copy.pages', 'copy.swf', 'copy.cssprint']);

gulp.task('templates', function(){
    return gulp.src(['src/views/**/*.html', 'src/layouts/**/*.html'])
        .pipe(plugins.htmlmin(htmlMinOptions))
        .pipe(plugins.ngHtml2js({
            base: 'src/',
            externalModule: true
        }))
        .pipe(plugins.concat('templates.js'))
        .pipe(plugins.wrap('angular.module(\'web\').run([\'$templateCache\', function($templateCache){<%= contents %>}]);'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('useref', function(){
    var assets = plugins.useref.assets(),
        filterHtml = plugins.filter('**/*.html'),
        filter = plugins.filter(['**/*.js', '!**/vendor.js']);

    return gulp.src(['src/index.html', 'src/localStorageInjector.html'])
        .pipe(assets)
        .pipe(filter)
        .pipe(plugins.uglify({mangle: true, compress: false}))
        .pipe(filter.restore())
        .pipe(assets.restore())
        .pipe(plugins.useref())
        .pipe(filterHtml)
        .pipe(plugins.htmlmin(htmlMinOptions))
        .pipe(filterHtml.restore())
        .pipe(gulp.dest('dist'))
        .on('error', function(){})
});

gulp.task('build', function(cb){
    runSequence(
        ['clean', 'less', 'templates'],
        ['copy', 'useref'],
        cb
    );
});
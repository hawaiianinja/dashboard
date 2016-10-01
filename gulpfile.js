var gulp = require('gulp'),
    del = require('del'),
    eslint = require('gulp-eslint'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    rollup = require('gulp-rollup'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    clean = require('gulp-dest-clean'),    
    changed = require('gulp-changed');

gulp.task('lint', function() {
    return gulp.src(['src/scripts/app/**/*.js'])
        .pipe(eslint({
            parserOptions: {
                ecmaVersion: 5,
                sourceType: 'module'
            },            
            extends: 'eslint:recommended',
            rules: {
                'semi': 2,
                'quotes': ['error', 'single'],
                'no-redeclare': 0
            },
            globals: {
                'jQuery': false,
                '$': true,
                '_spPageContextInfo': true
            },
            env: {
                'browser': true
            }
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('initalizeBuild', ['lint'], function() {
    del('build/**/*');
    return gulp.src(['src/**/*', '!src/scripts/{app,app/**}','!src/styles/{app,app/**}'])
        .pipe(gulp.dest('build'));
});

gulp.task('rollupAppJs', ['initalizeBuild'], function() {
	return gulp.src('src/scripts/app/app.js', {read: true})
        .pipe(rollup({
            format: 'iife'
        }))
		.pipe(gulp.dest('build/scripts'));
});

gulp.task('concatAppCss', ['initalizeBuild'], function() {
	return gulp.src('src/styles/app/**/*.css')
		.pipe(concat('app.css'))
		.pipe(gulp.dest('build/styles'));
});

gulp.task('copySrcToBuild', ['initalizeBuild', 'rollupAppJs', 'concatAppCss'])

gulp.task('minimizeAppJs', ['copySrcToBuild'], function(cb) {
    gulp.src('build/scripts/app.js')
		.pipe(uglify())
        .pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('build/scripts'))
        .on('end', function() { 
            del('build/scripts/app.js')
            gulp.src('build/default.aspx')
                .pipe(replace(/scripts\/app\.js/g, 'scripts\/app.min.js'))
                .pipe(gulp.dest('build'))
                .on('end', cb);
        });
});

gulp.task('minimizeAppCss', ['copySrcToBuild'], function(cb) {
	gulp.src('build/styles/app.css')
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('build/styles'))
        .on('end', function() {
            del('build/styles/app.css') 
            gulp.src('build/default.aspx')
                .pipe(replace(/styles\/app\.css/g, 'styles\/app.min.css'))
                .pipe(gulp.dest('build'))
                .on('end', cb);
        });
});

gulp.task('minimizeApp', ['minimizeAppJs', 'minimizeAppCss'])

gulp.task('cacheBustBuildForTest', ['copySrcToBuild'], function(cb) {
    console.log('cacheBustBuildForTest');
    cb();
});

gulp.task('cacheBustBuildForPages', ['copySrcToBuild', 'minimizeApp'], function(cb) {
    console.log('cacheBustBuildForPages');
    cb();
});

gulp.task('snycBuildWithTest', ['cacheBustBuildForTest'], function() {
    return gulp.src('build/**/*')
        .pipe(clean('deploy/test'))
        .pipe(changed('deploy/test', {hasChanged: changed.compareSha1Digest}))
        .pipe(gulp.dest('deploy/test'));
});

gulp.task('snycBuildWithPages', ['cacheBustBuildForPages'], function() {
    return gulp.src('build/**/*')
        .pipe(clean('deploy/pages'))
        .pipe(changed('deploy/pages', {hasChanged: changed.compareSha1Digest}))
        .pipe(gulp.dest('deploy/pages'));
});

gulp.task('deployTest', [
    'copySrcToBuild',
    'cacheBustBuildForTest',
    'snycBuildWithTest'
], function(cb) {
    var spawn = require('child_process').exec;
    var publishSite = spawn('Publish-Site -LocalFolder "' + process.cwd() + '\\deploy\\test" -SiteUrl "https://g2.cnic.navy.mil/tscnrh/N6/Apps/IAVM" -DocumentLibraryDisplayName "Test" -DocumentLibraryFolderName "Test"', {shell: true});
    publishSite.stdout.on('data', function(data) {
        console.log(data);
    });
    publishSite.stderr.on('data', function(data) {
        console.log(data);
    });
    publishSite.on('close', function(code) {
        cb(code);
    });
    publishSite.stdin.end();
});

gulp.task('deployPages', [
    'copySrcToBuild',
    'minimizeApp',
    'cacheBustBuildForPages',
    'snycBuildWithPages'    
]), function(cb) {
    /*
    var spawn = require('child_process').exec;
    var publishSite = spawn('Publish-Site -LocalFolder "' + process.cwd() + '\\deploy\\pages" -SiteUrl "https://g2.cnic.navy.mil/tscnrh/N6/Apps/IAVM" -DocumentLibraryDisplayName "Pages" -DocumentLibraryFolderName "Pages"', {shell: true});
    publishSite.stdout.on('data', function(data) {
        console.log(data);
    });
    publishSite.stderr.on('data', function(data) {
        console.log(data);
    });
    publishSite.on('close', function(code) {
        cb(code);
    });
    publishSite.stdin.end();
    */     
};
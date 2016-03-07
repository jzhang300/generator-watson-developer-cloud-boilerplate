/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var iconfont = require('gulp-iconfont');
var iconfontCSS = require('gulp-iconfont-css');
var clean = require('gulp-clean');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var plumber = require('gulp-plumber');
var jeditor = require('gulp-json-editor');
var rename = require('gulp-rename');
var env = require('gulp-env');
var reload = browserSync.reload;

/**
 * Gulp Tasks
 */

gulp.task('default', ['browser-sync', 'compile'], function() {
    gulp.watch(['public/images/icons/*.svg'], ['icon-fonts']);
    gulp.watch(['public/scss/**/*.*'], ['sass']);
    gulp.watch(['public/js/**/*.*'], ['js']);
});

// compile everything
gulp.task('compile', ['sass', 'js', 'icon-fonts']);

// Reload all Browser windows
gulp.task('bs-reload', function() {
    browserSync.reload();
});

// set some bluemix variables
gulp.task('set-env', function() {
  env({
    file: '.env.js',
    vars: {
      //NODE_DEBUG: 'request', //debug HTTP requests
      // NODE_ENV: 'production'
      NODE_ENV: 'development'
    }
  });
});

// browser-sync start server
gulp.task('browser-sync', ['set-env','nodemon'], function() {
    browserSync({
        proxy: 'localhost:3000', // local node app address
        port: 5000, // use *different* port than above
        notify: true
    });
});

// initiate nodemon
gulp.task('nodemon', function(cb) {
    var called = false;
    return nodemon({
        script: 'app.js',
        ext: 'ejs',
        ignore: [
            'gulpfile.js',
            'node_modules/'
        ]
    })
    .on('start', function() {
        if (!called) {
            called = true;
            cb();
        }
    })
    .on('restart', function() {
        setTimeout(function() {
            reload({
                stream: false
            });
        }, 1000);
    });
});

// compile sass to main.css
gulp.task('sass', function() {
  return gulp.src(['public/scss/**/*.scss'])
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest('public/css'))
    .pipe(reload({
      stream:true
    }));
});

// compile js to main.js
gulp.task('js', function() {
  return gulp.src(['public/js/**/*.js'])
  .pipe(reload({stream:true}));
});

// compile icons to icon-fonts
gulp.task('icon-fonts', function(){
  gulp.src(['public/images/icons/*.svg'])
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(iconfontCSS({
    fontName: 'icons',
    targetPath: '../../scss/components/icon-fonts/_icon-fonts.scss',
    fontPath: '../fonts/icon-fonts/'
  }))
  .pipe(iconfont({
    fontName: 'icons', // required
    appendCodepoints: true, // recommended option
    normalize: true
  }))
  .on('codepoints', function(codepoints, options) {
    // CSS templating, e.g.
    console.log(codepoints, options);
  })
  .pipe(gulp.dest('./public/fonts/icon-fonts/'))
  .pipe(reload({stream:true}));
});

// build for github code repo
gulp.task('build', ['clear'], function() {
  var buildPath = './dist';

  // app.js
  gulp.src(['./app.js']).pipe(gulp.dest(buildPath));


  // uploads
  gulp.src(['./uploads/']).pipe(gulp.dest(buildPath));

  // config/
  gulp.src(['./config/**/*.js']).pipe(gulp.dest(buildPath + '/config'));

  // manifest.yml
  gulp.src(['./manifest.yml']).pipe(gulp.dest(buildPath));

  // .cfignore
  gulp.src(['./.cfignore']).pipe(gulp.dest(buildPath));

  // .gitignore
  gulp.src(['./.gitignore_github'])
    .pipe(rename('.gitignore'))
    .pipe(gulp.dest(buildPath));

  // CONTRIBUTING.md
  gulp.src(['./CONTRIBUTING_github.md'])
    .pipe(rename('CONTRIBUTING.md'))
    .pipe(gulp.dest(buildPath));

  // package.json
  gulp.src(['./package.json'])
    .pipe(jeditor(function(json) {
      delete json['devDependencies'];
      return json;
    }))
    .pipe(gulp.dest(buildPath));

  // README.md
  gulp.src(['./README_github.md'])
    .pipe(rename('README.md'))
    .pipe(gulp.dest(buildPath));

  // views
  gulp.src(['./views/**/*.ejs'])
    .pipe(gulp.dest(buildPath + '/views'));

  // css
  gulp.src(['./public/css/style.css'])
    .pipe(gulp.dest(buildPath + '/public/css'));

  // data
  gulp.src(['./public/data/**/*.*'])
    .pipe(gulp.dest(buildPath + '/public/data'));

  // fonts
  gulp.src(['./public/fonts/**/*.*'])
    .pipe(gulp.dest(buildPath + '/public/fonts'));

  // images
  gulp.src(['./public/images/**/*.*'])
    .pipe(gulp.dest(buildPath + '/public/images'));

  // js
  gulp.src(['./public/js/**/*.js'])
    .pipe(gulp.dest(buildPath + '/public/js'));
});


// build for live demo hosted on Bluemix
gulp.task('build:demo', ['clear:demo'], function() {
  var buildPath = './build/demo';

  // app.js
  gulp.src(['./app.js']).pipe(gulp.dest(buildPath));

  // config/
  gulp.src(['./config/**/*.js', '!./config/routes/**/*.js'])
    .pipe(gulp.dest(buildPath + '/config'));

  // routes
  gulp.src(['./config/routes/index_demo.js'])
    .pipe(rename('index.js'))
    .pipe(gulp.dest(buildPath + '/config/routes'));

  // .cfignore
  gulp.src(['./.cfignore']).pipe(gulp.dest(buildPath));

  // .gitignore
  gulp.src(['./.gitignore_demo'])
    .pipe(rename('.gitignore'))
    .pipe(gulp.dest(buildPath));

  // CONTRIBUTING.md
  gulp.src(['./CONTRIBUTING_demo.md'])
    .pipe(rename('CONTRIBUTING.md'))
    .pipe(gulp.dest(buildPath));

  // package.json
  gulp.src(['./package.json'])
    .pipe(jeditor(function(json) {
      delete json['devDependencies'];
      return json;
    }))
    .pipe(gulp.dest(buildPath));

  // README.md
  gulp.src(['./README_demo.md'])
    .pipe(rename('README.md'))
    .pipe(gulp.dest(buildPath));

  // views
  gulp.src(['./views/index.html'])
    .pipe(minifyHtml())
    .pipe(gulp.dest(buildPath + '/views'));

  // css
  gulp.src(['./public/css/style.css'])
    .pipe(minifyCss())
    .pipe(gulp.dest(buildPath + '/public/css'));

  // data
  gulp.src(['./public/data/**/*.*', '!./public/data/README.md'])
    .pipe(gulp.dest(buildPath + '/public/data'));

  // fonts
  gulp.src(['./public/fonts/**/*.*'])
    .pipe(gulp.dest(buildPath + '/public/fonts'));

  // images
  gulp.src(['./public/images/**/*.*'])
    .pipe(gulp.dest(buildPath + '/public/images'));

  // js
  gulp.src(['./public/js/**/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest(buildPath + '/public/js'));
});

// empty all the builds
gulp.task('clear', ['clear:github', 'clear:demo']);

// empty build/github
gulp.task('clear:github', function() {
  var buildPath = './build/github';
  return gulp.src(buildPath)
    .pipe(clean());
});

// empty build/demo
gulp.task('clear:demo', function() {
  var buildPath = './build/demo';
  return gulp.src(buildPath)
    .pipe(clean());
});

// error catching to prevent gulp from crashing
var onError = function(error) {
  //If you want details of the error in the console
  console.log(error);
  this.emit('end');
};

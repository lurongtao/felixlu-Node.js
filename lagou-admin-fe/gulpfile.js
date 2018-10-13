/**
  gulp完成的任务：
  1、webserver
  2、编译sass
  3、CommonJS模块化
  4、反向代理，Mock数据
  5、在Gulp里应用babel
 */

const gulp = require('gulp')

const server = require('gulp-webserver')

const sass = require('gulp-sass')

const webpack = require('webpack-stream')

const proxy = require('http-proxy-middleware')

const sequence = require('gulp-sequence')

const watch = require('gulp-watch')

gulp.task('server', () => {
  return gulp.src('./dev')
    .pipe(server({
      host: 'localhost',
      port: 8080,
      livereload: true,
      middleware: [
        proxy('/api', {
          target: 'http://localhost:3000',
          changeOrigin: true
        })
      ]
    }))
})

gulp.task('packscss', () => {
  return gulp.src('./src/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dev/styles'))
})

gulp.task('packjs', () => {
  return gulp.src('./src/scripts/*.js')
    .pipe(webpack({
      mode: 'development',
      entry: {
        app: ['@babel/polyfill', './src/scripts/app.js'],
      },
      output: {
        filename: '[name].js'
      },
      module: {
        rules: [
          {
            test: /\.html$/, 
            use: 'string-loader' 
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-transform-runtime']
              }
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest('./dev/scripts'))
})

gulp.task('copyhtml', () => {
  return gulp.src(['./src/*.html'])
    .pipe(gulp.dest('./dev/'))
})

gulp.task('copylibs', () => {
  return gulp.src(['./src/libs/**/*'])
    .pipe(gulp.dest('./dev/libs'))
})

gulp.task('copystatic', () => {
  return gulp.src(['./src/static/**/*'])
    .pipe(gulp.dest('./dev/static'))
})

gulp.task('watch', () => {
  watch('./src/*.html', () => {
    gulp.start('copyhtml')
  })
  watch('./src/styles/**/*', () => {
    gulp.start('packscss')
  })
  watch('./src/scripts/**/*', () => {
    gulp.start('packjs')
  })
  watch('./src/libs/**/*', () => {
    gulp.start('copylibs')
  })
  watch('./src/static/**/*', () => {
    gulp.start('copystatic')
  })
})

gulp.task('default', (cb) => {
  sequence(['packscss', 'packjs'], ['copylibs', 'copystatic', 'copyhtml'], 'server', 'watch')(cb)
})
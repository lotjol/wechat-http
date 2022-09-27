const { src, dest, parallel, series, watch } = require('gulp')

const jeditor = require('gulp-json-editor')
const tsc = require('gulp-typescript')
const del = require('delete')

function copy() {
  return src(['src/**/*.d.ts', 'README.md']).pipe(dest('package'))
}

function json() {
  return src('package.json')
    .pipe(
      jeditor((json: any) => {
        json.name = '@botue/wechat-http'
        json.devDependencies = {
          '@types/wechat-miniprogram': '^3.4.1',
        }
        return json
      })
    )
    .pipe(dest('package'))
}

function compile() {
  return src(['src/**/*.ts'])
    .pipe(
      tsc({
        skipLibCheck: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        esModuleInterop: true,
        module: 'commonjs',
        target: 'es2016',
      })
    )
    .pipe(dest('package'))
}

function install() {
  return src('src/**/*.ts').pipe(dest('miniprogram/utils/miniprogram-request'))
}

function clean(cb: any) {
  del(['package'], cb)
}

exports.default = () => {
  watch('src/**/*.ts', { events: 'all' }, install)
}

exports.json = json

exports.build = series(clean, parallel(compile, copy, json))

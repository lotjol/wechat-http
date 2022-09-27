const { src, dest, series } = require('gulp')

const tsc = require('gulp-typescript')

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

exports.build = series(compile)

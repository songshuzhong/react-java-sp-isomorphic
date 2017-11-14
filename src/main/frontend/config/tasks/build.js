const gulp = require( 'gulp' );
const webpack = require( 'webpack-stream' );

const webpackConfig = require( '../webpack.config' )( 'dev' );

const config = require( './settings' );

const output = config.paths.output;

module.exports = ( callback ) => {
  console.log( 'building......');

  return gulp.src( 'config/build-utils/index.js' )
    .pipe( webpack( webpackConfig ) )
    .pipe( gulp.dest( output.views ) );
};

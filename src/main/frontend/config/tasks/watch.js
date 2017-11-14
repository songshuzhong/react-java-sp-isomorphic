const path = require( 'path' );
const gulp = require( 'gulp' );

const config = require( './settings' );

const source = config.paths.source;

module.exports = ( callback ) => {
  console.log( 'watch files for changes......' );

  gulp.watch( [
      path.join( source.views, '**', '*.js' ),
      path.join( source.views, '**', '*.jsx' )
    ], [ 'build' ] ).on( 'change', ( event ) => {
    console.log( 'File ' + event.path + ' was ' + event.type + ', running tasks...' );
  } );
};

const gulp = require( 'gulp' );

const watch = require( './config/tasks/watch' );

const build = require( './config/tasks/build' );

gulp.task( 'watch', watch );

gulp.task( 'build', build );
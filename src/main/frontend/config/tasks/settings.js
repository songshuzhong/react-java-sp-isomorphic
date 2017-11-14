const path = require( 'path' );
const cwd = process.cwd();
const pkg = require( path.resolve( cwd, 'package.json' ) );

module.exports = {

  banner: [
    '/*!',
    ` * ${pkg.name} - ${pkg.description}`,
    ` * @version v${pkg.version}`,
    ` * @link ${pkg.homepage}`,
    ' * Copyright (C) 2017 BONC All rights reserved.',
    ' */',
    ''
  ].join( '\n'),

  paths: {
    source: {
      views: path.resolve( cwd, 'client/scripts' )
    },
    output: {
      views: path.resolve( cwd, '../resources/static' )
    }
  }
};
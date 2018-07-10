/**
 *@author sshuzhong
 *@mailTo <a href="mailto:songshuzhong@bonc.com.cn">Song ShuZhong</a>
 *@Date 2017/9/25$ 22:00$
 *@desc
 */
const path = require( 'path' );
const webpack = require( 'webpack' );
const autoprefixer = require( 'autoprefixer' );
const ManifestPlugin = require( 'webpack-manifest-plugin' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const { BundleAnalyzerPlugin } = require( 'webpack-bundle-analyzer' );

const ReactAssetPlugin = require( './build-utils/react-asset-plugin' );
const CleanWebpackPlugin = require( './build-utils/clean-webpack-plugin' );

const settings = require( './tasks/settings' );
const babelrc = require( './build-utils/babelrc' );

const babelOptions = Object.assign( {}, babelrc, { cacheDirectory: true } );

const dev = {
  entry: [
    './config/module-utils/index.js'
  ],

  output: {
    path: settings.paths.output.views,
    publicPath: '/bconsole/',
    filename: `static/js/${settings.config.js}.[hash:5].js`,
    chunkFilename: 'static/js/[name].chunk.min.js',
    libraryTarget: 'umd',
    library: 'EPMUIApp'
  },

  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.(js|jsx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions
          }
        ]
      },
      {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract( {
            publicPath: '../..',
            fallback: 'style-loader',
            use:[
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  minimize: true,
                  sourceMap: true
                }
              },
              {
                loader: 'less-loader'
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => [
                    require( 'postcss-flexbugs-fixes' ),
                    autoprefixer( {
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9',
                      ],
                      flexbox: 'no-2009'
                    } )
                  ]
                }
              } ]
          }
        )
      },
      { test: /\.(png|jpg|jpeg|gif)$/, loader: 'url-loader?limit=10000&name=static/images/[name].[ext]' },
      { test: /\.(eot|svg|ttf|woff|woff2)\w*/, loader: 'url-loader?limit=1000000&name=/static/media/[name].[ext]' }
    ]
  },

  externals: settings.config.static? settings.config.extLibs: {},

  resolve: {
    alias: { context: path.resolve( process.cwd(), 'bconsole.config.js' ) }
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ManifestPlugin( { fileName: `${settings.paths.output.views}/static/asset-manifest.json` } ),
    new ExtractTextPlugin({ filename: `static/cs/${settings.config.cs}.[hash:5].css` }),
    new CleanWebpackPlugin( [ `${settings.paths.output.views}/static/js/`,`${settings.paths.output.views}/static/cs/`], { verbose: false, dry: false, watch: true } ),
    new ReactAssetPlugin( settings.config )
  ]
};

const pro = {
  entry: [
    './config/module-utils/index.js'
  ],

  output: {
    path: settings.paths.output.views,
    publicPath: '/bconsole/',
    filename: `static/js/${settings.config.js}.[hash:5].min.js`,
    chunkFilename: 'static/js/[name].chunk.min.js',
    libraryTarget: 'umd',
    library: 'EPMUIApp'
  },

  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.(js|jsx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions
          }
        ]
      },
      {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract( {
            publicPath: '../..',
            fallback: 'style-loader',
            use:[
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  minimize: true,
                  sourceMap: true
                }
              },
              {
                loader: 'less-loader'
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => [
                    require( 'postcss-flexbugs-fixes' ),
                    autoprefixer( {
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9',
                      ],
                      flexbox: 'no-2009'
                    } )
                  ]
                }
              } ]
          }
        )
      },
      { test: /\.(png|jpg|jpeg|gif)$/, loader: 'url-loader?limit=10000&name=static/images/[name].[ext]' },
      { test: /\.(eot|svg|ttf|woff|woff2)\w*/, loader: 'url-loader?limit=1000000&name=/static/media/[name].[ext]' }
    ]
  },

  externals: settings.config.static? settings.config.extLibs: {},

  resolve: {
    alias: { context: path.resolve( process.cwd(), 'bconsole.config.js' ) }
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ManifestPlugin( { fileName: `${settings.paths.output.views}/static/asset-manifest.json` } ),
    new ExtractTextPlugin({ filename: `static/cs/${settings.config.cs}.[hash:5].min.css` }),
    new webpack.optimize.UglifyJsPlugin( { output: { comments: false }, compress: { warnings: false } } ),
    new CleanWebpackPlugin( [ `${settings.paths.output.views}/static/js/`,`${settings.paths.output.views}/static/cs/`], { verbose: false, dry: false, watch: true } ),
    new ReactAssetPlugin( settings.config ),
    new BundleAnalyzerPlugin( { analyzerMode: 'static', reportFilename: 'static/app.bundle.report.html', defaultSizes: 'parsed', openAnalyzer: false, logLevel: 'info' } )
  ]
};

module.exports = ( mode = process.env.NODE_ENV ) => {
  let mergedConfig = {};
  switch ( mode ) {
    default:
    case 'dev':
      mergedConfig = dev;
      break;
    case 'production':
      mergedConfig = pro;
      break;
  }

  return mergedConfig;
};

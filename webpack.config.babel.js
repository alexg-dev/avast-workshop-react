import webpack from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import autoprefixer from 'autoprefixer'
import path from 'path'


export default {

    ROOT: {
        BUILD: 'build',
        SRC: 'src'
    },

    get: function (watch = false) {

        let excludes = [
            path.resolve(__dirname, 'node_modules')
        ]

        let cfg = {
            context: path.join(__dirname, this.ROOT.SRC),

            entry: [
                './index.js'
            ],

            output: {
                path: './' + this.ROOT.BUILD,
                filename: 'app.js'
            },

            resolve: {
                extensions: ['', '.js', '.jsx'],
                modulesDirectories: ['node_modules']
            },

            module: {
                preLoaders: [
                    {   test: /\.jsx?$/,
                        loader: 'eslint',
                        exclude: excludes.concat(path.resolve(__dirname, 'src/js/background/legacy'))
                    }
                ],

                loaders: [
                    {   test: /eventemitter2/,
                        loader: 'imports?define=>false'
                    },

                    {   test: /\.js(x?)$/,
                        loader: 'babel',
                        exclude: excludes
                    },

                    {   test: /\.json$/,
                        loader: 'json'
                    },

                    {   test: /\.styl$/,
                        loader: ExtractTextPlugin.extract('style', 'css?postcss!stylus')
                    },

                    {   test: /\.ttf(\?.+)?$/,
                        loader: 'url',
                        query: {
                            limit: 10000,
                            mimetype: 'application/octet-stream',
                            name: '../fonts/[hash].[ext]'
                        }
                    },

                    {   test: /\.gif|jpg|png$/,
                        loader: 'url',
                        query: {
                            limit: 5000,
                            name: '../images/[hash].[ext]'
                        }
                    },

                    {   test: /\.svg$/,
                        loader: 'file',
                        query: {
                            name: '../images/[hash].[ext]'
                        }
                    },
                ]

            },

            postcss: function () {
                return [
                    autoprefixer({ browsers: ['last 2 versions'] })
                ]
            },

            eslint: {
                failOnError: false,
                failOnWarning: false
            },

            plugins: [
                new CleanWebpackPlugin([this.ROOT.BUILD], {
                    root: path.resolve(__dirname),
                    verbose: true, 
                    dry: false
                }),
                // new webpack.optimize.CommonsChunkPlugin({
                //     name: 'views-common',
                //     chunks: ['popup', 'settings']
                // }),
                new ExtractTextPlugin('../css/[name].css'),
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': '"production"'
                })
            ]
        }

        if (watch) {
            cfg.devtool = 'cheap-module-source-map'
            cfg.watch = true
            cfg.debug = true
        } else {
            cfg.plugins.push(new webpack.optimize.UglifyJsPlugin())
        }

        return cfg
    }

}
import webpack from 'webpack'
import CleanWebpackPlugin from 'clean-webpack-plugin'
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
                extensions: ['', '.js', '.jsx', '.css'],
                modulesDirectories: ['node_modules']
            },

            module: {
                preLoaders: [
                    {   test: /\.js$/,
                        loader: 'eslint',
                        query: {
                            parser: 'babel-eslint',
                            ecmaFeatures: {
                                modules: true
                            },
                            env: {
                                browser: true
                            },
                            rules: {
                                'no-unused-vars': 2,
                                'no-use-before-define': 2,
                                'no-shadow-restricted-names': 2,
                                'comma-dangle': 2,
                                'no-duplicate-case': 2,
                                'use-isnan': 2,
                                'valid-typeof': 2,
                                'no-eval': 2,
                                'no-multi-spaces': 2,
                                'no-script-url': 2,
                                'yoda': 2,
                                'no-mixed-spaces-and-tabs': 2,
                                'no-delete-var': 2,
                                'no-undefined': 2,
                                'camelcase': 2,
                                'no-func-assign': 2
                            }
                        },
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

                    {   test: /\.css$/,
                        loader: 'style!css'
                    },

                    {   test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                        loader: 'url',
                        query: {
                            limit: 100000,
                            name: './[hash].[ext]'
                        }
                    },

                    {   test: /\.gif|jpg|png$/,
                        loader: 'url',
                        query: {
                            limit: 5000,
                            name: '../images/[hash].[ext]'
                        }
                    }
                ]

            },

            postcss: function () {
                return [
                    autoprefixer({ browsers: ['last 2 versions'] })
                ]
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
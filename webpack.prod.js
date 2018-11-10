const path = require('path');
const glob = require('glob');
const { DefinePlugin, HashedModuleIdsPlugin, NoEmitOnErrorsPlugin } = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CriticalPlugin = require('critical-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(commonConfig, {
    mode: 'production',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },

    optimization: {
        splitChunks: {
            chunks: "all"
        },
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                parallel: true,
                sourceMap: true,
                uglifyOptions: {
                    mangle: true,
                    toplevel: true,
                    compress: {
                        drop_console: true,
                        dead_code: true,
                        toplevel: true
                    },
                    output: {
                        comments: false,
                    },
                    ie8: false,
                    keep_classnames: false,
                    keep_fnames: false,
                    safari10: false,
                }
            })
        ]
    },

    plugins: [
        new CleanWebpackPlugin('dist'),

        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),

        new NoEmitOnErrorsPlugin(),

        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
            chunkFilename: "[id].[contenthash].css",
        }),

        new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {
                map: { inline: false }
            }
        }),

        new PurgecssPlugin({
            paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true })
        }),

        new CriticalPlugin(),

        new HashedModuleIdsPlugin()
    ],

    devtool: 'source-map'
});
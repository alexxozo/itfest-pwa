const path = require('path');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common');
const { DefinePlugin } = require('webpack');

module.exports = merge(commonConfig, {
    mode: 'development',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },

    plugins: [
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],

    devServer: {
        contentBase: './dist'
    },

    devtool: 'inline-source-map'
});
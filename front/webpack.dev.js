const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = env => {
    return merge(common, {
        mode: 'development',
        devtool: 'inline-source-map',
        plugins: [
            new webpack.DefinePlugin({
                'process.env.SERVER_URL': JSON.stringify('http://localhost:11077/')
            }),
        ]
    });
};
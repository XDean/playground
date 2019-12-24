const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = env => {
    env.ABC = "abc";
    return merge(common, {
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            contentBase: './dist',
        }
    });
};
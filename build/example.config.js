// webpack.config.js
// eslint-disable-next-line import/no-extraneous-dependencies
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');

// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = process.env.NODE_ENV;

const config = {
    entry: path.join(__dirname, '../example', 'main.js'),
    mode: env,
    output: {
        path: path.resolve(__dirname, '../example/dist/assets'),
        publicPath: '/',
    },
    optimization: {
        splitChunks: {
            // Must be specified for HtmlWebpackPlugin to work correctly.
            // See: https://github.com/jantimon/html-webpack-plugin/issues/882
            chunks: 'all',
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [path.join(__dirname, 'src')],
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                    },
                ],
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.htm',
            template: path.join(__dirname, '../example', 'index.htm'),
            inject: true,
        }),
    ],
    resolve: {
        alias: {
            dist: path.join(__dirname, '../dist'),
        },
    },
};

module.exports = config;

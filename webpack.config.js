var path = require("path"),
    webpack = require("webpack");

module.exports = {
    entry: {
        //"bundle": "./app.js",
        "basiq.client.min": "./app.js",
    },
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js"
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ]
};
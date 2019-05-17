var path = require("path"),
    webpack = require("webpack");

module.exports = {
    entry: {
        //"bundle": "./app.js",
        "basiq.client.min": "./app.js",
    },
    mode: "production",
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js"
    },
    optimization: {
        minimize: true
      }
};
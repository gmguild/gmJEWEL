const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = function(_env, argv) {
  const isProduction = argv.mode === "production";
  const isDevelopment = !isProduction;

  return {
    entry: path.resolve(__dirname, "./src/index.ts"),
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: [
            "style-loader",
            "css-loader",
            "postcss-loader",
          ],
        },
        {
          test: /\.(png|jpg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'img/[name][hash][ext][query]'
          },
        },
        {
          test: /\.mp3$/i,
          type: 'asset/resource',
          generator: {
            filename: 'sounds/[name][hash][ext][query]'
          },
        }
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "./src/index.html"),
        title: 'Greedy Merchants Guild',
        favicon: path.resolve(__dirname, "./src/assets/DFKLockedJewel.png"),
      }),
      new webpack.EnvironmentPlugin({
        PRODUCTION: 'false',
      }),
      new webpack.DefinePlugin({
        SERVICE_URL: JSON.stringify(isProduction ? "https://api.gmg.money" : 'http://localhost:8000'),
        RPC_URL: JSON.stringify(isProduction ? "https://api.harmony.one" : 'http://localhost:8545'),
      }),
      isProduction ? new webpack.NormalModuleReplacementPlugin(
        /env\/dev/,
        './env/prod'
      ) : undefined,
    ].filter(Boolean),
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      path: path.resolve(__dirname, '../build/ui'),
      filename: "bundle.[contenthash].js",
      clean: true,
      publicPath: '/'
    },
    devServer: {
      historyApiFallback: true
    },
    devtool: isDevelopment && "cheap-module-source-map",
  }
};

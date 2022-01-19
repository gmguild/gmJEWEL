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
        // favicon: path.resolve(__dirname, "./src/assets/favicon.png"),
      })
    ],
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

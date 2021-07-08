const webpack = require("webpack");
const PnpWebpackPlugin = require("pnp-webpack-plugin");
//const ModernNpmPlugin = require("webpack-plugin-modern-npm");

module.exports = {

  entry: "./src/index.tsx",

  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
    path: __dirname + "/dist",
    publicPath: "/dist/",
  },

  resolve: {
    plugins: [
      PnpWebpackPlugin,
    ],
    extensions: [ ".ts", ".tsx", ".mjs", ".js", ".jsx", ".mjs", ".json", ".css", ".sass" ],
    fallback: {
      buffer: require.resolve("buffer/"),
      url: require.resolve("url/"),
      path: require.resolve("path-browserify"),
      http: require.resolve("stream-http"),
      events: require.resolve("events/"),
      fs: false,
      //typeof: require.resolve("typeof"),
    },
  },

  resolveLoader: {
    plugins: [
      PnpWebpackPlugin.moduleLoader(module),
    ],
  },

  plugins: [
    //new ModernNpmPlugin(),
    new webpack.ProvidePlugin({
      process: require.resolve("process/browser"),
    }),
  ],

  module: {
    rules: [

      { test: /\.m?js/, resolve: { fullySpecified: false } },

      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.browser.json",
        },
      },

      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },

      /*{
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },*/

      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        //include: /node_modules/,
        loader: 'file-loader',
        options: {
          limit: 1024,
          name: '[name].[ext]',
          publicPath: '/dist/assets/',
          outputPath: 'assets/'
        },
      },

      {
        test: /\.js$/,
        exclude: /@babel(?:\/|\\{1,2})runtime/,
        loader: require.resolve("babel-loader"),
        options: {
          babelrc: false,
          configFile: false,
          compact: false,
          presets: [
            "@babel/preset-env",
            [
              require.resolve("babel-preset-react-app/dependencies"),
              { helpers: true },
            ],
            "@babel/preset-typescript",
          ],
          cacheDirectory: true,
          cacheCompression: false,
        }
      },

    ],
  },

  externals: {
    //"react": "React",
    //"react-dom": "ReactDOM",
    //"reflect-metadata": "Reflect",
  },

};

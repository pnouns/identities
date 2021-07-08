const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",

  devtool: "eval-source-map",

  watchOptions: {
    poll: 2000,
    ignored: [
      '**/node_modules',
      '**/.yarn',
    ],
  },
})

const path = require("path");

const config = {
  mode: "production",
  entry: "./src/change-rona.js",
  output: {
    path: path.resolve(__dirname, "src/build"),
    filename: "change-rona.js",
    publicPath: "build/"
  },
  module: {
    rules: [
      {
        use: "babel-loader",
        test: /\.js$/
      }
    ]
  }
};

module.exports = config;

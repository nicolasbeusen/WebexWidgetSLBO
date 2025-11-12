const path = require("path");

const config = {
  mode: "production",
  entry: "./src/pause-recording.js",
  output: {
    path: path.resolve(__dirname, "src/build"),
    filename: "pause-recording.js",
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

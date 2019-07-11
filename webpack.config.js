module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    path: __dirname + "/dist",
    filename: "topsoil.js",
    library: "topsoil"
  },
  devtool: "source-map",
  devServer: {
    port: 3000,
    contentBase: __dirname + "/dist",
    inline: true
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  }
};

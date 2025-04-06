const postcssPresetEnv = require("postcss-preset-env");
const path = require("path");

module.exports = {
  devtool: "source-map",
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js?v=[contenthash]',
    publicPath: '/dist/'
  },
  resolve: {
    fallback: {
      "url": false  // Disable url module since we don't need it in the browser
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react"],
        },
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  postcssPresetEnv({
                    stage: 3,
                    autoprefixer: { grid: true },
                  }),
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.gif$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images/",
              publicPath: "images/",
              esModule: false,
            },
          },
        ],
      },
    ],
  },
};
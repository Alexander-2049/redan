import type { Configuration, WebpackPluginInstance } from "webpack";
import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
import path from "path";
import CopyPlugin from "copy-webpack-plugin";

rules.push({
  test: /\.css$/,
  use: ["style-loader", "css-loader", "postcss-loader"],
});

(plugins as WebpackPluginInstance[]).push(
  new CopyPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, "public"),
        to: path.resolve(__dirname, ".webpack/public"),
        noErrorOnMissing: true, // Avoid errors if the folder is missing
        globOptions: {
          ignore: ["**/.DS_Store"], // Ignore unnecessary files
        },
      },
    ],
    options: {
      concurrency: 100, // Optimize file copying
    },
  }),
);

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
    alias: {
      "@main": path.resolve(__dirname, "src/main"),
      "@renderer": path.resolve(__dirname, "src/renderer"),
      "@models": path.resolve(__dirname, "src/main/models"),
    },
  },
  watch: true, // Enable watching for changes
};

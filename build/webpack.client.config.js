/**
 * 客户端打包配置
 */
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.config.js");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");

module.exports = merge(baseConfig, {
  entry: {
    // 相对执行打包命令时的路径
    app: "./src/entry-client.js",
  },

  module: {
    rules: [
      // ES6 转 ES5
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            cacheDirectory: true,
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
    ],
  },
  // MORE
  // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
  // 以便可以在之后正确注入异步 chunk。
  optimization: {
    splitChunks: {
      name: "manifest",
      minChunks: Infinity,
    },
  },
  plugins: [
    // 此插件在输出目录中生成 `vue-ssr-client-manifest.json`
    // 描述客户端打包结果中的依赖, 需要加载的模块信息
    new VueSSRClientPlugin(),
  ],
});

const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const chokidar = require("chokidar");
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");

const resolve = (file) => path.resolve(__dirname, file);

module.exports = (server, callback) => {
  let ready;
  const onReady = new Promise((r) => (ready = r));

  let serverBundle;
  let template;
  let clientManifest;

  // 监视打包构建, 调用callback生成renderer
  const update = () => {
    console.log("update");
    if (serverBundle && template && clientManifest) {
      callback(serverBundle, template, clientManifest);
      ready();
    }
  };

  // watching serverBundle, template, clientManifest, and call update

  // fs.watch, fs.watchFile, not good enough, use chokidar
  const templatePath = resolve("../index.template.html");
  template = fs.readFileSync(templatePath, "utf-8");
  chokidar.watch(templatePath).on("change", () => {
    template = fs.readFileSync(templatePath, "utf-8");
    update();
  });

  const serverConfig = require("./webpack.server.config");
  const serverCompiler = webpack(serverConfig);
  const serverMiddleware = devMiddleware(serverCompiler, {
    logLevel: "silent",
  });
  serverCompiler.hooks.done.tap("update server", () => {
    serverBundle = JSON.parse(
      serverMiddleware.fileSystem.readFileSync(
        resolve("../dist/vue-ssr-server-bundle.json", "utf-8")
      )
    );
    update();
  });

  const clientConfig = require("./webpack.client.config");
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  clientConfig.entry.app = [
    // 和服务端交互处理热更新的客户端脚本
    "webpack-hot-middleware/client",
    clientConfig.entry.app,
  ];
  // 在热更新模式下确保每次编译生成的文件名字一致
  clientConfig.output.filename = "[name].js";

  const clientCompiler = webpack(clientConfig);
  const clientDevMiddleware = devMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    logLevel: "silent",
  });
  clientCompiler.hooks.done.tap("update client", () => {
    clientManifest = JSON.parse(
      clientDevMiddleware.fileSystem.readFileSync(
        resolve("../dist/vue-ssr-client-manifest.json", "utf-8")
      )
    );

    update();
  });

  // 将clientMiddleware挂载到express服务中, 提供对其托管的内存数据访问
  server.use(clientDevMiddleware);
  server.use(
    hotMiddleware(clientCompiler, {
      noInfo: true,
      publicPath: clientConfig.output.publicPath,
    })
  );

  return onReady;
};

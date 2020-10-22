const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const chokidar = require("chokidar");
const devMiddleware = require("webpack-dev-middleware");

const resolve = (file) => path.resolve(__dirname, file);

module.exports = (server, callback) => {
  let ready;
  const onReady = new Promise((r) => (ready = r));

  let serverBundle;
  let template;
  let clientManifest;

  // 监视打包构建, 调用callback生成renderer
  const update = () => {
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
    // console.log("template update", template);
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
    // console.log("server bundle", serverBundle);
    update();
  });

  const clientConfig = require("./webpack.client.config");
  const clientCompiler = webpack(clientConfig);
  const clientMiddleware = devMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    logLevel: "silent",
  });
  clientCompiler.hooks.done.tap("update client", () => {
    clientManifest = JSON.parse(
      clientMiddleware.fileSystem.readFileSync(
        resolve("../dist/vue-ssr-client-manifest.json", "utf-8")
      )
    );

    // console.log("client update", clientManifest);
    update();
  });

  return onReady;
};

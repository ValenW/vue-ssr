module.exports = (server, callback) => {
  let ready;
  const onReady = new Promise(r => ready = r);

  // 监视打包构建, 调用callback生成renderer
  const update = (serverBundle, template, clientManifest) => {
    if (serverBundle && template && clientManifest) {
      callback(serverBundle, template, clientManifest);
      ready();
    }
  }

  // watching serverBundle, template, clientManifest, and call update
  

  return onReady;
}
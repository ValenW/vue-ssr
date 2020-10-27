import { createApp } from "./app";
// 客户端特定引导逻辑……
const { app, router, store } = createApp();
// 这里假定 App.vue 模板中根元素具有 `id="app"`

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
  app.$mount("#app");
});

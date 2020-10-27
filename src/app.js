import Vue from "vue";
import App from "./App.vue";
import VueMeta from "vue-meta";
import { createRouter } from "./router";
import { createStore } from "./store";

Vue.use(VueMeta);

Vue.mixin({
  metaInfo: {
    titleTemplate: "%s - Common Title",
  },
});

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp() {
  const router = createRouter();
  const store = createStore();
  const app = new Vue({
    // 根实例简单的渲染应用程序组件。
    render: (h) => h(App),
    store,
    router,
  });
  return { app, router, store };
}

import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export const createStore = () => {
  return new Vuex.Store({
    state: () => {
      posts: [];
    },
    mutations: {
      setPosts(state, data) {
        state.posts = data;
      },
    },

    actions: {
      // 在服务端渲染期间必须让action返回Promise
      async getPosts({ commit }) {
        const data = await axios.get("https://api.github.com/gists/public");
        commit("setPosts", data.data);
      },
    },
  });
};

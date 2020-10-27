<template>
  <div>
    <h1>Posts</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">
        {{ post.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Posts",
  data() {
    return {};
  },
  computed: {
    ...mapState(["posts"]),
  },
  methods: {
    ...mapActions({ fetch: "getPosts" }),
  },

  // vue ssr 为客户端渲染提供的生命周期钩子, 会在渲染前进行调用, 需要返回Promise
  serverPrefetch() {
    // return this.fetch();
    return this.$store.dispatch("getPosts");
  },

  components: {},
  watch: {},
  mounted() {},
  methods: {},
};
</script>

<style scoped>
</style>
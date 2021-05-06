<template>
  <v-main class="mb-5">
    <v-container class="text-left mb-5">
      <h1>User Guide</h1>
      <div id="test" class="mb-5 pl-3"></div>
      <vue-markdown :source="userGuide" :toc="true" :toc-anchor-link="false" toc-id="test"></vue-markdown>
    </v-container>
  </v-main>
</template>

<script>
import userGuide from 'raw-loader!../../../public/assets/doc/text/userGuide.md';
export default {
  name: "UserGuide",
  components: {
    VueMarkdown: () => import('vue-markdown')
  },
  data: () => ({
    userGuide,
  }),
};
</script>

<style>
</style>
<template>
  <v-main class="mb-5">
    <v-container class="text-left mb-5">
      <h1>User Guide</h1>
      <div id="tableOfContents"></div>
      <div id="test" class="mb-5 pl-3"></div>
      <vue-markdown class="markdown" :source="userGuide" :toc="true" :toc-anchor-link="false" toc-id="tableOfContents"></vue-markdown>
    </v-container>
  </v-main>
</template>

<script>
import userGuide from 'raw-loader!../../../public/assets/doc/text/userGuide.md';
export default {
  name: "UserGuide",
  components: {
    VueMarkdown: () => import('vue-markdown-render')
  },
  data: () => ({
    userGuide,
  }),
};
</script>

<style>
.markdown img {
  max-width: 100%;
  padding: .25em 0;
}
</style>
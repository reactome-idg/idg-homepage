<template>
  <div>
    <div :style="indent"><a :href="link">{{ancestor.name}}</a></div>
      <hierarchy-tree v-for="child in children"
      :key="child.dbId"
        :children="child.children"
        :ancestor="child"
        :depth="depth + 1"
      ></hierarchy-tree>
  </div>
</template>

<script>
export default {
  name: "hierarchy-tree",
  props: ["children", "ancestor", "depth", "urlFlagSuffix"],
  data: () => ({
    browserLink: process.env.VUE_APP_BROWSER_LINK
  }),
  computed: {
    indent() {
      return { transform: `translate(${this.depth * 25}px)` }
    },
    link() {
      return `${this.browserLink}R-HSA-${this.ancestor.dbId}&${this.urlFlagSuffix}`
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
<template>
  <div>
    <div :style="indent">{{label}}</div>
      <hierarchy-tree v-for="child in children"
      :key="child.dbId"
        :children="child.children"
        :label="child.name"
        :depth="depth + 1"
      ></hierarchy-tree>
  </div>
</template>

<script>
export default {
  name: "hierarchy-tree",
  props: ["children", "label", "depth"],
  computed: {
    indent() {
      return { transform: `translate(${this.depth * 50}px)` }
    }
  }
};
</script>

<style scoped>
</style>
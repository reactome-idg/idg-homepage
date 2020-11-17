<template>
  <div class="text-left">
    <div :style="indent">
      <a :href="getHRef" class="link" :style="bold">{{label}}</a>
    </div>
    <div>
    <PrimaryPathwayHierarchy
      v-for="(child, index) in children"
      :key="index"
      :stId="child.stId"
      :geneName="geneName"
      :children="child.children"
      :label="child.name"
      :depth="depth+1"
      :topLevel="false"
    ></PrimaryPathwayHierarchy>
    </div>
  </div>
</template>

<script>
export default {
  name: "PrimaryPathwayHierarchy",
  props: ["stId", "children", "label", "geneName", "depth", "topLevel"],
  data: () => ({
      browserLink: "/PathwayBrowser/#/",
      expanded:false
  }),
  computed: {
    indent() {
      return { transform: `translate(${this.depth * 25}px)` }
    },
    bold() {
        return {'font-weight': this.children ? '50':'bold',
                'text-decoration': this.children ? 'none':'underline',
                'font-size': this.topLevel ? 'larger' : ''}
    },
    getHRef(){
        return `${this.browserLink}${this.stId}&FLG=${this.geneName}`
    },
  },
};
</script>

<style scoped>
.text-left{
    text-align: left;
}
.link {
    text-decoration: none;
}
.link:hover{
}
.link:active:hover{
}
</style>
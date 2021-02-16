<template>
  <div class="text-left pa-2">
      <h2>Description</h2>
      <p><span v-html="showFullText ? `${details.details.summation[0].text}` : `${this.textSnippet}`"></span><a @click="toggleShowFullText()">{{showFullText ? " [less]" : " [more]"}}</a></p>
      <h2>Hierarchy</h2>
      <div v-for="(ancestor, index) in details.ancestors" :key="index" class="pb-5">
          <hierarchy-tree :ancestor="ancestor" :children="ancestor.children" :depth="0" :urlFlagSuffix="urlFlagSuffix"></hierarchy-tree>
      </div>
  </div>
</template>

<script>
import TableHierarchyTree from "./TableHierarchyTree";
export default {
    name: "TableDetails",
    components: {
        'hierarchy-tree':TableHierarchyTree
    },
    props: {
        details: {
            type: Object,
            default: () => {}
        },
        urlFlagSuffix: {
            type: String,
            default: () => ""
        }
    },
    data: () => ({
        showFullText: false,
    }),
    computed: {
        textSnippet() {
            return this.details.details.summation[0].text.replace(/^(.{200}[^\s]*).*/, "$1")
        }
    },
    methods: {
        toggleShowFullText() {
            this.showFullText = !this.showFullText;
        }
    }
}
</script>

<style scoped>

</style>
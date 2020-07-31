<template>
  <div class="text-left pa-2">
      <h2>Description</h2>
      <p>{{details.description}}</p>
      <h2>Hierarchy</h2>
      <div v-for="(ancestor, index) in details.ancestors" :key="index" class="pb-5">
          <hierarchy-tree :label="ancestor.name" :children="ancestor.children" :depth="0"></hierarchy-tree>
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
        }
    }
}
</script>

<style scoped>

</style>
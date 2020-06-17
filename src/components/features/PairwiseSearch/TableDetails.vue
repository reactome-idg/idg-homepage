<template>
  <div class="text-left pa-2">
      <h2>Description</h2>
      {{details.description}}
      <h2>Hierarchy</h2>
  </div>
</template>

<script>
export default {
    name: "TableDetails",
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
<template>
    <v-footer absolute color="#222">
      <v-spacer></v-spacer>
      <div class="font-weight-medium text-white" >&copy; Reactome {{ new Date().getFullYear() }}</div>
    </v-footer>
</template>

<script>
export default {};
</script>

<style scoped>
.text-white{
  color: white;
}
</style>
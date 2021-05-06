<template>
  <v-main class="mb-5">
    <v-container class="text-left mb-5">
      <userGuide />
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: "UserGuide",
  components: {
    userGuide: () => import('../../components/documentation/userGuide.md'),
  },
  data: () => ({}),
};
</script>

<style scoped>
</style>
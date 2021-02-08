<template>
  <v-main class="mb-5">
    <v-container class="text-left mb-5">
      <userGuide />
    </v-container>
  </v-main>
</template>

<script>
import userGuide from "@/components/Documentation/userGuide.md";
export default {
  name: "UserGuide",
  components: {
    userGuide,
  },
  data: () => ({}),
};
</script>

<style scoped>
</style>
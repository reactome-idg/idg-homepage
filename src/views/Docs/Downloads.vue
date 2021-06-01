<template>
  <div class="container">
    <h1>Dowloads</h1>
    <hr class="mb-10" />
    <div>
      <h3 class="mb-5">MongoDb</h3>
      <div class="pl-3">
        <div v-for="item in mongoFiles" :key="item.name" class="mb-2">
          <v-icon class="pl-5 pr-2">mdi-file-download-outline</v-icon>
          <span
            ><a :href="item.location">{{ item.name }}</a></span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Downloads",
  data: () => ({
    mongoFiles: [
      {
        name: "MongoDB Dump File.tgz",
        location: "/file/location",
      },
      {
        name: "Pairwise Features.csv",
        location: "/file/location"
      }
    ],
  }),
};
</script>

<style scoped>
</style>
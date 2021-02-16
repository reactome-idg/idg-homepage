<template>
  <div class="container flex">
    <div>
      <h1>Page not found!</h1>
      <router-link to="/">
        <v-btn color="primary"> Go Home </v-btn>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  beforeCreate: () => {
    document.body.className = "normal";
  },
};
</script>

<style scoped>
.container {
  max-width: 1100px;
  height: 100%;
  margin: 0 auto;
}
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
a {
  text-decoration: none;
}
</style>
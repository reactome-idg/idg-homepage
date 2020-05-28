<template>
  <header class="pa-3 header">
    <router-link class="logo-container" to="/">
      <img :src="'/assets/images/logo.svg'" alt="Reactome Logo" class="logo" />
    </router-link>
    <router-link to="/documentation" class="links">Docs</router-link>
  </header>
</template>

<script>
export default {
  name: "Header"
};
</script>

<style scoped>
.header {
  background-color: #222;
}
a {
  text-decoration: none;
}
.logo {
  width: 15em;
}
.logo-container {
  float: left;
}
.links {
  float: right;
  color: white;
  font-weight: bolder;
  height: 100%;
}
.links a {
  float: right;
  text-decoration: none;
  height: 100%;
}
</style>
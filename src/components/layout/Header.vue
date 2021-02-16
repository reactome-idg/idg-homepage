<template>
  <header class="pa-3 header">
    <router-link to="/">
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
  width:100%;
  margin: 0 auto;
  padding: 40px;
  background-color: #222;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
a {
  text-decoration: none;
}
.logo {
  width: 15em;
}
.links {
  color: white;
  font-weight: bolder;
  text-decoration: none;

}

</style>
<template>
  <header class="header">
    <div class="logo-container">
      <router-link to="/">
        <img :src="'/assets/images/logo.svg'" alt="Reactome Logo" class="logo" />
      </router-link>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header"
};
</script>

<style scoped>
.header-h1 {
  padding: 10px;
  text-decoration: none;
  color: black;
}

a {
  text-decoration: none;
}
.logo {
  width: 20em;
}
.logo-container{
  text-align: left;
}
</style>
<template>
  <header>
    <v-container fluid class="logo-container">
      <router-link to="/">
        <img :src="'/assets/images/logo.svg'" alt="Reactome Logo" class="logo"/>
      </router-link>
    </v-container>
  </header>
</template>

<script>
export default {
  name: "Header"
};
</script>

<style scoped>
a {
  text-decoration: none;
}
.logo {
  width: 15em;
}
.logo-container{
  text-align: left;
}
</style>
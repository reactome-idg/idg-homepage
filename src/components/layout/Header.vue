<template>
  <header>
    <v-container fluid class="logo-container">
      <router-link to="/">
        <img :src="'/assets/images/logo.svg'" alt="Reactome Logo" class="logo"/>
      </router-link>
      <v-container class="links"><router-link to="/documentation">Docs</router-link></v-container>
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
  border-bottom: 1px solid #c0c0c0;
}
.links {
  float: right;
  color:black;
  height:100%;
}
.links a {
  float: right;
  font-weight: medium;
  text-decoration: none;
  height:100%;
}
</style>
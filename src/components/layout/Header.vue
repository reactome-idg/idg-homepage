<template>
  <div class="navbar pa-5">
    <div class="flex">
      <router-link to="/">
        <img
          :src="'/assets/images/logo.svg'"
          alt="Reactome Logo"
          class="logo"
        />
      </router-link>
      <div>
      <router-link to="/documentation" class="links pr-5">Docs</router-link>
      <router-link to="/documentation/userguide" class="links pr-5">User Guide</router-link>
      <!-- <router-link to="/documentation/downloads" class="links">Downloads</router-link> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style scoped>
.navbar {
  background-color: #fff;
  height: 70px;
}
.navbar .flex {
  justify-content:space-between;
}
a {
  text-decoration: none;
}
.logo {
  width: 15em;
}
.links {
  color:#666;
  font-weight: bolder;
  text-decoration: none;
}
.links:hover{
  color: #222;
}
</style>
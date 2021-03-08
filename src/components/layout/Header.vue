<template>
  <div class="navbar">
    <div class="container flex">
      <router-link to="/">
        <img
          :src="'/assets/images/logo.svg'"
          alt="Reactome Logo"
          class="logo"
        />
      </router-link>
      <router-link to="/documentation" class="links">Docs</router-link>
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
  color: #333;
  font-weight: bolder;
  text-decoration: none;
}
</style>
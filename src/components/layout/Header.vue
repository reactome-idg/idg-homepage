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
      <router-link to="/documentation/userguide" class="links mr-3"> <v-icon >mdi-school</v-icon> User Guide</router-link>
      <router-link to="/documentation/downloads" class="links"><v-icon >mdi-download</v-icon> Downloads</router-link>
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
  background-color:white;
  height: 60px;
  box-shadow: 0px 5px 10px #888;
}
.navbar .flex {
  justify-content:space-between;
}
a {
  text-decoration: none;
}
.logo {
  width: 8em;
}
.links {
  color: #2c3e50;
  font-weight: bolder;
  text-decoration: none;
  padding:.25em .5em;
  transition: .3s;
}
.links:hover{
  color: white;
  background-color: var(--idg-corporate-blue);
  border-radius:5px;
  box-shadow: 3px 1px 5px #333
}

.links > i.v-icon.v-icon{
  color: #2c3e50;
}

.links:hover > i.v-icon.v-icon{
  color: white;
}
</style>
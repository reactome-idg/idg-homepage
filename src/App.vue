<template>
  <v-app id="app" :class="home && 'home'">
    <Header />
    <router-view mb-5 />
    <Footer />
  </v-app>
</template>

<script>
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
export default {
  name: "app",
  components: {
    Header,
    Footer,
  },
  data: () => ({
    home: null
  }),
  watch: {
    $route: {
      handler: (to) => {
        document.title = "Reactome IDG - " + to.meta.title || "Reactome IDG";
      },
      immediate: true,
    },
  },
  created() {
    this.home = (this.$route.name === "Home" ||  this.$route.name === "Search") ? true : false;
  },
  beforeUpdate() {
    this.home = (this.$route.name === "Home" ||  this.$route.name === "Search") ? true : false;
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
* {
  font-family: Comfortaa, curisve;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
    background:none;
    background-color: #eee;
}
.home{
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80")!important;
    background-attachment: fixed;
}
</style>
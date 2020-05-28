<template>
  <v-app id="app">
    <Header />
    <router-view mb-5 />
    <!-- <Footer /> -->
  </v-app>
</template>

<script>
import Header from "./components/layout/Header"
// import Footer from "./components/layout/Footer"
export default {
  name: "app",
  components: {
    Header,
    // Footer
  },
  watch: {
    $route: {
      handler: to => {
        document.title = "Reactome IDG - " + to.meta.title || "Reactome IDG";
      },
      immediate: true
    }
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
  background-color: transparent;
}

#nav {
  padding: 30px;
}
* {
  font-family: Comfortaa, curisve;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.4;
}
</style>
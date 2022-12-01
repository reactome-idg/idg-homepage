<template>
  <v-app id="app" :class="home && 'home'">
    <Header class="raised"/>
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

:root {
  /* idg colors */
  --idg-dark-blue:#183C65;
  --idg-corporate-blue: #0D5184;
  --idg-medium-blue: #5E8BAD;
  --idg-light-blue: #AEC5D6;
  /* idg alt colors */
  --idg-alt-blue: #4AABCA;
  --idg-alt-dark-blue: #477F9C;
  --idg-alt-light-blue: #ABE7F4;
  /* idg CTA colors */
  --idg-orange: #F98419;
  --idg-dark-orange: #A06529;
  --idg-light-orange: #F2C09E;
  /* misc. colors */
  --idg-red: #EA3B65;
  --idg-hyperlink-color: #509DBE;

}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #eee;
  margin: 0;
  padding: 0;
}
* {
  font-family: Comfortaa, curisve;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
a{
  text-decoration: none;
}
body {
    background:none;
    background-color: #eee;
}
.home{
  background-color: white;
    /* background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80")!important;
    background-attachment: fixed; */
}
.container {
  /* max-width: 1100px; */
  margin: 0 auto;
  overflow: auto;
  padding: 0 50px;
  text-align: left;
}
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.space-between{
  justify-content: space-between;
}
.space-around{
  justify-content: space-around;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.btn {
  display: inline-block;
  padding: 10px 30px;
  cursor: pointer;
  background: blue;
  color: #fff;
  border: none;
  border-radius: 5px;
}
.btn-primary {
  color: white !important;
}
</style>
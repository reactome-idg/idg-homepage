<template>
  <v-app id="app">
      <InteractorSearch :term="term"/>
  </v-app>
</template>

<script>
import InteractorSearch from "./InteractorSearch";
import {VApp} from "vuetify/lib";
import vuetify from "../../../plugins/vuetify";
export default {
    name:"InteractorSearchWC",
    vuetify,
    components: {
        VApp,
        InteractorSearch
    },
    props: {
        term: {
            type: String,
            default: () => ""
        }
    }
}
</script>

<style scoped>
@import "../../../../node_modules/vuetify/dist/vuetify.min.css";
* {
  font-family: Comfortaa, curisve;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  background-color: transparent;
}
</style>
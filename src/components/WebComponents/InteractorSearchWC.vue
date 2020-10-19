<template>
  <v-app>
    <InteractorSearch :term="term" :darkmode="darkmode" :title="title" :subtitle="subtitle" />
  </v-app>
</template>

<script>
import InteractorSearch from "../features/PairwiseSearch/InteractorSearch";
import { VApp } from "vuetify/lib";
import vuetify from "../../plugins/vuetify";
export default {
  name: "InteractorSearchWC",
  vuetify,
  components: {
    VApp,
    InteractorSearch,
  },
  props: {
    term: {
      type: String,
      default: () => "",
    },
    darkmode: {
      type: Boolean,
      default: () => false,
    },
    title: {
      type: String,
      default: () => "Interacting Pathways"
    },
    subtitle: {
      type: String,
      default: () => "Reachable Through Interactors"
    }
  },
};
</script>

<style>
@import "../../../node_modules/vuetify/dist/vuetify.min.css";
.v-application--wrap {
  min-height: 1vh !important;
}
* {
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
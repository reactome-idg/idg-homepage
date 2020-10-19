<template>
  <v-app>
    <AnnotatedPathwaySearch :term="term" :darkmode="darkmode" :title="title" :subtitle="subtitle" />
  </v-app>
</template>

<script>
import { VApp } from "vuetify/lib";
import AnnotatedPathwaySearch from "../features/PairwiseSearch/AnnotatedPathwaySearch";
import vuetify from "../../plugins/vuetify";
export default {
  name: "AnnotatedPathwayHierarchyWC",
  vuetify,
  components: {
    AnnotatedPathwaySearch,
    VApp,
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
      default: () => "Annotated Pathways"
    },
    subtitle: {
      type: String,
      default: () => "Manually curated based on literature references"
    }
  },
};
</script>

<style>
@import "../../../node_modules/vuetify/dist/vuetify.min.css";
.v-application--wrap{
    min-height:1vh !important;
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
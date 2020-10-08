<template>
  <v-app>
    <AnnotatedPathwaySearch :term="term" :darkmode="darkmode" />
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
  },
};
</script>

<style>
@import "../../../node_modules/vuetify/dist/vuetify.min.css";
.v-application--wrap{
    min-height:1vh !important;
}
</style>
<template>
  <v-app id="app">
      <InteractorSearch :term="term"/>
  </v-app>
</template>

<script>
import InteractorSearch from "../features/PairwiseSearch/InteractorSearch";
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
        },
        darkmode: {
          type: Boolean,
          default: () => false,
        }
    }
}
</script>

<style scoped>
@import "../../../../node_modules/vuetify/dist/vuetify.min.css";
.v-application--wrap{
  min-height: 1vh !important;
}
</style>
<template>
  <v-app>
    <InteractorSearch :term="term" :darkmode="darkmode" :title="title" :subtitle="subtitle" :isWebComponent="isWebComponent"/>
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
    },
    isWebComponent: {
      type: Boolean,
      default: true 
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
.errors {
  color: red;
}
.selectionDropDownDark{
  text-align: left;
  color: white;
  border-bottom: 1px solid white;
  width: 100%;
}
.selectionDropDownDark:disabled {
  border-bottom: 1px dotted white;
}
.selectionDropDown {
color: black;
border-bottom: 1px solid darkgrey;
width: 100%; 
}
.selectionDropDown:disabled{
border-bottom: 1px dotted darkgrey;
}
.primaryBtn {
  background-color: #1976D2;
}
.secondaryBtn {
  background-color: #424242;
}
</style>
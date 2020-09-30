<template>
  <v-container fluid class="mb-5">
    <MainLinks />
    <About />
    <PairwiseSearchForm @searchPathways = "searchPathways"/>
    <v-card dark raised v-if="term !== null" class="pa-5 mb-5">
      <h2 class="text-left mb-3">Showing Results For: {{ term }}</h2>
      <AnnotatedPathwaySearch :term="this.term" :uniprotBoolean="this.uniprotBoolean"/>
      <InteractorSearch :term="this.term" :uniprotBoolean="this.uniprotBoolean"/>
    </v-card>
  </v-container>
</template>

<script>
import About from "../components/Home/About";
import MainLinks from "../components/Home/MainLinks";
import PairwiseSearchForm from "../components/features/PairwiseSearch/PairwiseSearchForm"
import AnnotatedPathwaySearch from "../components/features/PairwiseSearch/AnnotatedPathwaySearch";
import InteractorSearch from "../components/features/PairwiseSearch/InteractorSearch";
export default {
  name: "Home",
  components: {
    About,
    MainLinks,
    PairwiseSearchForm,
    AnnotatedPathwaySearch,
    InteractorSearch
  },
  data: () => ({
    term: null,
    uniprotBoolean: false
  }),
  beforeCreate: () => {
    document.body.className = "home";
  },
  methods: {
    searchPathways(search){
      this.term = search.term;
      this.uniprotBoolean = search.uniprotBoolean; 
    }
  }
};
</script>

<style scoped>
</style>
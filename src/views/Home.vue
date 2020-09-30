<template>
  <v-container fluid class="mb-5">
    <MainLinks />
    <About />
    <PairwiseSearch @searchPathways = "searchPathways"/>
    <v-card dark raised v-if="term !== null" class="pa-5 mb-5">
      <AnnotatedPathwaySearch :term="this.term" :uniprotBoolean="this.uniprotBoolean"/>
      <InteractorSearch :term="this.term" :uniprotBoolean="this.uniprotBoolean"/>
    </v-card>
  </v-container>
</template>

<script>
import About from "../components/Home/About";
import MainLinks from "../components/Home/MainLinks";
import PairwiseSearch from "../components/features/PairwiseSearch/PairwiseSearch"
import AnnotatedPathwaySearch from "../components/features/PairwiseSearch/AnnotatedPathwaySearch";
import InteractorSearch from "../components/features/PairwiseSearch/InteractorSearch";
export default {
  name: "Home",
  components: {
    About,
    MainLinks,
    PairwiseSearch,
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
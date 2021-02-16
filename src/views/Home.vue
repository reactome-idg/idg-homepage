<template>
  <v-container fluid class="pb-5">
    <MainLinks />
    <v-container fluid>
    <About />
    <PairwiseSearchForm @searchPathways = "searchPathways"/>
    <v-card dark raised v-if="term !== null" class="pa-5 mb-5">
      <h2 class="text-left mb-3">Showing Results For: {{ term }}</h2>
      <AnnotatedPathwaySearch :term="this.term" :darkmode="true"/>
      <InteractorSearch :term="this.term" :darkmode="true"/>
    </v-card>
    </v-container>
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
  // mount() {
  //   document.body.className = "home";
  // },
  created() {
    this.term = this.$route.params.term ? this.$route.params.term : null
  },
  watch: {
    $route() {
      if(!this.$route.params.term) this.term = null;
      else if(this.$route.params.term !== this.term) this.term = this.$route.params.term;
    },
  },
  methods: {
    searchPathways(search){
      this.term = search.term;
    }
  }
};
</script>

<style scoped>
</style>
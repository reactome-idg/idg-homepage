<template>
  <div class="pb-5">
    <section>
      <div class="pa-5 mx-15">
        <MainLinks />
        <About />
      </div>
    </section>
    <PairwiseSearchForm @searchPathways="searchPathways" class="px-5" />
    <v-expand-transition>
      <div v-if="term !== null" class="searchContainer pa-5">
        <v-card raised class="pa-5 mb-5 mx-15" elevation="15">
          <div class="flex mb-3">
          <h2 class="text-left">Showing Results For: {{ term }}</h2>
          <a target="_blank" :href="`${pharosURL}${term}`">
          <v-btn color="var(--idg-dark-blue)" class="white--text">Pharos Target</v-btn>
          </a>
          </div>
          <AnnotatedPathwaySearch :term="this.term" :darkmode="false" class="mb-5"/>
          <InteractorSearch :term="this.term" :darkmode="false" />
        </v-card>
      </div>
    </v-expand-transition>
    <transition name="slide-down"> </transition>
  </div>
</template>

<script>
import About from "../components/Home/About";
import MainLinks from "../components/Home/MainLinks";
import PairwiseSearchForm from "../components/features/PairwiseSearch/PairwiseSearchForm";
import AnnotatedPathwaySearch from "../components/features/PairwiseSearch/AnnotatedPathwaySearch";
import InteractorSearch from "../components/features/PairwiseSearch/InteractorSearch";
export default {
  name: "Home",
  components: {
    About,
    MainLinks,
    PairwiseSearchForm,
    AnnotatedPathwaySearch,
    InteractorSearch,
  },
  data: () => ({
    term: null,
    uniprotBoolean: false,
    pharosURL:"https://pharos.ncats.nih.gov/targets/"
  }),
  created() {
    this.term = this.$route.params.term ? this.$route.params.term : null;
  },
  watch: {
    $route() {
      if (!this.$route.params.term) this.term = null;
      else if (this.$route.params.term !== this.term)
        this.term = this.$route.params.term;
    },
  },
  methods: {
    searchPathways(search) {
      this.term = search.term;
    },
  },
};
</script>

<style scoped>
.flex {
  justify-content: space-between;
}
section {
  align-items: center;
}
.searchContainer {
  background: white !important;
  background-attachment: fixed;
}
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: scaleY(-100%);
  opacity: 0;
}
</style>
<template>
  <div class="pb-5">
    <section>
      <div class="pa-5">
        <MainLinks />
        <About />
      </div>
    </section>
    <PairwiseSearchForm @searchPathways="searchPathways" class="px-5" />
    <v-expand-transition>
      <div v-if="term !== null" class="searchContainer pa-5">
        <v-card raised class="pa-5 mb-5">
          <h2 class="text-left mb-3">Showing Results For: {{ term }}</h2>
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
section {
  align-items: center;
  background-color: #eee;
}
.searchContainer {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80") !important;
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
<template>
  <v-container fluid>
    <MainLinks />
    <About />
    <PairwiseSearch />
  </v-container>
</template>

<script>
import About from "../components/Home/About";
import MainLinks from "../components/Home/MainLinks";
import PairwiseSearch from "../components/features/PairwiseSearch/PairwiseSearch"
export default {
  name: "Home",
  components: {
    About,
    MainLinks,
    PairwiseSearch
  },
  data: () => ({
    search: "",
    relationshipRtn: null,
    loading: false
  }),
  beforeCreate: () => {
    document.body.className = "home";
  }
};
</script>

<style scoped>
.right-title {
  color: white;
}
.right-card {
  background-color: #555;
}
.searchContainer {
  width: 100%;
  outline: none !important;
  border: none !important;
}
</style>
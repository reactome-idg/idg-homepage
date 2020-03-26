<template>
  <div>
    <v-container class="searchContainer" fluid>
      <ProteinSearchForm v-on:search-protein="searchProtein" />
    </v-container>
    <MainLinks />
  </div>
</template>

<script>
import ProteinSearchForm from "../components/features/Forms/ProteinSearchForm";
import MainLinks from "../components/features/Home/MainLinks";
import router from "@/router/index.js";

export default {
  name: "Home",
  components: {
    ProteinSearchForm,
    MainLinks
  },
  methods: {
    searchProtein(proteinName) {
      router.push({
        name: "PathwaySearch",
        params: { proteinName: proteinName }
      });
    }
  }
};
</script>

<style scoped>
.searchContainer {
  background-color: #e0e0e0;
}

</style>
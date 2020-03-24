<template>
  <div>
    <Header />
    <v-content class="searchContainer" fluid>
      <ProteinSearchForm v-on:search-protein="searchProtein" />
    </v-content>
  </div>
</template>

<script>
import ProteinSearchForm from "../components/features/Forms/ProteinSearchForm";
import Header from "../components/layout/Header"
import router from "@/router/index.js";

export default {
  name: "Home",
  components: {
    Header,
    ProteinSearchForm
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
  background-color: #f0f0f0;
}
</style>
<template>
  <div>
    <v-content class="searchContainer" fluid>
      <ProteinSearchForm v-on:search-protein="searchProtein" />
      <v-container>

      </v-container>
    </v-content>
  </div>
</template>

<script>
import ProteinSearchForm from "../components/features/Forms/ProteinSearchForm";
import router from "@/router/index.js";

export default {
  name: "Home",
  components: {
    ProteinSearchForm,
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
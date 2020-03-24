<template>
  <div>
    <v-container class="searchContainer" fluid>
      <ProteinSearchForm v-on:search-protein="searchProtein" />
    </v-container>
    <v-container ma-5>
      <v-card class="mx-auto" max-width="400px" raised>
        <v-card-title>
          <span class="title text-center font-weight-medium">Lauch the IDG Pathway Browser</span>
        </v-card-title>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import ProteinSearchForm from "../components/features/Forms/ProteinSearchForm";
import router from "@/router/index.js";

export default {
  name: "Home",
  components: {
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
  border-top: 1px solid #c0c0c0;
  background-color: #e0e0e0;
}
</style>
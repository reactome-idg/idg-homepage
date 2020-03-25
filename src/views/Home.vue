<template>
  <div>
    <v-container class="searchContainer" fluid>
      <ProteinSearchForm v-on:search-protein="searchProtein" />
    </v-container>
    <v-container mt-5>
      <v-row>
        <v-col cols="12" md="4">
        <v-card class="mx-auto" max-width="350px" height="100%" raised>
          <v-card-title class="justify-center">
            <a href="/PathwayBrowser/#/">
              <v-btn large color="primary" height="100px" width="100px" class="navigationButton">Launch!</v-btn>
            </a>
          </v-card-title>
          <v-card-text>
            <v-container>
              <p class="title font-weight-medium">Lauch the IDG Pathway Browser</p>
            </v-container>
          </v-card-text>
        </v-card>
        </v-col>
        <v-col cols="12" md="4">
        <v-card class="mx-auto" max-width="350px" height="100%" raised>
          <v-card-title class="justify-center">
            <a href="https://reactome.org">
              <v-btn large color="primary" height="100px" width="100px" class="navigationButton">Go!</v-btn>
            </a>
          </v-card-title>
          <v-card-text>
            <v-container>
              <p class="title font-weight-medium">Vist Reactome</p>
            </v-container>
          </v-card-text>
        </v-card>
        </v-col>
        <v-col cols="12" md="4">
        <v-card class="mx-auto" max-width="350px" height="100%" raised>
          <v-card-title class="justify-center">
            <router-link to="/documentation">
              <v-btn color="primary" height="100px" width="100px" class="navigationButton">View!</v-btn>
            </router-link>
          </v-card-title>
          <v-card-text>
            <v-container>
              <p class="title font-weight-medium">Documentation</p>
            </v-container>
          </v-card-text>
        </v-card>
        </v-col>
      </v-row>
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
.navigationButton {
  border-radius: 16px;
}
</style>
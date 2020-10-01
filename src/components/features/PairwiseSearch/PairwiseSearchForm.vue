<template>
  <v-container fluid>
    <v-card dark raised>
      <v-card-text class="pa-3">
        <v-row align="center" justify="center">
          <v-col cols="12" md="10">
            <v-text-field
              dark
              label="Search a Gene Name or Uniprot"
              v-model="search"
              placeholder="e.g. NTN1, EGFR, O95631"
              :outlined="true"
              class="searchContainer" 
              text-uppercase
              @keyup.enter="searchPairwise"
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn color="primary" @click="searchPairwise">Search</v-btn>
          </v-col>
        </v-row>
        <span style="color:red;" v-if="error">{{error}}</span>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import PairwiseService from "../../../service/PairwiseService";
export default {
  name: "PairwiseSearch",
  components: {
  },
  data: () => ({
    search: "",
    uniprotCheckBox: false,
    relationshipRtn: null,
    primaryPathways: null,
    loading: false,
    error: "",
  }),
  methods: {
    async searchPairwise() {
      if (this.search === "") {
        this.error = "Please enter a search term";
        return;
      }
      this.primaryPathways = null;
      this.error = "";
      this.$emit("searchPathways", {
        term: this.search.toUpperCase(),
        uniprotBoolean: this.uniprotCheckBox
        });
      
    },
    async searchGene() {
      try {
        this.primaryPathways = await PairwiseService.searchGeneNameHierarchy(
          this.search.toUpperCase()
        );
      } catch (err) {
        this.error = err.message;
        if (err.response.status == 404) {
          this.error =
            "No recorded gene. Please use standard human gene symbol.";
        }
      }
      this.loading = false;
    },
    async searchUniprot() {
      try {
        this.primaryPathways = await PairwiseService.searchUniprotHierarchy(this.search.toUpperCase());
      } catch (err) {
        this.error = err.message;
        if (err.response.status == 404) {
          this.error = "No recorded uniprot";
        }
      }
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.searchContainer{
  text-transform: uppercase;
}
</style>
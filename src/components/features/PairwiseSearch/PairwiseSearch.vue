<template>
  <v-container fluid>
    <v-card dark raised>
      <v-card-text class="pa-3">
        <v-row align="center" justify="center">
          <v-col cols="2" md="1">
            <v-checkbox v-model="uniprotCheckBox" label="Uniprot"></v-checkbox>
          </v-col>
          <v-col cols="10" md="9">
            <v-text-field
              dark
              label="Search a Gene Name"
              v-model="search"
              placeholder="e.g. NTN1, EGFR, O95631"
              :outlined="true"
              class="searchContainer"
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
    <LoadingCircularProgress v-if="loading" />
    <v-container fluid class="pl-0 pr-0" v-if="primaryPathways">
      <GeneToPathwayResult
        :gene="searchedGene"
        :primaryPathways="primaryPathways"
        :uniprot="uniprotCheckBox"
      />
    </v-container>
  </v-container>
</template>

<script>
import PairwiseService from "../../../service/PairwiseService";
import GeneToPathwayResult from "./GeneToPathwayResult";
import LoadingCircularProgress from "../../layout/LoadingCircularProgress";
export default {
  name: "PairwiseSearch",
  components: {
    GeneToPathwayResult,
    LoadingCircularProgress,
  },
  data: () => ({
    search: "",
    uniprotCheckBox: false,
    relationshipRtn: null,
    searchedGene: "",
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
      this.loading = true;
      this.searchedGene = this.search;
      if (!this.uniprotCheckBox) this.searchGene();
      else this.searchUniprot();
    },
    async searchGene() {
      try {
        this.primaryPathways = await PairwiseService.searchGeneName(
          this.search
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
        this.primaryPathways = await PairwiseService.searchUniprot(this.search);
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
</style>
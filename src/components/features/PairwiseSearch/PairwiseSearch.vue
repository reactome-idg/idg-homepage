<template>
  <v-container fluid>
      <v-card dark raised>
        <v-card-text>
          <v-text-field
            dark
            label="Search a protein"
            v-model="search"
            placeholder="e.g. O95631, NTN1, signaling by EGFR, glucose"
            :outlined="true"
            class="searchContainer"
            v-on:keydown.enter="searchGene"
            hide-details="auto"
          ></v-text-field>
          <span style="color:red;" v-if="error">{{error}}</span>
        </v-card-text>
      </v-card>
      <LoadingCircularProgress v-if="loading" />
      <v-container fluid class="pl-0 pr-0" v-if="relationshipRtn">
        <GeneToPathwayResult :data="relationshipRtn" />
      </v-container>
    </v-container>
</template>

<script>
import PairwiseService from "../../../service/PairwiseService"
import GeneToPathwayResult from "./GeneToPathwayResult"
import LoadingCircularProgress from "../../layout/LoadingCircularProgress"
export default {
  name: "PairwiseSearch",
  components: {
    GeneToPathwayResult,
    LoadingCircularProgress
  },
  data: () => ({
    search: "",
    relationshipRtn: null,
    loading: false,
    error: ""
  }),
  methods: {
    async searchGene() {
      try {
        this.relationshipRtn = null;
        this.error = ""
        this.loading = true;
        this.relationshipRtn = await PairwiseService.searchGeneName(
          this.search
        );
      } catch (err) {
        this.error = err.message
      }
      this.loading = false;
    }
  },
}
</script>

<style scoped>

</style>
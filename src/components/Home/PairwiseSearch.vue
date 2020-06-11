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
            v-on:keydown.enter="searchProtein"
            hide-details="auto"
          ></v-text-field>
        </v-card-text>
      </v-card>
      <v-container fluid v-show="loading" class="pl-0 pr-0">
        <v-card outlined class="pa-5">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-card>
      </v-container>
      <v-container fluid class="pl-0 pr-0" v-if="relationshipRtn">
        <GeneToPathwayResult :data="relationshipRtn" />
      </v-container>
    </v-container>
</template>

<script>
import PairwiseService from "../../service/PairwiseService"
import GeneToPathwayResult from "./GeneToPathwayResult"
export default {
  name: "PairwiseSearch",
  components: {
    GeneToPathwayResult
  },
  data: () => ({
    search: "",
    relationshipRtn: null,
    loading: false
  }),
  methods: {
    async searchProtein() {
      try {
        this.relationshipRtn = null;
        this.loading = true;
        this.relationshipRtn = await PairwiseService.searchGeneName(
          this.search
        );
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    }
  },
}
</script>

<style scoped>

</style>
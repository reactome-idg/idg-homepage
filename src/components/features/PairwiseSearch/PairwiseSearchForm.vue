<template>
    <v-card dark raised class="mb-5">
      <v-card-text class="pa-3">
        <v-row align="center" justify="center">
          <v-col cols="12" md="10">
            <v-text-field
              dark
              label="Search a Gene qor Uniprot"
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
</template>

<script>
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
  },
};
</script>

<style scoped>
.searchContainer{
  text-transform: uppercase;
}
</style>
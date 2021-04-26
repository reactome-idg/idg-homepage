<template>
  <div class="search">
    <div class="grid">
      <div>
        <v-text-field
          label="Search a Gene or Uniprot"
          v-model="search"
          placeholder="e.g. NTN1, EGFR, O95631"
          :outlined="true"
          class="searchContainer"
          text-uppercase
          @keyup.enter="searchPairwise"
          :error-messages="error.length > 0 ? [error] : []"
          :hide-details="error.length > 0 ? false : true"
        ></v-text-field>
      </div>
      <v-btn color="var(--primary-color)" class="searchBtn" @click="searchPairwise">Search</v-btn>
      <!-- <div class="btn">Search</div> -->
    </div>
  </div>
</template>

<script>
import PairwiseService from "../../../service/PairwiseService";
import router from "../../../router";
export default {
  name: "PairwiseSearch",
  data: () => ({
    search: "",
    searchTerm: "",
    uniprotCheckBox: false,
    relationshipRtn: null,
    error: "",
  }),
  watch: {
    $route() {
      this.search = "";
    },
    search(newVal) {
      this.searchTerm = newVal.toUpperCase()
    }
  },
  methods: {
    async searchPairwise() {
      this.error = "";
      if (this.searchTerm === "") {
        this.error = "Please enter a search term";
        return;
      }
      this.error = "";

      try{
      const exists = await PairwiseService.checkforTerm(this.searchTerm);

      if(exists === false){
        this.error = "This term is not recorded. Please try a Gene Symbol or Uniprot Identifier";
        return
      }
      }catch(err) {
        this.error = "This term is not recorded. Please try a Gene Symbol or Uniprot Identifier";
        return
      }

      //Only push new search if not the same as current search
      const newRoute = `/search/${this.searchTerm}`;
      if (this.$route.path !== newRoute)
        router.push(`/search/${this.searchTerm}`);
    },
  },
};
</script>

<style scoped>
.search {
  background-color: #eee;
  height: 120px;
}
.search .grid {
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
}
.search .grid > *:first-child {
  grid-column: 1 / span 3;
}
.searchContainer {
  text-transform: uppercase;
  width: 100%;
}
.searchBtn {
  color: white !important;
  font-weight: bold;
}
.errorText {
  color: red;
  text-align: left;
  font-size: small;
}
</style>
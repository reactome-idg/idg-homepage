<template>
  <v-container fluid>
    <MainLinks />
    <About />
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
      <v-container fluid class="pl-0 pr-0" v-if="relationshipRtn">
        <GeneToPathwayResult :data="relationshipRtn" />
      </v-container>
    </v-container>
  </v-container>
</template>

<script>
import About from "../components/Home/About";
import MainLinks from "../components/Home/MainLinks";
import PairwiseService from "../service/PairwiseService";
import GeneToPathwayResult from "../components/Home/GeneToPathwayResult";
export default {
  name: "Home",
  components: {
    About,
    MainLinks,
    GeneToPathwayResult
  },
  data: () => ({
    search: "",
    relationshipRtn: null
  }),
  methods: {
    async searchProtein() {
      try {
        this.relationshipRtn = await PairwiseService.searchGeneName(
          this.search
        );
      } catch (err) {
        console.log(err);
      }
    }
  },
  beforeCreate: () => {
    document.body.className = "home";
  }
};
</script>

<style scoped>
.right-title {
  color: white;
}
.right-card {
  background-color: #555;
}
.searchContainer {
  width: 100%;
  outline: none !important;
  border: none !important;
}
</style>
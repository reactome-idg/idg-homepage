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
      <v-container fluid class="pl-0 pr-0">
        <v-card dark raised v-if="showResults">
          <v-card-title>Showing Results For: {{relationshipRtn.gene}}</v-card-title>
          <v-card-text>
            <CyInstance :cyElementsProp="relationshipRtn.fiData"/>
            <v-container fluid>
              <v-data-table dense>

              </v-data-table>
            </v-container>
          </v-card-text>
        </v-card>
      </v-container>
    </v-container>
  </v-container>
</template>

<script>
import About from "../components/layout/home/About";
import MainLinks from "../components/layout/home/MainLinks";
import PairwiseService from "../service/PairwiseService";
import CyInstance from "../components/features/pathwaySearch/CyInstance";
export default {
  name: "Home",
  components: {
    About,
    MainLinks,
    CyInstance
  },
  data: () => ({
    browserLink: "/PathwayBrowser/#/",
    reactomeLink: "https://reactome.org",
    headers: [
      { text: "Pathway Name", value: "pathwayName" }
    ],
    expanded: [],
    pathways: [],
    search: "",
    proteinName: "",
    relationshipRtn: {},
    showResults: false
  }),
  methods: {
    async searchProtein() {
      try {
        this.relationshipRtn = await PairwiseService.searchGeneName(
          this.search
        );
        this.showResults = true;
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
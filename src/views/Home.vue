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
            <CyInstance :cyElementsProp="relationshipRtn.fiData" />
            <v-container fluid>
              <v-data-table
                dense
                :headers="headers"
                :items="relationshipRtn.pathwayObjects"
                item-key="stId"
                show-expand
                :single-expand="true"
              >
                <template v-slot:item.stId="{item}">
                  <a :href="`${browserLink}${item.stId}`">{{item.stId}}</a>
                </template>
                <template v-slot:expanded-item="{headers, item}">
                  <td :colspan="headers.length">{{item.name}}</td>
                </template>
              </v-data-table>
            </v-container>
          </v-card-text>
        </v-card>
      </v-container>
    </v-container>
  </v-container>
</template>

<script>
import About from "../components/Home/About";
import MainLinks from "../components/Home/MainLinks";
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
      { text: "Pathway Stable id", value: "stId" },
      { text: "Pathway Name", value: "name" },
      { text: "Level", value: "level" }
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
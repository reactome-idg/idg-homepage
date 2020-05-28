<template>
  <v-container fluid>
    <MainLinks />
    <About />
    <v-container fluid>
      <v-card dark raised>
        <v-card-text >
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
      <v-card class="mt-5" dark raised v-if="pathways && pathways.length > 0">
        <v-card-text>
          <v-container fluid>
            <v-data-table
              :headers="headers"
              :items="pathways"
              :expanded.sync="expanded"
              :footer-props="{'items-per-page-options': [20,40,50,100,-1]}"
              show-expand
            >
              <template
                v-slot:item.description="{item}"
              >{{item.description.substring(0, 30) + "..."}}</template>
              <template v-slot:expanded-item="{headers, item}">
                <td :colspan="headers.length">
                  <p class="text-left">
                    <b>Description</b>
                  </p>
                  <p class="text-left">{{item.description}}</p>
                  <v-container v-if="item.overlayEntities && item.overlayEntities.length > 0">
                    <v-row>
                      <v-col
                        v-for="(entity, index) in item.overlayEntities"
                        :key="index"
                        cols="6"
                        md="2"
                        sm="4"
                        class="small-text"
                      >{{entity}}</v-col>
                    </v-row>
                  </v-container>
                </td>
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>

import About from "../components/layout/home/About"
import MainLinks from "../components/layout/home/MainLinks"
export default {
  name: "Home",
  components: {
    About,
    MainLinks
  },
  data: () => ({
    browserLink: "/PathwayBrowser/#/",
    reactomeLink: "https://reactome.org",
    headers: [
      { text: "Pathway Name", value: "pathwayName" },
      { text: "Stable Identifier", value: "stableIdentifier" },
      { text: "Description", value: "description" }
    ],
    expanded: [],
    pathways: [],
    search: "",
    proteinName: "",
  }),
  methods: {
    searchProtein() {
      fetch(`http://localhost:8085/pathways/${this.search}`)
        .then(result => {
          return result.json();
        })
        .then(pathways => {
          this.pathways = pathways;
          this.proteinName = this.search;
        })
        .catch(err => console.log(err));
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
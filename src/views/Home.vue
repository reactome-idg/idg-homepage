<template>
  <v-container fluid>
    <v-row dense>
      <!-- LEFT SIDE CONTAINER -->
      <v-col col="12" md="8" sm="12" xs="12">
        <v-container fluid>
          <v-card dark raised>
            <v-card-title>
              <v-text-field
                dark
                label="Search a protein"
                v-model="search"
                placeholder="e.g. O95631, NTN1, signaling by EGFR, glucose"
                :outlined="true"
                class="searchContainer"
                v-on:keydown.enter="searchProtein"
              ></v-text-field>
            </v-card-title>
            <v-card-text>
              <v-container v-if="pathways && pathways.length > 0">
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
          <v-card class="mt-5" dark raised>
            <v-card-title>Illuminating the Druggable Genome with Reactome</v-card-title>
            <v-card-text>
              <p
                class="text-left"
              >At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>
            </v-card-text>
          </v-card>
        </v-container>
      </v-col>
      <!-- RIGHT SIDE CONTAINER -->
      <v-col col="12" md="4" sm="12" xs="12">
        <v-container fluid>
          <v-card dark raised>
            <v-card-title class="mx-auto">IDG Reactome</v-card-title>
            <v-card-text>
              <v-card class="mx-auto mt-5" light max-width="350px" height="100%" raised>
                <v-card-title class="justify-center">
                  <a :href="browserLink">
                    <v-btn
                      large
                      color="primary"
                      height="100px"
                      width="100px"
                      class="navigationButton"
                    >Launch!</v-btn>
                  </a>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <p class="title font-weight-medium">Lauch the IDG Pathway Browser</p>
                  </v-container>
                </v-card-text>
              </v-card>
              <v-card class="mx-auto mt-5" light max-width="350px" height="100%" raised>
                <v-card-title class="justify-center">
                  <a v-bind:href="reactomeLink">
                    <v-btn
                      large
                      color="primary"
                      height="100px"
                      width="100px"
                      class="navigationButton"
                    >Go!</v-btn>
                  </a>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <p class="title font-weight-medium">Vist Reactome</p>
                  </v-container>
                </v-card-text>
              </v-card>
              <v-card class="mx-auto mt-5" light max-width="350px" height="100%" raised>
                <v-card-title class="justify-center">
                  <router-link to="/documentation">
                    <v-btn
                      color="primary"
                      height="100px"
                      width="100px"
                      class="navigationButton"
                    >View!</v-btn>
                  </router-link>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <p class="title font-weight-medium">Documentation</p>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  components: {},
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
    proteinName: ""
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
  width: 50%;
  outline: none !important;
  border: none !important;
}
</style>
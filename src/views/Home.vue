<template>
  <v-container fluid>
    <v-row dense>
      <v-col md="8" sm="12">
        <v-container fluid></v-container>
      </v-col>
      <v-col md="4" sm="12">
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
import router from "@/router/index.js";

export default {
  name: "Home",
  components: {},
  data: () => ({
    browserLink: "/PathwayBrowser/#/",
    reactomeLink: "https://reactome.org"
  }),
  methods: {
    searchProtein(proteinName) {
      router.push({
        name: "PathwaySearch",
        params: { proteinName: proteinName }
      });
    }
  },
  beforeCreate: () => {
    document.body.className = 'home';
  }
};
</script>

<style scoped>
.right-title{
  color:white;
}
.right-card{
  background-color:#555
}
</style>
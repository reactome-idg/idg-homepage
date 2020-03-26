<template>
  <v-container mt-5>
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="mx-auto" max-width="350px" height="100%" raised>
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
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="mx-auto" max-width="350px" height="100%" raised>
          <v-card-title class="justify-center">
            <a v-bind:href="reactomeLink">
              <v-btn large color="primary" height="100px" width="100px" class="navigationButton">Go!</v-btn>
            </a>
          </v-card-title>
          <v-card-text>
            <v-container>
              <p class="title font-weight-medium">Vist Reactome</p>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="mx-auto" max-width="350px" height="100%" raised>
          <v-card-title class="justify-center">
            <router-link to="/documentation">
              <v-btn color="primary" height="100px" width="100px" class="navigationButton">View!</v-btn>
            </router-link>
          </v-card-title>
          <v-card-text>
            <v-container>
              <p class="title font-weight-medium">Documentation</p>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "MainLinks",
  data() {
    return {
      browserLink: "/PathwayBrowser/#/",
      reactomeLink: "https://reactome.org"
    };
  }
};
</script>

<style scoped>
.navigationButton {
  border-radius: 16px;
}
</style>
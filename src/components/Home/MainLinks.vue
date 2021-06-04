<template>
  <div class="my-5">
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="mx-auto" light max-width="250px" height="100%" raised>
          <v-card-title class="justify-center">
            <a :href="browserLink">
              <v-btn
                large
                color="var(--idg-corporate-blue)"
                height="50px"
                width="100px"
                class="navigationButton"
              >Launch!</v-btn>
            </a>
          </v-card-title>
          <v-card-text>
            <div>
              <p class="font-weight-bold">Launch the IDG Pathway Browser</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="mx-auto" light max-width="250px" height="100%" raised>
          <v-card-title class="justify-center">
            <a v-bind:href="reactomeLink">
              <v-btn large color="var(--idg-corporate-blue)" height="50px" width="100px" class="navigationButton">Go!</v-btn>
            </a>
          </v-card-title>
          <v-card-text>
            <div>
              <p class="font-weight-bold">Vist Reactome</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="mx-auto" light max-width="250px" height="100%" raised>
          <v-card-title class="justify-center">
            <router-link to="/documentation/userguide">
              <v-btn color="var(--idg-corporate-blue)" height="50px" width="100px" class="navigationButton">View!</v-btn>
            </router-link>
          </v-card-title>
          <v-card-text>
            <div>
              <p class="font-weight-bold">User Guide</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "MainLinks",
  data: () => ({
    browserLink: "/PathwayBrowser/#/",
    reactomeLink: "https://reactome.org"
  })
};
</script>

<style>
.navigationButton{
  font-weight: bold;
  color: white !important;
}
</style>
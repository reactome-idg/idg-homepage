<template>
  <!-- <div class="my-5">
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="mx-auto" light max-width="250px" height="100%" raised>
          <v-card-title class="justify-center" width="100%">
            <a :href="browserLink" width="100%">
              <img :src="`${publicPath}assets/Home/images/pathway.svg`" alt="Pathway Browser icon" class="iconButton">
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
              <img :src="`${publicPath}assets/Home/images/pathway.svg`" alt="Pathway Browser icon" class="iconButton">
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
  </div> -->
  <div>
    <div class="flex space-around mb-5">
      <v-card  light height="250px" width="250px" raised>
          <div width="100%">
            <a :href="browserLink">
              <img :src="`${publicPath}assets/Home/images/pathway.svg`" alt="Pathway Browser icon" class="iconButton">
            </a>
          </div>
          <v-card-text>
            <div>
              <p class="font-weight-bold">Launch the IDG Pathway Browser</p>
            </div>
          </v-card-text>
        </v-card>
      <v-card light height="250px" width="250px" raised>
          <div width="100%">
            <a v-bind:href="reactomeLink">
              <img :src="`${publicPath}assets/Home/images/Reactome_Isotype.svg`" alt="Pathway Browser icon" class="iconButton">
            </a>
          </div>
          <v-card-text>
            <div>
              <p class="font-weight-bold">Vist Reactome</p>
            </div>
          </v-card-text>
        </v-card>
      <!-- <v-card light height="250px" width="250px" raised>
          <div width="100%">
            <a v-bind:href="reactomeLink">
              <v-icon class="iconButton" color="white">mdi-school</v-icon>
            </a>
          </div>
          <v-card-text>
            <div>
              <p class="font-weight-bold">Vist Reactome</p>
            </div>
          </v-card-text>
        </v-card> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "MainLinks",
  data: () => ({
    browserLink: "/PathwayBrowser/#/",
    reactomeLink: "https://reactome.org",
    publicPath : process.env.BASE_URL
  })
};
</script>

<style>
.navigationButton{
  font-weight: bold;
  color: white !important;
}
.iconButton{
  margin: 1em 0 0 0;
  padding: 1.5em;
  width: 150px;
  height:150px;
  border-radius: 16px;
  background-color: var(--idg-dark-blue);
}
.iconButton:hover{
  background-color: var(--idg-corporate-blue);
}
</style>
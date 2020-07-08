<template>
  <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-card light raised>
            <v-card-title class="justify-center">
             <a v-bind:href="reactomeDocumentation" target="_blank">
              <v-btn large color="primary" height="100px" width="100px" class="navigationButton">Go!</v-btn>
            </a>
            </v-card-title>
            <v-card-text>
              <p class="title font-weight-medium">Visit the Reactome Documentation</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card light raised>
            <v-card-title class="justify-center">
              <router-link to="/cite"><v-btn large
                color="primary"
                height="100px"
                width="100px">Cite Us!</v-btn></router-link>
            </v-card-title>
            <v-card-text>
              <p class="title font-weight-medium">Cite the IDG Reactome</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      </v-container>
</template>

<script>
export default {
    name: "DocumentationLinks",
    data() {
      return{
        reactomeDocumentation: "https://reactome.org/documentation"
      }
    }
}
</script>

<style scoped>

</style>
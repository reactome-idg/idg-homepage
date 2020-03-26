<template>
  <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="justify-center">
              <v-btn large
                color="primary"
                height="100px"
                width="100px">Go!</v-btn>
            </v-card-title>
            <v-card-text>
              <p class="title font-weight-medium">Visit the Reactome Documentation</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="justify-center">
              <v-btn large
                color="primary"
                height="100px"
                width="100px">Cite Us!</v-btn>
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
    name: "DocumentationLinks"
}
</script>

<style scoped>

</style>
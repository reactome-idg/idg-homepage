<template>
  <div class="container">
    <h1>Dowloads</h1>
    <hr class="mb-10" />
    <div>
      <h3 class="mb-5">MongoDb</h3>
      <p>
        This file is a .tgz zipped dump file of the mongodb backing the interactions available in the IDG extension of the reactome Pathway Browser.
        It contains a main collection of relationships. This collection has a document for each gene and all of its relationships across all documented 
        features. The gene names for interactors are indexed in the GENE_INDEX collection.
      </p>
      <div class="pl-3">
          <v-icon class="pl-5 pr-2">mdi-file-download-outline</v-icon>
          <span
            ><a :href="mongoFiles.dump.location">{{ mongoFiles.dump.name }}</a></span
          >
      </div>
      <h3 class="my-5">Text Files</h3>
      <p>
        This file is a .tgz zipped csv file containing interactions and the features the interaction are contained in. Features are encoded with 0, 1 or -1 to
        differentiate no interaction, positive interaction, and negative interaction respectively. 
      </p>
      <div class="pl-3">
          <v-icon class="pl-5 pr-2">mdi-file-download-outline</v-icon>
          <span
            ><a :href="mongoFiles.featureCSV.location">{{ mongoFiles.featureCSV.name }}</a></span
          >
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "Downloads",
  data: () => ({
    mongoFiles: {
      dump: {
        name: "MongoDB Dump File.tgz",
        location: "/download/reactome_idg/reactome_idg_mongoDB_dump.tgz",
      },
      featureCSV: {
        name: "Pairwise Features.csv",
        location: "/download/reactome_idg/reactome_idg_pairwise_features.tgz"
      }
    },
  }),
};
</script>

<style scoped>
</style>
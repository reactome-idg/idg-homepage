<template>
      <v-card class="mb-5" raised>
        <v-card-title>
          Illuminating the Druggable Genome with Reactome
          <v-spacer></v-spacer>
          <v-btn icon @click="show = !show">
            <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-expand-transition>
          <div v-show="show">
            <v-card-text>
              <p
                class="text-left">
                Placing understudied proteins in the context of biological pathways facilitates the generation of experimentally testable hypotheses to infer potential functions of these proteins. 
                The Reactome Pathway Diagram View is a web-based tool, providing a biologist-friendly way to visualize proteins, complexes, and reactions in high-quality Reactome pathways. In order to 
                put understudied proteins in the context of Reactome pathways, we have extended the Pathway Diagram View to overlay tissue-specific expression data, protein pairwise relationships, and 
                drug/target interactions. We implemented new interfaces for users to select tissue-specific mRNA and protein expression data from 19 data sources collected in the target central 
                resource database (TCRD). The pairwise relationship overlay allows users to display positive and negative relationships from multiple sources in the same view. We have also 
                implemented a new visualizer via the use of Cytoscape.js, allowing a pathway to be displayed as a set of functional interactions. Drugs can be overlayed in our pairwise view and in the 
                new functional interaction visualizer. The new features we have introduced in the Reactome Pathway Diagram View pave the way for us to predict and visualize functions of understudied 
                proteins based on Reactome pathways.
                </p>
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
</template>

<script>
export default {
    name: "About",
    data: () => ({
        show:false
    })
}
</script>

<style scoped>

</style>
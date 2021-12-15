<template>
    <v-card outlined class="edgeInfoCard pa-2" v-if="selectedEdges.length > 0">
        <v-data-table
          :headers="edgeTableHeaders"
          :items="selectedEdges"
          item-key="id"
          :hide-default-footer="true"
          dense
          class="text-xs-caption"
          > <!-- Need to adjust the font size to smaller -->
        <template v-slot:item.hypergeometricScore="{ item }">{{
              item.hypergeometricScore.toExponential(2)
            }}</template>
        </v-data-table>
    </v-card>
</template>

<script>

export default {
    name: "EdgeTable",
    props: {
        // Array is needed for table
        selectedEdges: [],
    },
    computed: {
    edgeTableHeaders() {
      return [
        {
          text: '',
          value: 'id',
          align: 'start'
        },
        {
          text: 'Shared Genes',
          value: 'numSharedGenes'
        },
        {
          text: 'Overlap pvalue',
          value: 'hypergeometricScore'
        }
      ]
    },
  },
}

</script>

<!-- This reason to have this as an independent component is that we can reset its font size. 
However, apparent it cannot work still without scope it -->
<style scoped>
/* 
control the edeg table font */
.v-data-table > .v-data-table__wrapper > table > thead > tr > th,
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
   font-size: 10px;
}
</style>

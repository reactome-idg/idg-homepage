<template>
    <v-card outlined class="edgeInfoCard pa-0" v-if="selectedEdges.length > 0">
        <!-- use simple table for easy css control -->
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left"></th>
                <th class="text-left" :style="fontSize">Shared Genes</th>
                <th class="text-left" :style="fontSize">Overlap pvalue</th>
              </tr>
            </thead>
            <tbody>
              <tr
               v-for="edge in selectedEdges"
               :key="edge.id"
              >
                <td class="text-left" :style="fontSize">{{edge.id}}</td>
                <td class="text-left" :style="fontSize">{{edge.numSharedGenes}}</td>
                <td class="text-left" :style="fontSize">{{edge.hypergeometricScore.toExponential(2)}}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
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
      fontSize() {
        return "font-size: 10px"
      },
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

<!-- control internally in the template directly -->
<!-- The reason to have this as an independent component is that we can reset its font size. 
However, apparent it cannot work with v-data-table -->
<style scoped>
/* 
control the edeg table font */
/** For some reason, the following can control simple table css. However, to avoid any conflict
 in-line style is used. */
/* .v-data-table > .v-data-table__wrapper > table > thead > tr > th,
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
   font-size: 10px;
} */
</style>

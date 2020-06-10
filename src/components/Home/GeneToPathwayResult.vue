<template>
  <v-card dark raised>
    <v-card-title>Showing Results For: {{data.gene}}</v-card-title>
    <v-card-text>
      <CyInstance :cyElementsProp="data.fiData" />
      <v-container fluid>
        <v-data-table
          dense
          :headers="headers"
          :items="data.pathwayObjects"
          item-key="stId"
          show-expand
          :single-expand="true"
        >
          <template v-slot:item.stId="{item}">
            <a :href="`${browserLink}${item.stId}`">{{item.stId}}</a>
          </template>
          <template v-slot:expanded-item="{headers, item}">
            <td :colspan="headers.length">{{item.name}}</td>
          </template>
        </v-data-table>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import CyInstance from "./CyInstance";
export default {
  name: "GeneToPathwayResult",
  components: {
    CyInstance
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    browserLink: "/PathwayBrowser/#/",
    headers: [
      { text: "Pathway Stable id", value: "stId" },
      { text: "Pathway Name", value: "name" },
      { text: "Level", value: "level" }
    ]
  })
};
</script>

<style scoped>
</style>
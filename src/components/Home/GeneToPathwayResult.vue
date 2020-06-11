<template>
  <v-card dark raised>
    <v-card-title>Showing Results For: {{data.gene}}</v-card-title>
    <v-card-text>
      <CyInstance :cyElementsProp="data.fiData" />
      <v-container fluid v-if="data.pathways && data.pathways.length > 0">
        <p class="display-1 text-left">Primary Pathways</p>
        <v-data-table
          :headers="headers"
          :items="data.pathways"
          item-key="stId"
          show-expand
          single-expand
          :footer-props="{'items-per-page-options': [5,10,50,-1]}"
          :hide-default-footer="hidePrimaryPagination"
        ></v-data-table>
        <hr />
      </v-container>
      <p v-else>No primary pathways found.</p>
      <v-container fluid v-if="data.secondaryPathways && data.secondaryPathways.length > 0">
        <p class="display-1 text-left">Secondary Pathways</p>
        <v-data-table
          dense
          :headers="headers"
          :items="data.secondaryPathways"
          item-key="stId"
          show-expand
          :single-expand="true"
          :footer-props="{'items-per-page-options': [20,40,50,100,-1]}"
          :hide-default-footer="hideSecondaryPagination"
        >
          <template v-slot:item.stId="{item}">
            <a :href="`${browserLink}${item.stId}`">{{item.stId}}</a>
          </template>
          <template v-slot:expanded-item="{headers, item}">
            <td :colspan="headers.length">{{item.name}}</td>
          </template>
        </v-data-table>
      </v-container>
      <p v-else>No secondary pathways found.</p>
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
      { text: "Pathway Name", value: "name" }
    ]
  }),
  computed: {
    hidePrimaryPagination() {
      return this.data.pathways.length < 10;
    },
    hideSecondaryPagination() {
        return this.data.secondaryPathways.length < 20;
    }
  }
};
</script>

<style scoped>
</style>
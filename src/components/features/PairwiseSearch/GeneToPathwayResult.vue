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
          @item-expanded="loadDetails"
        >
          <template v-slot:item.stId="{item}">
            <a :href="`${browserLink}${item.stId}`">{{item.stId}}</a>
          </template>
          <template v-slot:expanded-item="{headers}">
            <td :colspan="headers.length">
               <TableDetails v-if="openPathwayDetails" :details="openPathwayDetails"/>
               <v-progress-circular v-else indeterminate color="primary"></v-progress-circular>

            </td>
          </template>
        </v-data-table>
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
          @item-expanded="loadDetails"
        >
          <template v-slot:item.stId="{item}">
            <a :href="`${browserLink}${item.stId}`">{{item.stId}}</a>
          </template>
          <template v-slot:expanded-item="{headers}">
            <td :colspan="headers.length">
              <TableDetails v-if="openPathwayDetails" :details="openPathwayDetails"/>
              <v-progress-circular v-else indeterminate color="primary"></v-progress-circular>
            </td>
          </template>
        </v-data-table>
      </v-container>
      <p v-else>No secondary pathways found.</p>
    </v-card-text>
  </v-card>
</template>

<script>
import CyInstance from "./CyInstance";
import TableDetails from "./TableDetails"
import ReactomeService from "../../../service/ReactomeService";
export default {
  name: "GeneToPathwayResult",
  components: {
    CyInstance,
    TableDetails
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
    ],
    pathwayDetailsList: [],
    openPathwayDetails: null
  }),
  computed: {
    hidePrimaryPagination() {
      return this.data.pathways.length < 10;
    },
    hideSecondaryPagination() {
      return this.data.secondaryPathways.length < 20;
    }
  },
  methods: {
    async loadDetails({ item, value }) {
      if (!value) return;
      this.openPathwayDetails = null;

      try {
        if (!this.pathwayDetailsList.some(e => e.stId === item.stId)) {
          this.pathwayDetailsList.push(
            await ReactomeService.fetchPathwayDetails(item.stId)
          );
        }
        const open = this.pathwayDetailsList.find(pathway => {
          return pathway.stId === item.stId;
        });
        if (open !== undefined) {
          this.openPathwayDetails = {
            stId: open.stId,
            description:
              open.details.summation !== null
                ? open.details.summation[0].text
                : "No Description Available.",
            ancestors: open.ancestors
          };
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style scoped>
</style>
<template>
  <v-card dark raised>
    <v-card-title>Showing Results For: {{data.gene}}</v-card-title>
    <v-card-text>
      <v-container fluid class="pb-5">
        <span>Significance level: </span>
        <v-text-field prefix="FDR ≤" v-model="fdrInput" @keyup.enter="updateFDR" hide-details class="search-box pr-1"></v-text-field>
        <v-text-field prefix="pValue ≤" v-model="pValInput" @keyup.enter="updatePValue" hide-details class="search-box pr-1"></v-text-field>
        </v-container>
      <CyInstance :cyElementsProp="data.fiData" :pVal="pVal" :fdr="fdr"/>
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
          :headers="secondaryHeaders"
          :items="filteredSecondaryPathways"
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
          <template v-slot:item.fdr="{item}">
            {{ item.fdr.toExponential(2) }}
          </template>
          <template v-slot:item.pVal="{item}">
            {{ item.pVal.toExponential(2) }}
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
      { text: "Pathway Name", value: "name" },
    ],
    secondaryHeaders: [
      { text: "Pathway Stable id", value: "stId" },
      { text: "Pathway Name", value: "name" },
      { text: "FDR", value:"fdr"},
      { text: "pValue", value: "pVal"}
    ],
    pathwayDetailsList: [],
    openPathwayDetails: null,
    fdr: 0.05,
    pVal: 0.05,
    fdrInput: "0.05",
    pValInput: "0.05"
  }),
  computed: {
    hidePrimaryPagination() {
      return this.data.pathways.length < 10;
    },
    hideSecondaryPagination() {
      return this.data.secondaryPathways.length < 20;
    },
    filteredSecondaryPathways() {
      return this.data.secondaryPathways.filter(i => {
        return i.fdr <= this.fdr && i.pVal <= this.pVal
      })
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
    },
    updateFDR() {
      const newFDR = Number.parseFloat(this.fdrInput).isNaN ? this.fdr : Number.parseFloat(this.fdrInput);
      this.fdr = newFDR
    },
    updatePValue(){
      const newPVal = Number.parseFloat(this.pValInput).isNaN ? this.pVal : Number.parseFloat(this.pValInput)
      this.pVal = newPVal
    }
  }
};
</script>

<style scoped>
.search-box{
  float: left;
  width: 25%;
}
</style>
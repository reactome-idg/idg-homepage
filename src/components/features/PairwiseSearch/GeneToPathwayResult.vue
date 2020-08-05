<template>
  <v-card dark raised>
    <v-card-title>Showing Results For: {{gene}}</v-card-title>
    <v-card-text>
      <v-container fluid v-if="primaryPathways && primaryPathways.length > 0">
        <p class="display-1 text-left">Primary Pathways</p>
        <v-data-table
          :headers="headers"
          :items="primaryPathways"
          item-key="stId"
          :search="primarySearch"
          show-expand
          :footer-props="{'items-per-page-options': [5,10,50,-1]}"
          :hide-default-footer="hidePrimaryPagination"
          @item-expanded="loadDetails"
        >
          <template v-slot:item.stId="{item}">
            <a :href="getPrimaryLink(item.stId)">{{item.stId}}</a>
          </template>
          <template v-slot:expanded-item="{headers}">
            <td :colspan="headers.length">
              <TableDetails v-if="openPathwayDetails" :details="openPathwayDetails" />
              <v-progress-circular v-else indeterminate color="primary"></v-progress-circular>
            </td>
          </template>
          <template v-slot:footer="{}">
            <v-text-field
              v-if="!hidePrimaryPagination"
              v-model="primarySearch"
              label="Search"
              hide-details
              single-line
              class="search-box pr-1"
            ></v-text-field>
          </template>
        </v-data-table>
        <hr />
      </v-container>
      <p v-else>No primary pathways found.</p>
      <v-container fluid>
        <p class="display-1 text-left">Secondary Pathways</p>
        <v-container fluid v-if="secondaryPathways && secondaryPathways.length > 0">
          <v-data-table
            dense
            :headers="secondaryHeaders"
            :items="filteredSecondaryPathways"
            item-key="stId"
            show-expand
            :search="secondarySearch"
            :single-expand="true"
            :footer-props="{'items-per-page-options': [20,40,50,100,-1]}"
            :hide-default-footer="hideSecondaryPagination"
            @item-expanded="loadDetails"
          >
            <template v-slot:item.stId="{item}">
              <a :href="getSecondaryLink(item.stId)">{{item.stId}}</a>
            </template>
            <template v-slot:item.fdr="{item}">{{ item.fdr.toExponential(2) }}</template>
            <template v-slot:item.pVal="{item}">{{ item.pVal.toExponential(2) }}</template>
            <template v-slot:expanded-item="{headers}">
              <td :colspan="headers.length">
                <TableDetails v-if="openPathwayDetails" :details="openPathwayDetails" />
                <v-progress-circular v-else indeterminate color="primary"></v-progress-circular>
              </td>
            </template>
            <template v-slot:footer="{}">
              <v-text-field
                v-if="!hideSecondaryPagination"
                v-model="secondarySearch"
                label="Search"
                hide-details
                single-line
                class="search-box pr-1"
              ></v-text-field>
              <v-text-field
                prefix="FDR ≤"
                v-model="fdrInput"
                @keyup.enter="updateFDR"
                hide-details
                class="pr-1 search-box"
              ></v-text-field>
            </template>
          </v-data-table>
        </v-container>
        <SecondaryPathwaysForm v-else :errors="secondarySearchErrors" @searchSecondaryPathways="searchSecondaryPathways" />
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import PairwiseService from "../../../service/PairwiseService";
import TableDetails from "./TableDetails";
import SecondaryPathwaysForm from "./SecondaryPathwaysForm";
import ReactomeService from "../../../service/ReactomeService";
export default {
  name: "GeneToPathwayResult",
  components: {
    TableDetails,
    SecondaryPathwaysForm,
  },
  props: {
    gene: {
      type: String,
      default: () => "",
    },
    primaryPathways: {
      type: Array,
      default: () => [],
    },
    uniprot: {
      type: Boolean,
      default: () => false,
    },
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
      { text: "FDR", value: "fdr" },
      { text: "pValue", value: "pVal" },
    ],
    pathwayDetailsList: [],
    secondaryPathways: [],
    openPathwayDetails: null,
    fdr: 1.00,
    fdrInput: "1.00",
    primarySearch: "",
    secondarySearch: "",
    secondarySearchErrors: [],
  }),
  computed: {
    hidePrimaryPagination() {
      return this.primaryPathways.length < 10;
    },
    hideSecondaryPagination() {
      return this.secondaryPathways.length < 20;
    },
    filteredSecondaryPathways() {
      return this.secondaryPathways.filter((i) => {
        return i.fdr <= this.fdr;
      });
    },
    primaryBrowserLink() {
      return ``;
    },
  },
  methods: {
    async loadDetails({ item, value }) {
      if (!value) return;
      this.openPathwayDetails = null;

      try {
        if (!this.pathwayDetailsList.some((e) => e.stId === item.stId)) {
          this.pathwayDetailsList.push(
            await ReactomeService.fetchPathwayDetails(item.stId)
          );
        }
        const open = this.pathwayDetailsList.find((pathway) => {
          return pathway.stId === item.stId;
        });
        if (open !== undefined) {
          this.openPathwayDetails = {
            stId: open.stId,
            description:
              open.details.summation !== null
                ? open.details.summation[0].text
                : "No Description Available.",
            ancestors: open.ancestors,
          };
        }
      } catch (err) {
        console.log(err);
      }
    },
    async searchSecondaryPathways(dataDescs) {
      this.secondarySearchErrors = [];
      if (!this.uniprot) {
        this.secondaryPathways = await PairwiseService.searchGeneSecondaryPathways(
          {
            gene: this.gene,
            dataDescs: dataDescs,
          }
        );
      } else {
        this.secondaryPathways = await PairwiseService.searchUniprotSecondaryPathways(
          {
            gene: this.gene,
            dataDescs: dataDescs,
          }
        );
      }
      if (this.secondaryPathways.length === 0)
        this.secondarySearchErrors.push(
          "No pathways for this selection. Please try another."
        );
    },
    updateFDR() {
      const newFDR = Number.parseFloat(this.fdrInput).isNaN
        ? this.fdr
        : Number.parseFloat(this.fdrInput);
      this.fdr = newFDR;
    },
    getPrimaryLink(stId) {
      return `${this.browserLink}${stId}&FLG=${this.gene}`;
    },
    getSecondaryLink(stId) {
      return `${this.browserLink}${stId}&FLG=${this.gene}&FLGINT`;
    },
  },
};
</script>

<style scoped>
.search-box {
  align-content: left;
  justify-content: left;
  max-width: 25em;
  margin-right: 0.25em;
}
</style>
<template>
  <v-container fluid>
      <div class="text-left">
        <span class="display-1">Secondary Pathways</span>
        <small class="pl-2">Reachable through interactors</small>
        <small class="pl-2">{{ currentSecondarySearchDescs.join(", ") }}</small>
      </div>
      <v-container fluid v-if="secondaryPathwaysLoading">
        <v-card outlined>
          <v-card-text>
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-card-text>
        </v-card>
      </v-container>
      <v-container
        fluid
        v-if="secondaryPathways && secondaryPathways.length > 0"
      >
        <v-card outlined>
          <v-btn
            icon
            style="float: left"
            class="mx-1"
            @click="closeSecondaryPathways"
          >
            <v-icon>{{ "mdi-close" }}</v-icon>
          </v-btn>
          <v-card-text>
            <v-data-table
              dense
              :headers="secondaryHeaders"
              :items="filteredSecondaryPathways"
              item-key="stId"
              show-expand
              :search="secondarySearch"
              :single-expand="true"
              :footer-props="{
                'items-per-page-options': [20, 40, 50, 100, -1],
              }"
              :hide-default-footer="hideSecondaryPagination"
              @item-expanded="loadSecondaryDetails"
              :must-sort="true"
            >
              <template v-slot:item.stId="{ item }">
                <a :href="getSecondaryLink(item.stId)">{{ item.stId }}</a>
              </template>
              <template v-slot:item.fdr="{ item }">{{
                item.fdr.toExponential(2)
              }}</template>
              <template v-slot:item.pVal="{ item }">{{
                item.pVal.toExponential(2)
              }}</template>
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <TableDetails v-if="item.details" :details="item.details" />
                  <v-progress-circular
                    v-else
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </td>
              </template>
              <template v-slot:footer="{}">
                <v-row>
                  <v-col cols="2">
                    <v-text-field
                      v-if="!hideSecondaryPagination"
                      v-model="secondarySearch"
                      label="Search"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      prefix="FDR ≤"
                      v-model="fdrInput"
                      @keyup.enter="updateFDR"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-container>
      <SecondaryPathwaysForm
        v-else-if="secondaryPathways.length === 0 && !secondaryPathwaysLoading"
        :errors="secondarySearchErrors"
        :initialDescs="currentSecondarySearchDescs"
        @searchSecondaryPathways="searchSecondaryPathways"
      />
  </v-container>
</template>

<script>
import PairwiseService from "../../../service/PairwiseService";
import ReactomeService from "../../../service/ReactomeService";
import SecondaryPathwaysForm from "./SecondaryPathwaysForm";
import TableDetails from "./TableDetails";
export default {
  name: "InteractorSearch",
  components: {
    SecondaryPathwaysForm,
    TableDetails
  },
  props: {
    term: {
      type: String,
      default: () => "",
    },
    uniprotBoolean: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    browserLink: "/PathwayBrowser/#/",
    secondaryHeaders: [
      { text: "Pathway Stable id", value: "stId" },
      { text: "Pathway Name", value: "name" },
      { text: "pValue", value: "pVal" },
      { text: "FDR", value: "fdr" },
    ],
    secondaryPathways: [],
    fdr: 1.0,
    fdrInput: "1.00",
    secondarySearch: "",
    secondarySearchErrors: [],
    currentSecondarySearchDescs: [],
    secondaryPathwaysLoading: false,
  }),
  computed: {
    hideSecondaryPagination() {
      return this.secondaryPathways.length < 20;
    },
    filteredSecondaryPathways() {
      return this.secondaryPathways.filter((i) => {
        return i.fdr <= this.fdr;
      });
    },
  },
  methods: {
      async loadSecondaryDetails({ item, value }) {
      if (!value) return;
      try {
        if (!item.details) {
          const data = await ReactomeService.fetchPathwayDetails(item.stId);
          item.details = data;
          this.secondaryPathways.filter(
            (p) => p.stId === item.stId
          ).details = data;
          this.$forceUpdate();
        }
      } catch (err) {
        console.log(err);
      }
    },
    async searchSecondaryPathways(dataDescs) {
      this.secondaryPathwaysLoading = true;
      this.secondarySearchErrors = [];
      this.currentSecondarySearchDescs = dataDescs;
      if (!this.uniprotBoolean) {
        this.secondaryPathways = await PairwiseService.searchGeneSecondaryPathways(
          {
            gene: this.term,
            dataDescs: dataDescs,
          }
        );
      } else {
        this.secondaryPathways = await PairwiseService.searchUniprotSecondaryPathways(
          {
            gene: this.term,
            dataDescs: dataDescs,
          }
        );
      }
      this.secondaryPathwaysLoading = false;
      if (this.secondaryPathways.length === 0) {
        this.currentSecondarySearchDescs = [];
        this.secondarySearchErrors.push(
          "No pathways for this selection. Please try another."
        );
      }
    },
    updateFDR() {
      const newFDR = Number.parseFloat(this.fdrInput).isNaN
        ? this.fdr
        : Number.parseFloat(this.fdrInput);
      this.fdr = newFDR;
    },
    getSecondaryLink(stId) {
      var descs = [];
      this.currentSecondarySearchDescs.forEach((desc) => {
        descs.push(desc.replace(/\|/g, "%7C"));
      });
      return `${this.browserLink}${stId}&FLG=${this.gene},${descs.join(
        ","
      )}&FLGINT`;
    },
    closeSecondaryPathways() {
      this.secondaryPathways = [];
    },
  }
};
</script>

<style scoped>
</style>
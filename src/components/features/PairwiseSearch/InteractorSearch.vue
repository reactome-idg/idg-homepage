<template :dark="darkmode">
  <v-container fluid>
    <div class="text-left">
      <span class="larger">{{ title }}</span>
      <small class="pl-2">{{ subtitle }}</small>
      <small class="pl-2">{{ currentSecondarySearchDescs.join(", ") }}</small>
    </div>
    <v-container fluid v-if="secondaryPathwaysLoading">
      <v-card :dark="darkmode" outlined>
        <v-card-text>
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-card-text>
      </v-card>
    </v-container>
    <v-card
      :dark="darkmode"
      outlined
      v-if="secondaryPathways && secondaryPathways.length > 0"
      class="text-left justify-left"
    >
      <div v-if="currentSecondarySearchDescs.length > 0">
        <v-btn icon class="mx-1" @click="closeIndividualSourcesEvent">
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
      </div>
      <div v-else>
        <v-row class="pl-5 pr-5">
          <v-col cols="12" md="6">
            <v-text-field
              prefix="Significance Cutoff ≤"
              v-model="prd"
              @keyup.enter="updatePRD"
              hide-details
              type="number"
              min="0"
              max="1"
              step="0.1"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-btn class="ma-1 float-right" @click="chooseIndividualSourcesEvent">Choose Individual Sources</v-btn>
          </v-col>
        </v-row>
      </div>
      <v-card-text>
        <v-data-table
          dense
          :headers="secondaryHeaders"
          :items="filteredSecondaryPathways"
          item-key="stId"
          show-expand
          :expand-icon="mdiChevronDown"
          :search="secondarySearch"
          :single-expand="true"
          :footer-props="{
            'items-per-page-options': [20, 40, 50, 100, -1],
            'next-icon': mdiChevronRight,
            'prev-icon': mdiChevronLeft,
          }"
          :hide-default-footer="hideSecondaryPagination"
          @item-expanded="loadSecondaryDetails"
          :must-sort="true"
        >
          <template v-slot:item.stId="{ item }">
            <a :href="getSecondaryLink(item.stId)" :target="linkTarget">{{
              item.stId
            }}</a>
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
          <v-data-footer
            :next-icon="mdiChevronRight"
            :prev-icon="mdiChevronLeft"
          ></v-data-footer>
        </v-data-table>
      </v-card-text>
    </v-card>
    <SecondaryPathwaysForm
      v-else-if="secondaryPathways.length === 0 && !secondaryPathwaysLoading"
      :errors="secondarySearchErrors"
      :initialDescs="currentSecondarySearchDescs"
      :darkmode="darkmode"
      @searchSecondaryPathways="searchSecondaryPathways"
      @searchCombinedScores="searchCombinedScores"
    />
  </v-container>
</template>

<script>
import PairwiseService from "../../../service/PairwiseService";
import ReactomeService from "../../../service/ReactomeService";
import SecondaryPathwaysForm from "./SecondaryPathwaysForm";
import TableDetails from "./TableDetails";
import {
  VContainer,
  VDataTable,
  VCardText,
  VTextField,
  VIcon,
  VCol,
  VRow,
  VCard,
  VProgressCircular,
} from "vuetify/lib";
import vuetify from "../../../plugins/vuetify";
import {
  mdiClose,
  mdiChevronLeft,
  mdiChevronRight,
  mdiChevronDown,
} from "@mdi/js";

export default {
  name: "InteractorSearch",
  components: {
    SecondaryPathwaysForm,
    TableDetails,
    VContainer,
    VDataTable,
    VCardText,
    VTextField,
    VIcon,
    VCol,
    VRow,
    VCard,
    VProgressCircular,
  },
  vuetify,
  props: {
    term: {
      type: String,
      default: () => "",
    },
    darkmode: {
      type: Boolean,
      default: () => false,
    },
    title: {
      type: String,
      default: () => "Interacting Pathways",
    },
    subtitle: {
      type: String,
      default: () => "Reachable through interactions",
    },
  },
  data: () => ({
    mdiClose,
    mdiChevronLeft,
    mdiChevronRight,
    mdiChevronDown,
    browserLink: process.env.VUE_APP_BROWSER_LINK,
    linkTarget: process.env.VUE_APP_LINK_TARGET,
    secondaryHeaders: [
      { text: "Pathway Stable id", value: "stId" },
      { text: "Pathway Name", value: "name" },
      { text: "pValue", value: "pVal" },
      { text: "FDR", value: "fdr" },
    ],
    secondaryPathways: [],
    fdr: 1.0,
    fdrInput: "1.00",
    prd: 0.90,
    currentCombinedScorePathways: [],
    secondarySearch: "",
    secondarySearchErrors: [],
    currentSecondarySearchDescs: [],
    secondaryPathwaysLoading: false,
  }),
  watch: {
    term() {
      this.secondaryPathways = [];
      this.fdr = 1.0;
      this.fdrInput = "1.00";
      this.prd = 0.5;
      this.secondarySearch = "";
      this.secondarySearchErrors = [];
      this.currentSecondarySearchDescs = [];
      this.loadCombinedScores();
    },
  },
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
  async created() {
    this.loadCombinedScores();
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
    searchCombinedScores(prd) {
      this.prd = prd;
      this.loadCombinedScores();
    },
    async loadCombinedScores() {
      this.secondaryPathwaysLoading = true;
      this.secondarySearchErrors = [];
      this.secondaryPathways = [];
      try {
        this.currentCombinedScorePathways = await PairwiseService.loadCombinedScores({
          term: this.term,
          prd: this.prd,
        });
        this.secondaryPathways = this.currentCombinedScorePathways;
        if(this.secondaryPathways.length === 0)
          this.secondaryPathwaysError();
      } catch (err) {
        this.secondaryPathwaysLoading = false;
        this.secondaryPathwaysError();
      }
      this.secondaryPathwaysLoading = false;
    },
    async searchSecondaryPathways(dataDescs) {
      this.secondaryPathwaysLoading = true;
      this.secondarySearchErrors = [];
      this.secondaryPathways = [];
      this.currentSecondarySearchDescs = dataDescs;
      try {
        this.secondaryPathways = await PairwiseService.searchTermSecondaryPathways(
          {
            term: this.term,
            dataDescs: dataDescs,
          }
        );
      } catch (err) {
        this.secondaryPathwaysLoading = false;
        this.secondaryPathwaysError();
      }

      this.secondaryPathwaysLoading = false;
      if (this.secondaryPathways.length === 0) {
        this.secondaryPathwaysError();
      }
    },
    secondaryPathwaysError() {
      this.currentSecondarySearchDescs = [];
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
    updatePRD() {
      this.loadCombinedScores();
    },
    getSecondaryLink(stId) {
      var descs = [];
      this.currentSecondarySearchDescs.forEach((desc) => {
        descs.push(desc.replace(/\|/g, "%7C"));
      });
      return `${this.browserLink}${stId}&FLG=${this.term},${descs.join(
        ","
      )}&FLGINT`;
    },
    chooseIndividualSourcesEvent() {
      this.secondaryPathways = [];
      this.currentSecondarySearchDescs = [];
    },
    closeIndividualSourcesEvent() {
      this.secondaryPathways = this.currentCombinedScorePathways;
      this.currentSecondarySearchDescs = [];
    }
  },
};
</script>

<style scoped>
@import "../../../../node_modules/vuetify/dist/vuetify.min.css";
</style>
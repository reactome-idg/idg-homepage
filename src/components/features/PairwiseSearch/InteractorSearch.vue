<template :dark="darkmode">
  <v-container fluid>
    <div class="text-left">
      <span class="larger">{{ title }}</span>
      <small class="pl-2">{{ subtitle }}</small>
      <small class="pl-2">{{ currentSecondarySearchDescs.join(", ") }}</small>
    </div>
    <v-card
      :dark="darkmode"
      v-if="!showSecondarySearchForm"
      outlined
      class="text-left justify-left"
    >
      <div v-if="currentSecondarySearchDescs.length > 0">
        <v-btn icon class="mx-1" @click="closeIndividualSources">
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
      </div>
      <div v-else>
        <v-row no-gutters class="pl-5 pr-5">
          <v-col cols="9" md="6">
            <v-text-field
              prefix="Functional Interaction Score ="
              v-model="prd"
              @keyup.enter="updatePRD"
              hide-details
              type="number"
              min="0"
              max="1"
              step="0.1"
            ></v-text-field>
          </v-col>
          <v-col cols="3" md="3" align-self="end">
            <v-btn class="ml-2" small @click="updatePRD">UPDATE</v-btn>
          </v-col>
          <v-col cols="12" md="3" align-self="end">
            <v-btn class="ma-1 float-right" @click="openInteractorSearchForm">Choose Individual Sources</v-btn>
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
          :loading="secondaryPathwaysLoading"
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
          <template v-slot:body.append>
            <tr >
              <td colspan="2"><v-text-field
                  v-if="!hideSecondaryPagination"
                  v-model="secondarySearch"
                  label="Search"
                  hide-details
                ></v-text-field></td>
                <td colspan="2"></td>
                <td colspan="1">
                  <v-text-field
                  prefix="FDR ≤"
                  v-model="fdr"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  hide-details
                ></v-text-field>
                </td>
            </tr>
            <tr></tr>
          </template>
          <v-data-footer
            :next-icon="mdiChevronRight"
            :prev-icon="mdiChevronLeft"
          ></v-data-footer>
        </v-data-table>
      </v-card-text>
    </v-card>
    <SecondaryPathwaysForm
      v-if="showSecondarySearchForm"
      :errors="secondarySearchErrors"
      :initialDescs="currentSecondarySearchDescs"
      :darkmode="darkmode"
      @searchSecondaryPathways="searchSecondaryPathways"
      @closeForm="closeIndividualSources"
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
    prd: 0.90,
    currentPRD: 0.9,
    secondarySearch: "",
    secondarySearchErrors: [],
    currentSecondarySearchDescs: [],
    secondaryPathwaysLoading: false,
    showSecondarySearchForm: false
  }),
  watch: {
    term() {
      this.secondaryPathways = [];
      this.fdr = 1.0;
      this.prd = 0.9;
      this.secondarySearch = "";
      this.secondarySearchErrors = [];
      this.currentSecondarySearchDescs = [];
      this.showSecondarySearchForm = false;
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
      this.showSecondarySearchForm = false
      this.secondarySearchErrors = [];
      this.secondaryPathways = [];
      try {
        this.secondaryPathways = await PairwiseService.loadCombinedScores({
          term: this.term,
          prd: this.prd,
        });
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
      this.showSecondarySearchForm = false;
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
        if (this.secondaryPathways.length === 0) {
        this.secondaryPathwaysError();
      }
      } catch (err) {
        this.secondaryPathwaysLoading = false;
        this.secondaryPathwaysError();
      }

      this.secondaryPathwaysLoading = false;
    },
    secondaryPathwaysError() {
      this.currentSecondarySearchDescs = [];
      this.secondarySearchErrors.push(
        "No pathways for this selection. Please try another."
      );
    },
    updatePRD() {
      if(this.prd === this.currentPRD) return;
      this.currentPRD = this.prd;
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
    openInteractorSearchForm() {
      this.currentSecondarySearchDescs = [];
      this.showSecondarySearchForm = true;
    },
    closeIndividualSources() {
      this.showSecondarySearchForm = false;
      this.currentSecondarySearchDescs = [];
      this.loadCombinedScores();
    },
  },
};
</script>

<style scoped>
@import "../../../../node_modules/vuetify/dist/vuetify.min.css";
</style>
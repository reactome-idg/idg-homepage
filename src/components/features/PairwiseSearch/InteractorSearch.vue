<template :dark="darkmode">
  <v-container fluid>
    <div class="text-left">
      <span class="larger">{{ title }}</span>
      <small class="pl-2">{{ subtitle }}</small>
      <small class="pl-2">{{ relationshipTypesString }}</small>
    </div>
    <v-card
      :dark="darkmode"
      v-if="!showSecondarySearchForm"
      outlined
      class="text-left justify-left"
    >
      <div
        v-if="
          currentSecondarySearchDescs.dataDescriptions &&
          currentSecondarySearchDescs.dataDescriptions.length > 0
        "
      >
        <v-btn icon class="mx-1" @click="closeIndividualSources">
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
      </div>
      <div v-else>
        <v-row no-gutters class="pl-5 pr-5">
          <v-col cols="12" md="9">
            <FuncInteractionScoreFilter
              :interactingGenes="interactingGenes"
              :errors="FuncInteractionScoreFilterErrors"
              @updatePRD="updatePRD"
            />
          </v-col>
          <v-col cols="12" md="3" align-self="center">
            <SecondaryPathwaysForm
              :errors="secondarySearchErrors"
              :initialDescs="currentSecondarySearchDescs.dataDescriptions"
              :darkmode="darkmode"
              @searchSecondaryPathways="searchSecondaryPathways"
            />
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
              <TableDetails v-if="item.details" :details="item.details" :urlFlagSuffix="getURLFlagSuffix"/>
              <v-progress-circular
                v-else
                indeterminate
                color="primary"
              ></v-progress-circular>
            </td>
          </template>
          <template v-slot:body.append>
            <tr>
              <td colspan="2">
                <v-text-field
                  v-if="!hideSecondaryPagination"
                  v-model="secondarySearch"
                  label="Search"
                  hide-details
                ></v-text-field>
              </td>
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
          >
          </v-data-footer>
        </v-data-table>
        <a :href="getOverViewLink"
          ><v-btn class="ma-2" small>Open Pathway Overview</v-btn></a
        >
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import PairwiseService from "../../../service/PairwiseService";
import ReactomeService from "../../../service/ReactomeService";
import SecondaryPathwaysForm from "./SecondaryPathwaysForm";
import FuncInteractionScoreFilter from "./FuncInteractionScoreFilter";
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
    FuncInteractionScoreFilter,
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
    interactingGenes: null,
    fdr: 1.0,
    currentPRD: 0.9,
    secondarySearch: "",
    secondarySearchErrors: [],
    currentSecondarySearchDescs: [],
    secondaryPathwaysLoading: false,
    showSecondarySearchForm: false,
    FuncInteractionScoreFilterErrors:""
  }),
  watch: {
    term() {
      this.secondaryPathways = [];
      this.interactingGenes = null;
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
    relationshipTypesString() {
      return this.currentSecondarySearchDescs.dataDescriptions
        ? this.currentSecondarySearchDescs.dataDescriptions.join(", ")
        : "";
    },
    getOverViewLink() {
      return `${this.browserLink}${this.getURLFlagSuffix}`; 
    },
    getURLFlagSuffix() {
      var descKeys = [];
      if (
        this.currentSecondarySearchDescs.digitalKeys &&
        this.currentSecondarySearchDescs.digitalKeys.length > 0
      ) {
        descKeys = this.currentSecondarySearchDescs.digitalKeys;
        return `FLG=${
          this.term
        }&FLGINT&DSKEYS=${descKeys.join(",")}&FLGFDR=${this.fdr}`;
      } else {
        return `FLG=${this.term}&FLGINT&DSKEYS=0&SIGCUTOFF=${this.currentPRD}&FLGFDR=${this.fdr}`;
      }
    }
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
    async loadCombinedScores(prd) {
      this.prd = prd;
      this.secondaryPathwaysLoading = true;
      this.showSecondarySearchForm = false;
      this.secondarySearchErrors = [];
      this.FuncInteractionScoreFilterErrors = ""
      try {
        this.loadInteractingGenes();
          this.secondaryPathways = await PairwiseService.loadCombinedScores({
            term: this.term,
            prd: this.currentPRD,
          });
          if (this.secondaryPathways.length === 0)
            this.secondaryPathwaysError();
      } catch (err) {
        this.secondaryPathwaysLoading = false;
        this.secondaryPathwaysError();
      }
      this.secondaryPathwaysLoading = false;
    },
    async loadInteractingGenes() {
      try {
        this.interactingGenes = await PairwiseService.getInteractorScoresForTerm(
          this.term
        );
      } catch (err) {
        this.interactingGenes = [];
        console.log(err);
      }
    },
    async searchSecondaryPathways(dataDescriptions) {
      this.secondaryPathwaysLoading = true;
      this.showSecondarySearchForm = false;
      this.secondarySearchErrors = [];
      this.secondaryPathways = [];
      this.currentSecondarySearchDescs = dataDescriptions;
      try {
        this.secondaryPathways = await PairwiseService.searchTermSecondaryPathways(
          {
            term: this.term,
            dataDescKeys: dataDescriptions.digitalKeys,
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
      if(this.currentSecondarySearchDescs.length === 0) {
        this.FuncInteractionScoreFilterErrors = "No pathways. Try a lower score."
      }
    },
    updatePRD(prd) {
      if (prd === this.currentPRD) return;
      this.currentPRD = prd;
      this.fdrDialog = false;
      this.loadCombinedScores();
    },
    getSecondaryLink(stId) {
      return `${this.browserLink}${stId}&${this.getURLFlagSuffix}`
    },
    openInteractorSearchForm() {
      this.showSecondarySearchForm = true;
    },
    closeIndividualSources() {
      this.currentSecondarySearchDescs = [];
      this.loadCombinedScores();
    },
  },
};
</script>

<style scoped>
@import "../../../../node_modules/vuetify/dist/vuetify.min.css";
a {
  text-decoration: none;
}
</style>
<template :dark="darkmode">
  <div >
    <div class="text-left">
      <span class="larger">{{ title }}</span>
      <small class="pl-2">{{ subtitle }}</small>
      <small class="pl-2">{{ relationshipTypesString }}</small>
    </div>
    <v-card :dark="darkmode" outlined class="text-left justify-left">
      <!-- <PathwayGeneSimilarity class="pgs"/> -->
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
        <div class="flex pa-4" style="display: flex; flex-wrap: wrap-reverse;
                                      justify-content: space-between;
                                      align-items: center;">
          <div >
            <FuncInteractionScoreFilter
              :term="term"
              :interactingGenes="interactingGenes"
              :prd="currentPRD"
              @updatePRD="updatePRD"
              class="max"
            />
          </div>
          <div>
            <v-checkbox
              v-if="this.secondaryPathways.some((pw) => pw.isAnnotated === true)"
              v-model="showAnnotatedPathwaysInput"
              :off-icon="mdiCheckboxBlankOutline"
              :on-icon="mdiCheckboxMarkedOutline"
              :label="`Include ${term}'s annotated pathways`"
              color="var(--idg-alt-blue, #4AABCA)"
            ></v-checkbox>
          </div>
          <div>
            <v-btn
              color="var(--idg-alt-dark-blue, #477F9C)"
              :dark="darkmode"
              @click="showSecondarySearchForm = true"
              class="btn-primary"
              >Choose Sources</v-btn
            >
          </div>
          <div>
            <a
              v-if="secondaryPathways.length > 0"
              :href="getOverViewLink"
              :target="linkTarget"
              style="text-decoration: none;"
              ><v-btn color="var(--idg-dark-blue, #183C65)" class="ma-2 white--text"
                >Open Pathway Overview</v-btn
              ></a
            >
          </div>
        </div>
      </div>
      <v-card-text class="interactingPathwaysCard">
        <v-data-table
          v-if="secondaryPathways.length > 0"
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
          no-results-text="No pathways. Try a higher FDR"
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
              <TableDetails
                v-if="item.details"
                :details="item.details"
                :urlFlagSuffix="getURLFlagSuffix"
              />
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
              <td colspan="2">
                <v-btn small color="var(--idg-orange, #F98419)"
                @click="downloadTable">Download Pathway List</v-btn>
              </td>
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
        <p v-else class="errorMessage">{{ noSecondaryPathwaysText }}</p>
      </v-card-text>
      <v-overlay
        absolute
        :value="showSecondarySearchForm"
        :dark="darkmode"
        class="overlay-form"
      >
        <SecondaryPathwaysForm
          :initialDescs="currentSecondarySearchDescs.dataDescriptions"
          :darkmode="darkmode"
          :term="term"
          @searchSecondaryPathways="searchSecondaryPathways"
          @close="showSecondarySearchForm = false"
        />
      </v-overlay>
    </v-card>
  </div>
</template>

<script>
import PairwiseService from "../../../service/PairwiseService";
import ReactomeService from "../../../service/ReactomeService";
import SecondaryPathwaysForm from "./SecondaryPathwaysForm";
import FuncInteractionScoreFilter from "./FuncInteractionScoreFilter";
import TableDetails from "./TableDetails";
// import PathwayGeneSimilarity from "./Cytoscape/PathwayGeneSimilarity.vue"
import {
  VDataTable,
  VCardText,
  VTextField,
  VIcon,
  VCard,
  VProgressCircular,
} from "vuetify/lib";
import vuetify from "../../../plugins/vuetify";
import {
  mdiClose,
  mdiChevronLeft,
  mdiChevronRight,
  mdiChevronDown,
  mdiCheckboxBlankOutline,
  mdiCheckboxMarkedOutline,
} from "@mdi/js";

export default {
  name: "InteractorSearch",
  components: {
    SecondaryPathwaysForm,
    TableDetails,
    VDataTable,
    VCardText,
    VTextField,
    VIcon,
    VCard,
    VProgressCircular,
    FuncInteractionScoreFilter,
    // PathwayGeneSimilarity
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
    mdiCheckboxBlankOutline,
    mdiCheckboxMarkedOutline,
    browserLink: process.env.VUE_APP_BROWSER_LINK,
    linkTarget: process.env.VUE_APP_LINK_TARGET,
    secondaryPathways: [],
    interactingGenes: null,
    fdr: 0.05,
    currentPRD: 0.9,
    secondarySearch: "",
    currentSecondarySearchDescs: [],
    secondaryPathwaysLoading: false,
    showSecondarySearchForm: false,
    showAnnotatedPathwaysInput: true,
    pathwayStIdsForGene: [],
  }),
  watch: {
    term() {
      this.secondaryPathways = [];
      this.interactingGenes = null;
      this.fdr = 1.0;
      this.secondarySearch = "";
      this.currentSecondarySearchDescs = [];
      this.showSecondarySearchForm = false;
      this.showAnnotatedPathwaysInput = true;
      this.pathwayStIdsForGene = [];
      this.getInitialData();
    },
  },
  computed: {
    secondaryHeaders() {
      return [
        { text: "Pathway Stable id", value: "stId" },
        { text: "Pathway Name", value: "name" },
        { text: "pValue", value: "pVal" },
        {
          text: "FDR",
          value: "fdr",
          filter: (value) => {
            if (!this.fdr) return true;
            return value <= this.fdr;
          },
        },
      ];
    },
    filteredSecondaryPathways() {
      if (this.showAnnotatedPathwaysInput) return this.secondaryPathways;
      return this.secondaryPathways.filter((pw) => pw.isAnnotated === false);
    },
    hideSecondaryPagination() {
      return this.secondaryPathways.length < 20;
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
        return `FLG=${this.term}&FLGINT&DSKEYS=${descKeys.join(",")}&FLGFDR=${
          this.fdr
        }`;
      } else {
        return `FLG=${this.term}&FLGINT&DSKEYS=0&SIGCUTOFF=${this.currentPRD}&FLGFDR=${this.fdr}`;
      }
    },
    noSecondaryPathwaysText() {
      if (this.currentSecondarySearchDescs.length === 0 && this.currentPRD === 0)
        return "No enriched pathways available for this term. It is extremely understudied";
      else if(this.currentSecondarySearchDescs.length === 0)
        return "No pathways available. Try a lower Functional Interaction score.";
      else return "No pathways available. Try a different interactor set.";
    },
  },
  created() {
    this.getInitialData();
  },
  methods: {
    async getInitialData() {
      await this.loadPathwaysForGene();
      await this.loadInteractingGenes();

      await this.loadCombinedScores();

      //when loading initial data, always want to start with something loaded
      //if nothing available at PRD 0.9. decrement by 0.1 until something is available.
      while (this.secondaryPathways.length === 0 && this.currentPRD >= 0.1) {
        this.currentPRD = this.currentPRD - 0.1;
        await this.loadCombinedScores();
      }
      if(this.secondaryPathways.length === 0) {
        this.currentPRD = 0;

      }
    },
    async loadPathwaysForGene() {
      try {
        this.pathwayStIdsForGene = await PairwiseService.loadPathwayStIdsForTerm(
          this.term
        );
      } catch (err) {
        console.log(err);
      }
    },
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
    async loadCombinedScores() {
      this.secondaryPathwaysLoading = true;
      this.showSecondarySearchForm = false;
      this.FuncInteractionScoreFilterErrors = "";

      try {
        this.secondaryPathways = await PairwiseService.loadCombinedScores({
          term: this.term,
          prd: this.currentPRD,
        });
        this.addIsAnnotatedToPathways();
        if (this.secondaryPathways.length === 0) this.secondaryPathwaysError();
      } catch (err) {
        this.secondaryPathwaysLoading = false;
        this.secondaryPathwaysError();
      }
      this.secondaryPathwaysLoading = false;
    },
    async searchSecondaryPathways(dataDescriptions) {
      this.secondaryPathwaysLoading = true;
      this.showSecondarySearchForm = false;
      this.secondaryPathways = [];
      this.currentSecondarySearchDescs = dataDescriptions;
      try {
        this.secondaryPathways = await PairwiseService.searchTermSecondaryPathways(
          {
            term: this.term,
            dataDescKeys: dataDescriptions.digitalKeys,
          }
        );
        this.addIsAnnotatedToPathways();
        if (this.secondaryPathways.length === 0) {
          this.secondaryPathwaysError();
        }
      } catch (err) {
        this.secondaryPathwaysLoading = false;
        this.secondaryPathwaysError();
      }

      this.secondaryPathwaysLoading = false;
    },
    addIsAnnotatedToPathways() {
      this.secondaryPathways.forEach((pathway) => {
        pathway.isAnnotated = this.pathwayStIdsForGene.includes(pathway.stId);
      });
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
    secondaryPathwaysError() {
      this.currentSecondarySearchDescs = [];
    },
    updatePRD(prd) {
      if (prd === this.currentPRD) return;
      this.currentPRD = prd;
      this.loadCombinedScores();
    },
    getSecondaryLink(stId) {
      return `${this.browserLink}${stId}&${this.getURLFlagSuffix}`;
    },
    openInteractorSearchForm() {
      this.showSecondarySearchForm = true;
    },
    closeIndividualSources() {
      this.currentSecondarySearchDescs = [];
      this.loadCombinedScores();
    },
    downloadTable(){
      let str = "Stable_ID,Pathway_Name,pValue,FDR\n";
      this.filteredSecondaryPathways.forEach((pathway) => {
        str += `${pathway.stId},${pathway.name},${pathway.pVal},${pathway.fdr}\n`
      })
      const blob = new Blob([str], {type:"blob"});
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `PathwaysFor${this.term}.csv`;
      link.click();
    }
  },
};
</script>

<style scoped>
@import "../../../../node_modules/vuetify/dist/vuetify.min.css";
:root {
  /* idg colors */
  --idg-dark-blue:#183C65;
  --idg-corporate-blue: #0D5184;
  --idg-medium-blue: #5E8BAD;
  --idg-light-blue: #AEC5D6;
  /* idg alt colors */
  --idg-alt-blue: #4AABCA;
  --idg-alt-dark-blue: #477F9C;
  --idg-alt-light-blue: #ABE7F4;
  /* idg CTA colors */
  --idg-orange: #F98419;
  --idg-dark-orange: #A06529;
  --idg-light-orange: #F2C09E;
  /* misc. colors */
  --idg-red: #EA3B65;
  --idg-hyperlink-color: #509DBE;
}
.flex{
  display: flex;
  flex-wrap: wrap-reverse;
  justify-content: space-between;
  align-items: center;
}
.btn-primary{
  color: white;
}
a {
  text-decoration: none;
  color: var(--idg-hyperlink-color, #509DBE) !important;
}
a:hover {
  color: var(--idg-alt-dark-blue, #183C65) !important;
}
.interactingPathwaysCard {
  min-height: 300px;
}
.overlay-form {
  padding: 0 10%;
}
.d-none {
  display: none !important;
}
.errorMessage {
  color: var(--idg-red, #EA3B65);
  text-align: center;
}
.pgs{
  height: 100px;
  width: 80%;
  border: 1px solid lightgray;
  margin: 1rem auto;
}
.max{
  width: 25%;
}
</style>
<style src="vuetify/dist/vuetify.min.css"></style>
<template>
<v-container fluid>
  <v-card outlined v-if="primaryPathways === null">
    <v-card-text>
      <LoadingCircularProgress />
    </v-card-text>
    </v-card>
    <v-container fluid v-else>
      <v-container
        fluid
        v-if="primaryPathways.hierarchy && primaryPathways.hierarchy.length > 0"
      >
        <div class="text-left">
          <span class="text-left">Annotated Pathways</span>
          <small class="pl-2">Reactome annotated</small>
        </div>
        <v-card outlined class="mb-5 text-left">
          <v-treeview dense :items="primaryPathways.hierarchy">
            <template v-slot:label="{ item }">
              <a
                v-if="item.type === 'TopLevelPathway'"
                style="font-size: larger"
                :href="getPrimaryLink(item.stId)"
                class="link"
                >{{ item.name }}</a
              >
              <a
                v-else-if="!item.children || item.children.length === 0"
                style="font-weight: bolder; text-decoration: underline"
                :href="getPrimaryLink(item.stId)"
                class="link"
                >{{ item.name }}</a
              >
              <a v-else :href="getPrimaryLink(item.stId)" class="link">{{
                item.name
              }}</a>
            </template>
          </v-treeview>
        </v-card>
      </v-container>
      <p v-else>No primary pathways found.</p>
    </v-container>
  </v-container>
</template>

<script>
import PairwiseService from "../../../service/PairwiseService";
import ReactomeService from "../../../service/ReactomeService";
import LoadingCircularProgress from "../../layout/LoadingCircularProgress";
import vuetify from "../../../plugins/vuetify";
import {VContainer, VCard, VCardText, VTreeview} from "vuetify/lib";

export default {
  name: "GeneToPathwayResult",
  vuetify,
  components: {
    LoadingCircularProgress,
    VContainer, VCard, VCardText, VTreeview,
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
    primaryPathways: [],
    secondaryPathways: [],
    fdr: 1.0,
    fdrInput: "1.00",
    secondarySearch: "",
    secondarySearchErrors: [],
    currentSecondarySearchDescs: [],
    secondaryPathwaysLoading: false,
    loadingPrimary: false,
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
  watch:{
    term() {
      this.loadPrimaryPathways();
    }
  },
  created() {
    this.loadPrimaryPathways();
  },
  methods: {
    async loadPrimaryPathways() {
      this.loadingPrimary = true;
      if (!this.uniprotBoolean) {
        try {
          this.primaryPathways = await PairwiseService.searchGeneNameHierarchy(
            this.term.toUpperCase()
          );
        } catch (err) {
          this.error = err.message;
          if (err.response.status == 404) {
            this.error =
              "No recorded gene. Please use standard human gene symbol.";
          }
        }
      } else {
        try {
          this.primaryPathways = await PairwiseService.searchUniprotHierarchy(
            this.term.toUpperCase()
          );
        } catch (err) {
          this.error = err.message;
          if (err.response.status == 404) {
            this.error = "No recorded uniprot";
          }
        }
      }
      this.loadingPrimary = false;
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
    async searchSecondaryPathways(dataDescs) {
      this.secondaryPathwaysLoading = true;
      this.secondarySearchErrors = [];
      this.currentSecondarySearchDescs = dataDescs;
      if (!this.uniprot) {
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
    getPrimaryLink(stId) {
      return `${this.browserLink}${stId}&FLG=${this.primaryPathways.gene}`;
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
  },
};
</script>

<style scoped>
@import '../../../../node_modules/vuetify/dist/vuetify.min.css';
@import 'https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css';
@import 'https://fonts.googleapis.com/css?family=Comfortaa&display=swap';
* {
  font-family: Comfortaa, curisve;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: Comfortaa, curisve;
  line-height: 1.4;
}
.headerLink {
  text-decoration: none;
  font-weight: bold;
  font-size: larger;
  color: white;
}
.headerLink:hover {
  color: lightgrey;
}
.headerLink:active:hover {
  color: grey;
}
.link {
  text-decoration: none;
  color: white;
}
.link:hover {
  color: lightgrey;
}
.link:active:hover {
  color: grey;
}
</style>
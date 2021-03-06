<template :dark="darkmode">
  <div>
    <v-card :dark="darkmode" outlined v-if="loadingPrimary">
      <v-card-text>
        <LoadingCircularProgress />
      </v-card-text>
    </v-card>
    <div
      
      v-if="
        (primaryPathways.hierarchy && primaryPathways.hierarchy.length > 0) || loadingPrimary"
    >
      <div class="text-left">
        <span class="larger">{{ title }}</span>
        <small class="pl-2">{{ subtitle }}</small>
      </div>
      <v-card outlined :dark="darkmode" class="text-left annotaedPathwaysCard">
        <v-treeview
          v-if="primaryPathways.hierarchy && primaryPathways.hierarchy.length > 0"
          dense
          open-all
          :items="primaryPathways.hierarchy"
          :expand-icon="mdiChevronDown"
          transition
        >
          <template v-slot:label="{ item }">
            <a
              :href="getPrimaryLink(item.stId)"
              :class="darkmode === true ? 'linkDark' : 'link'"
              :target="linkTarget"
              >{{ item.name }}</a
            >
          </template>
        </v-treeview>
      </v-card>
    </div>
    <p v-else>No annotated pathways found.</p>
  </div>
</template>

<script>
import PairwiseService from "../../../service/PairwiseService";
import LoadingCircularProgress from "../../layout/LoadingCircularProgress";
import { VCard, VCardText, VTreeview } from "vuetify/lib";
import vuetify from "../../../plugins/vuetify";
import { mdiChevronDown } from "@mdi/js";

export default {
  name: "GeneToPathwayResult",
  vuetify,
  components: {
    LoadingCircularProgress,
    VCard,
    VCardText,
    VTreeview,
  },
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
      default: () => "Annotated Pathways",
    },
    subtitle: {
      type: String,
      default: () => "Manually curated based on literature references",
    },
  },
  data: () => ({
    mdiChevronDown,
    browserLink: process.env.VUE_APP_BROWSER_LINK,
    linkTarget: process.env.VUE_APP_LINK_TARGET,
    primaryPathways: [],
    secondaryPathways: [],
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
  watch: {
    term() {
      this.loadPrimaryPathways();
    },
  },
  created() {
    this.loadPrimaryPathways();
  },
  methods: {
    async loadPrimaryPathways() {
      //do nothing if term is null or empty
      if (!this.term || this.term === "") return;

      this.loadingPrimary = true;
      this.primaryPathways = [];

      try {
        this.primaryPathways = await PairwiseService.searchHierarchyForTerm(
          this.term.toUpperCase()
        );
      } catch (err) {
        this.loadingPrimary = false;
        this.error = err.message;
        if(!this.err.response) this.error = "Internal Server Error. We are working to correct this.";
        else if (err.response.status == 404) {
          this.error = "No recorded term. Please try another.";
        }
      }

      this.loadingPrimary = false;
    },
    getPrimaryLink(stId) {
      return `${this.browserLink}${stId}&FLG=${this.primaryPathways.gene}`;
    },
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
.linkDark {
  text-decoration: none;
  color: white !important;
}
.linkDark:active:hover {
  color: var(--idg-alt-light-blue) !important;
}
.link {
  text-decoration: none;
  color: var(--idg-hyperlink-color) !important;
}
.link:hover {
  color: var(--idg-alt-dark-blue) !important;
}
.annotaedPathwaysCard {
  max-height: 385px;
  overflow: scroll;
}
</style>
<template :dark="darkmode">
  <div>
    <v-card :dark="darkmode" outlined v-if="loadingPrimary">
      <v-card-text>
        <LoadingCircularProgress />
      </v-card-text>
    </v-card>
    <v-container
      fluid
      v-if="
        (primaryPathways.hierarchy && primaryPathways.hierarchy.length > 0)"
    >
      <div class="text-left">
        <span class="larger">{{ title }}</span>
        <small class="pl-2">{{ subtitle }}</small>
      </div>
      <v-card outlined :dark="darkmode" class="text-left">
        <v-treeview
          dense
          :items="primaryPathways.hierarchy"
          :expand-icon="mdiChevronDown"
          transition
        >
          <template v-slot:label="{ item }">
            <a
              v-if="item.type === 'TopLevelPathway'"
              :class="darkmode === true ? 'linkDark' : 'link'"
              :href="getPrimaryLink(item.stId)"
              :target="linkTarget"
              >{{ item.name }}</a
            >
            <a
              v-else-if="!item.children || item.children.length === 0"
              :class="darkmode === true ? 'linkDark' : 'link'"
              :href="getPrimaryLink(item.stId)"
              :target="linkTarget"
              >{{ item.name }}</a
            >
            <a
              v-else
              :href="getPrimaryLink(item.stId)"
              :class="darkmode === true ? 'linkDark' : 'link'"
              :target="linkTarget"
              >{{ item.name }}</a
            >
          </template>
        </v-treeview>
      </v-card>
    </v-container>
    <p v-else>No primary pathways found.</p>
  </div>
</template>

<script>
import PairwiseService from "../../../service/PairwiseService";
import LoadingCircularProgress from "../../layout/LoadingCircularProgress";
import { VContainer, VCard, VCardText, VTreeview } from "vuetify/lib";
import vuetify from "../../../plugins/vuetify";
import { mdiChevronDown } from "@mdi/js";

export default {
  name: "GeneToPathwayResult",
  vuetify,
  components: {
    LoadingCircularProgress,
    VContainer,
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
.linkDark {
  text-decoration: none;
  /* color: white; */
}
.linkDark:active:hover {
  color: grey;
}
.link {
  text-decoration: none;
  /* color: black; */
}
</style>
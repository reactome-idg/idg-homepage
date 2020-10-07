<template>
  <v-container fluid>
    <v-card outlined v-if="loadingPrimary">
      <v-card-text>
        <LoadingCircularProgress />
      </v-card-text>
    </v-card>
    <v-container
      fluid
      v-if="primaryPathways.hierarchy && primaryPathways.hierarchy.length > 0"
      class="mb-5"
    >
      <div class="text-left">
        <span class="text-left">Annotated Pathways</span>
        <small class="paddingL">Reactome annotated</small>
      </div>
      <v-card outlined :dark="darkMode" class="text-left">
        <v-treeview
          dense
          :items="primaryPathways.hierarchy"
          :expand-icon="mdiChevronDown"
          transition
        >
          <template v-slot:label="{ item }">
            <a
              v-if="item.type === 'TopLevelPathway'"
              style="font-size: larger"
              :href="getPrimaryLink(item.stId)"
              :class="darkMode === true ? 'linkDark' : 'link'"
              >{{ item.name }}</a
            >
            <a
              v-else-if="!item.children || item.children.length === 0"
              style="font-weight: bolder; text-decoration: underline"
              :href="getPrimaryLink(item.stId)"
              :class="darkMode === true ? 'linkDark' : 'link'"
              >{{ item.name }}</a
            >
            <a
              v-else
              :href="getPrimaryLink(item.stId)"
              :class="darkMode === true ? 'linkDark' : 'link'"
              >{{ item.name }}</a
            >
          </template>
        </v-treeview>
      </v-card>
    </v-container>
    <p v-else>No primary pathways found.</p>
  </v-container>
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
    darkMode: {
      type: Boolean,
      default: () => true,
    },
  },
  data: () => ({
    mdiChevronDown,
    browserLink: "/PathwayBrowser/#/",
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

      try {
        this.primaryPathways = await PairwiseService.searchHierarchyForTerm(
          this.term.toUpperCase()
        );
      } catch (err) {
        this.loadingPrimary = false;
        this.error = err.message;
        if (err.response.status == 404) {
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
@import "https://fonts.googleapis.com/css?family=Comfortaa&display=swap";
* {
  font-family: Comfortaa, curisve;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  background-color: transparent;
}
.linkDark {
  text-decoration: none;
  color: white;
}
.linkDark:hover {
  color: lightgrey;
}
.linkDark:active:hover {
  color: grey;
}
.link {
  text-decoration: none;
  color: black;
}
.link:hover {
  color: grey;
}
.link:active:hover {
  color: lightgrey;
}
.paddingL {
  padding-left: 1em;
}
</style>
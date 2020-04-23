<template>
  <div>
    <v-container class="searchContainer" fluid>
      <ProteinSearchForm v-on:search-protein="searchFormSubmit" />
    </v-container>
    <v-container mb-5>
      <h2 class="text-left">Showing results for {{proteinName}}</h2>
      <PathwayList v-bind:pathways="pathways" />
    </v-container>
  </div>
</template>

<script>
import ProteinSearchForm from "../components/features/Forms/ProteinSearchForm";
import PathwayList from "../components/features/pathwaySearch/PathwayList";
import router from "@/router/index.js";

export default {
  name: "PathwaySearch",
  components: {
    ProteinSearchForm,
    PathwayList,
  },
  data() {
    return {
      proteinName: "",
      pathways: {}
    };
  },
  created() {
    const proteinName = this.$route.params.proteinName;
    this.searchProtein(proteinName);
  },
  methods: {
    searchProtein(proteinName) {
      fetch(`http://localhost:8085/pathways/${proteinName}`)
        .then(result => {
          return result.json();
        })
        .then(pathways => {
          this.pathways = pathways;
          this.proteinName = proteinName;
        })
        .catch(err => console.log(err));
    },
    searchFormSubmit(proteinName) {
      router.push({
        name: "PathwaySearch",
        params: { proteinName: proteinName }
      });
      this.searchProtein(proteinName);
    }
  }
};
</script>

<style scoped>
.searchContainer {
  background-color: #e0e0e0;
}

.no-decorators {
  text-decoration: none;
}
.pathwayLink {
  text-decoration: none;
  color: blue;
}
.pathwayLink:hover {
  color: black;
}
.label {
  font-weight: bold;
}
.small-text {
  font-size: small;
}
</style>
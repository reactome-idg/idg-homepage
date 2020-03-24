<template>
  <v-container class="searchContainer" fluid >
    <ProteinSearchForm v-on:search-protein="searchFormSubmit" />
  </v-container>
  
</template>

<script>
import ProteinSearchForm from "../components/features/Forms/ProteinSearchForm";
import router from "@/router/index.js";

export default {
  name: "PathwaySearch",
  components: {
    ProteinSearchForm
  },
  data() {
    return {
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
        })
        .catch(err => console.log(err));
    },
    searchFormSubmit(proteinName) {
      router.push({
        name: "SearchPathway",
        params: { proteinName: proteinName }
      });
      this.searchProtein(proteinName);
    }
  }
};
</script>

<style scoped>

.searchContainer{
background-color: #f0f0f0;
}

</style>
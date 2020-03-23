<template>
  <v-container fluid>
      <ProteinSearchForm v-on:search-protein="searchProtein"  />
  </v-container>
</template>

<script>
import ProteinSearchForm from "../components/features/Forms/ProteinSearchForm";

export default {
    name: "PathwaySearch",
    componenets: {
        ProteinSearchForm
    },
    data(){
        return {
            pathways: {}
        }
    },
    create(){
        const proteinName = this.$route.params.proteinName;
        this.searchProtein(proteinName);
    },
    methods: {
        searchProtein(proteinName){
            const url = `http://localhost:8085/pathways/${proteinName}`;
            fetch(url).then(result => {
                return result.json();
            })
            .then(pathways => {
                this.pathways = pathways;
            })
            .catch(err => console.log(err));
        }
    }
}
</script>

<style scoped>

</style>
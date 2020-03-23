<template>
  <div>
    <ProteinSearchForm v-on:search-protein="searchFormSubmit" />
    <p>Displaying Search Results for:</p>
    <p>{{response}}</p>
  </div>
</template>

<script>
import ProteinSearchForm from "../components/features/Forms/ProteinSearchForm";
import router from "@/router/index.js";

export default {
  name: "ProteinDetailsView",
  components: {
    ProteinSearchForm
  },
  data() {
    return {
      protein_name: "",
      response: ""
    };
  },
  created() {
    const protein_name = this.$route.params.protein_name;
    this.searchProtein(protein_name);
  },
  methods: {
    searchProtein(proteinName) {
      fetch(`http://localhost:8085/protein-detail/${proteinName}`)
        .then(res => {
          return res.text();
        })
        .then(data => {
          this.response = data;
        })
        .catch(err => console.log(err));
    },
    searchFormSubmit(proteinName) {
      router.push({
        name: "ProteinDetailsView",
        params: { protein_name: proteinName }
      });
      this.searchProtein(proteinName);
    }
  }
};
</script>

<style scoped>
</style>
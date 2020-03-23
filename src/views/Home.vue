<template>
  <div>
    <ProteinSearchForm v-on:search-protein="searchProtein" />
  </div>
</template>

<script>
// @ is an alias to /src
import ProteinSearchForm from "../components/features/Forms/ProteinSearchForm";
import router from "@/router/index.js";

export default {
  name: "Home",
  components: {
    ProteinSearchForm
  },
  methods: {
    searchProtein(proteinName) {
      router.push({
        name: "ProteinDetailsView",
        params: { protein_name: proteinName }
      });
    }
  }
};
</script>

<style scoped>

</style>
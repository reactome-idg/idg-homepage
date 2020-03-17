<template>
  <div class="home">
    <ProteinSearchForm />
    
  </div>
</template>

<script>
// @ is an alias to /src
import ProteinSearchForm from "../components/features/Forms/ProteinSearchForm";

export default {
  name: "Home",
  components: {
    ProteinSearchForm
  },
  data() {
    return {
      title: ""
    };
  }
};
</script>

<style scoped>

</style>
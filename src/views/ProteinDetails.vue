<template>
  <div>
      <ProteinSearchForm />
    <p>Displaying Search Results for:</p>
    <p>{{response}}</p>
  </div>
</template>

<script>
import ProteinSearchForm from '../components/features/Forms/ProteinSearchForm';

export default {
  name: "ProteinDetail",
  components:{
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
    fetch(`http://localhost:8085/protein-detail/${protein_name}`)
      .then(res => {
        return res.text();
      })
      .then(data => {
        this.response = data;
      })
      .catch(err => console.log(err));
  }
};
</script>

<style scoped>
</style>
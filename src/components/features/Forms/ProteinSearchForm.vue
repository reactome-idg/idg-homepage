<template>
  <div class="container">
    <form @submit="searchProtein">
      <h2>Search Reactome:</h2>
      <input
        type="text"
        v-model="protein"
        class="protein-search-box"
        placeholder="Enter a Protein..."
      />
      <input class="btn" type="submit" value="Go!" />
    </form>
  </div>
</template>

<script>
import router from '@/router/index.js';
export default {
  name: "ProteinSearchForm",
  data() {
    return {
      protein: ""
    };
  },
  methods: {
    searchProtein(e) {
      e.preventDefault();
      const protein = this.protein;
      router.push({name:'ProteinDetail', params: {protein_name:protein}})
      this.protein = "";
    }
  }
};
</script>

<style>
.container {
  padding: 5em;
  margin: 0;
  background-color: #f0f0f0;
  width: 100%;
  text-align: center;
}
.protein-search-box {
  font-size: medium;
  padding: 5px 10px;
  width: 50%;
  margin: 0.5em 0;
}
.btn {
  font-size: medium;
  display: inline-block;
  border: none;
  background: #4287f5;
  color: #fff;
  cursor: pointer;
  padding: 5px 10px;
}
.btn:hover {
  background-color: #3a79de;
}

.btn:active:hover {
  background-color: #3269c2;
}

input[type="text"],
text {
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  outline: none;
  padding: 3px 0px 3px 3px;
  margin: 5px 1px 3px 0px;
  border: 1px solid #dddddd;
}

input[type="text"]:focus,
text:focus {
  box-shadow: 0 0 5px rgba(81, 203, 238, 1);
  padding: 3px 0px 3px 3px;
  margin: 5px 1px 3px 0px;
  border: 1px solid rgba(81, 203, 238, 1);
}
</style>
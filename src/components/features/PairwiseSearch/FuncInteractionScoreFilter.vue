<template>
  <v-row no-gutters class="pl-5 pr-5">
    <v-col cols="9">
      <v-text-field
        prefix="Functional Interaction Score ≥"
        v-model="prd"
        @keyup.enter="updatePRD"
        hide-details
        type="number"
        min="0"
        max="1"
        step="0.1"
        :suffix="numberOfGenesLabel"
      ></v-text-field>
      <p style="color:red;">{{errors}} {{error}}</p>
    </v-col>
    <v-col cols="3" align-self="center">
      <v-btn class="ml-2" small @click="updatePRD">UPDATE</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "FuncInteractionScoreFilter",
  props: {
    interactingGenes: {
      type: Array,
      default: () => [],
    },
    errors: {
      type: String,
      default: () => ""
    }
  },
  data: () => ({
    prd: 0.9,
    error: ""
  }),
  computed: {
      numberOfGenes() {
          return this.interactingGenes !== null &&
           this.interactingGenes.filter(({score}) => score>= this.prd).length
      },
      numberOfGenesLabel() {
        if(!this.interactingGenes) return "Loading...";
        return this.numberOfGenes + " genes";
      }
  },
  methods: {
      updatePRD() {
        if(this.numberOfGenes > 0){
          this.error = "";
          this.$emit('updatePRD', this.prd);
        }
        else{
            this.error = "Please choose a cutoff with at least 1 gene";
        }
      }
  }
};
</script>

<style scoped>
</style>
<template>
  <v-row no-gutters class="">
    <v-col cols="9">
      <v-text-field
        id="prdInputBox"
        prefix="Functional Interaction Score ≥"
        v-model="prdInput"
        @keyup.enter="updatePRD"
        hide-details
        type="number"
        min="0"
        max="1"
        step="0.1"
      ></v-text-field>
      {{numberOfGenesLabel}}
      <span style="color:red;"> {{errors}} {{error}}</span>
    </v-col>
    <v-col cols="3" align-self="center" justify="center">
      <v-btn color="var(--secondary-color)" class="ml-2" small @click="updatePRD">UPDATE</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "FuncInteractionScoreFilter",
  props: {
    term: {
      type: String,
      default: () => null
    },
    interactingGenes: {
      type: Array,
      default: () => [],
    },
    errors: {
      type: String,
      default: () => ""
    },
    prd: {
      type: Number,
      default: () => .9
    }
  },
  data: () => ({
    prdInput: 0.9,
    error: "",
  }),
  created() {
    this.prdInput = this.prd
  },
  watch: {
    prd(newVal, oldVal) {
      if(newVal === oldVal) return;
      this.prdInput = this.prd
    }
  },
  computed: {
      numberOfGenes() {
          return this.interactingGenes !== null &&
           this.interactingGenes.filter(({score}) => score>= this.prdInput).length
      },
      numberOfGenesLabel() {
        if(!this.interactingGenes) return "Loading...";
        if(window.innerWidth < 1190) return (this.numberOfGenes + " gene" + (this.numberOfGenes === 1 ? "":"s"));
        return this.numberOfGenes + " genes interacting" + (this.term ? ` with ${this.term}` : '');
      },
  },
  methods: {
      updatePRD() {
        if(this.numberOfGenes > 0){
          this.error = "";
          this.$emit('updatePRD', parseFloat(this.prdInput));
        }
        else{
            this.error = "Please choose a cutoff with at least 1 gene";
        }
      },
  }
};
</script>

<style scoped>
</style>
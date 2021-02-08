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
        :suffix="numberOfGenes"
      ></v-text-field>
    </v-col>
    <v-col cols="3" align-self="end">
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
  },
  data: () => ({
    prd: 0.9,
  }),
  computed: {
      numberOfGenes() {
          return this.interactingGenes !== null ?
           this.interactingGenes.filter(({score}) => score>= this.prd).length + " genes" :
           "Loading..."
      }
  },
  methods: {
      updatePRD() {
          this.$emit('updatePRD', this.prd);
      }
  }
};
</script>

<style scoped>
</style>
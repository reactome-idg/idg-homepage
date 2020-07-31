<template>
  <v-container fluid>
    <v-card outlined>
      <v-card-text>
        <v-row align="center" justify="center">
          <v-col cols="12" md="10">
            <v-combobox
              v-model="relationshipTypes"
              :items="dataDescTypes"
              label="Select sources"
              multiple
              hint="Maximum of 6 sources"
            ></v-combobox>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn color="primary" @click="searchSecondaryPathways">Search</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import PairwiseService from "../../../service/PairwiseService";
export default {
  name: "SecondaryPathwayForm",
  data: () => ({
    dataDescs: [],
    relationshipTypes: [],
  }),
  computed: {
    dataDescTypes() {
      return this.dataDescs.map((desc) => desc.id);
    },
  },
  watch: {
    relationshipTypes(val) {
      if (val.length > 6) this.$nextTick(() => this.relationshipTypes.pop());
    },
  },
  async created() {
    try {
      this.dataDescs = await PairwiseService.getDataDescs();
    } catch (err) {
      this.error = err.message;
    }
  },
  methods: {
    searchSecondaryPathways() {
        this.$emit('searchSecondaryPathways', this.relationshipTypes)
    },
  },
};
</script>

<style scoped>
</style>
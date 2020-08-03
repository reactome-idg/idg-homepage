<template>
  <v-card outlined>
    <v-card-text>
      <h1 class="text-left pb-2">Choose sources</h1>
      <v-card outlined>
        <v-card-text>
          <v-row align="center" justify="center">
            <v-col cols="12" md="6">
              <v-combobox
                v-model="dataType"
                label="Select an interaction type"
                :items="types"
                @change="cascadeDataType"
              ></v-combobox>
            </v-col>
            <v-col cols="12" md="6">
              <v-combobox
                v-model="provenance"
                label="Select an interactor source"
                :items="provenances"
                :disabled="!dataType"
                @change="cascadeProvenance"
              ></v-combobox>
            </v-col>
            <v-col cols="12" md="6">
              <v-combobox
                v-model="bioSource"
                label="Select a biosource"
                :items="bioSources"
                :disabled="!provenance"
                @change="cascadeBioSource"
              ></v-combobox>
            </v-col>
            <v-col cols="12" md="4">
              <v-combobox
                v-if="bioSource && origins.length > 0"
                v-model="origin"
                label="Select an origin"
                :items="origins"
              ></v-combobox>
            </v-col>
            <v-col cols="12" md="2">
              <v-btn small color="secondary" @click="addRelationship">Add</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-row align="center" justify="center">
        <v-col cols="12" md="10">
          <v-chip v-for="(rel, index) in relationshipTypes" :key="index">{{rel}}</v-chip>
        </v-col>
        <v-col cols="12" md="2">
          <v-btn color="primary" @click="searchSecondaryPathways">Search</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="errors">{{errors.join(', ')}}, {{error}}</v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import PairwiseService from "../../../service/PairwiseService";
export default {
  name: "SecondaryPathwayForm",
  props: {
    errors: Array,
    default: () => []
  },
  data: () => ({
    dataDescs: [],
    relationshipTypes: [],
    error: "",
    dataType: null,
    provenance: null,
    bioSource: null,
    origin: null,
  }),
  computed: {
    types() {
      return [...new Set(this.dataDescs.map((desc) => desc.dataType))];
    },
    provenances() {
      return [
        ...new Set(
          this.dataDescs
            .filter((desc) => desc.dataType == this.dataType)
            .map((desc) => desc.provenance)
        ),
      ];
    },
    bioSources() {
      return [
        ...new Set(
          this.dataDescs
            .filter(
              (desc) =>
                desc.provenance == this.provenance &&
                desc.dataType == this.dataType
            )
            .map((desc) => desc.bioSource)
        ),
      ];
    },
    origins() {
      var origins = [...new Set(this.dataDescs.filter(
        (desc) =>
          desc.dataType == this.dataType &&
          desc.provenance == this.provenance &&
          desc.bioSource == this.bioSource
      ).map(desc => desc.origin))].filter(item => item !== undefined);
      return origins;
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
      if (this.relationshipTypes.length < 1) {
        this.error = "Choose at least one source";
        return;
      }
      this.$emit("searchSecondaryPathways", this.relationshipTypes);
    },
    addRelationship() {
      var desc = `${this.provenance}|${this.bioSource}|${this.dataType}`;
      if (this.origin != "") {
        desc = `${desc}|${this.origin}`;
      }
      if (desc.length > 100) desc = desc.substring(0, 100);
      this.relationshipTypes.push(desc);
      this.dataType = "";
      this.provenance = "";
      this.bioSource = "";
      this.origin = "";
    },
    cascadeDataType() {
      this.provenance = "";
      this.bioSource = "";
      this.origin = "";
    },
    cascadeProvenance() {
      this.bioSource = "";
      this.origin = "";
    },
    cascadeBioSource() {
      this.origin = "";
    },
  },
};
</script>

<style scoped>
.errors{color:red;}
</style>
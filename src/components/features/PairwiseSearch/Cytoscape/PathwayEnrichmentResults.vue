<template>
  <v-card outlined>
    <v-card-title>
      <h4>Pathway Enrichment Analysis</h4>
      <v-spacer></v-spacer>
        <a target="_blank" :href="reactomeFireworksURL"><v-btn color="secondary">Open in Reactome</v-btn></a>
      <v-btn icon @click="show = !show">
        <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-expand-transition>
      <v-card-text v-show="show">
        <v-data-table
          dense
          :headers="pathwayEnrichmentHeaders"
          :items="pathwayEnrichmentResults.pathways"
          :footer-props="{ 'items-per-page-options': [20, 40, 50, 100] }"
          no-results-text="No pathways. Try a less strict filter thresholds."
        >
          <template v-slot:item.stId="{item}">
            <a target="_blank" :href="getReactomeDiagramURL(item)">{{item.stId}}</a>
          </template>
          <template v-slot:item.entities.ratio="{ item }">
            <p :title="item.entities.ratio">
              {{ item.entities.ratio.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.entities.pValue="{ item }"
            ><p :title="item.entities.pValue">
              {{ item.entities.pValue.toExponential(2) }}
            </p></template
          >
          <template v-slot:item.entities.fdr="{ item }"
            ><p :title="item.entities.fdr">
              {{ item.entities.fdr.toExponential(2) }}
            </p></template
          >
          <template v-slot:body.append>
            <tr>
              <td colspan="1">
              </td>
              <td>
                <v-text-field
                  placeholder="Search"
                  v-model="pathwaySearchInput"
                  hide-details
                ></v-text-field>
              </td>
              <td colspan="3"></td>
              <td>
                <v-text-field
                  prefix="≤"
                  v-model="pValInput"
                  type="number"
                  min="0"
                  hide-details
                ></v-text-field>
              </td>
              <td colspan="1">
                <v-text-field
                  prefix="FDR ≤"
                  v-model="pathwayEnrichmentFDR"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  hide-details=""
                ></v-text-field>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  name: "PathwayEnrichmentResults",
  props: {
    pathwayEnrichmentResults: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    show: true,
    pathwayEnrichmentFDR: 1,
    pathwaySearchInput: "",
    pValInput: 0.05
  }),
  computed: {
    pathwayEnrichmentHeaders() {
      return [
        { text: "Stable Identifier", value: "stId" },
        { text: "Pathway Name", value: "name",
        filter: (value) => {
          if(!this.pathwaySearchInput) return true;
          return value.includes(this.pathwaySearchInput)
        } },
        { text: "Entities Found", value: "entities.found" },
        { text: "Entities Total", value: "entities.total" },
        { text: "Entities Ratio", value: "entities.ratio" },
        { text: "Entities pValue", value: "entities.pValue",
        filter: (value) => {
          if(!this.pValInput) return true;
          return value <= this.pValInput;
        } },
        {
          text: "Entities FDR",
          value: "entities.fdr",
          filter: (value) => {
            if (!this.pathwayEnrichmentFDR) return true;
            return value <= parseFloat(this.pathwayEnrichmentFDR);
          },
        },
      ];
    },
    reactomeFireworksURL(){
      return `${process.env.VUE_APP_REACTOME_LINK}DTAB=AN&ANALYSIS=${this.pathwayEnrichmentResults.summary.token}`
    }
  },
  methods:{
    getReactomeDiagramURL(item){
      return `${process.env.VUE_APP_REACTOME_LINK}${item.stId}&DTAB=AN&ANALYSIS=${this.pathwayEnrichmentResults.summary.token}`
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
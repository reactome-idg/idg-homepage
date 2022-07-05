<template>
  <v-card outlined>
    <v-card-text>
      <plotly
        ref="chart"
        :data="results"
        :layout="layout"
        :display-mode-bar="true"
      >
      </plotly>
    </v-card-text>
  </v-card>
</template>

<script>
import { Plotly } from "vue-plotly";
import PairwiseService from "../../../../service/PairwiseService";

export default {
  name: "PathwayResultsPlot",
  components: {
    plotly: Plotly,
  },

  props: {
    pathwayEnrichmentResults: {
      type: Array,
      default: () => [],
    },
    pvalueCutoff: {
      type: Number,
      default: 0.05,
    },
  },

  data() {
    return {
      pathwayList: undefined,
    };
  },

  computed: {
    results: function () {
      return this.generateResults();
    },
    // Defined as a computed prop so that it can be overriden in the parent component
    layout: function () {
      return {
        showlegend: true, // Always let this on
        xaxis: {
          title: "Pathway",
          showticklabels: false,
          categoryorder: "array",
          categoryarray: this.generateXAxisLabels(),
        },
        yaxis: {
          title: "-Log10(pValue)",
        },
      };
    },
  },
  methods: {
    async loadHierarchialOrderedPathways() {
      try {
        let hierarchialOrderedPathway =
          await PairwiseService.getHierarchialOrderedPathways();
          return JSON.stringify(hierarchialOrderedPathway);
      } catch (err) {
        console.log(err);
      }
    },

     generateXAxisLabels() {
      let pathwayList = this.getPathwayList();
      let labels = [];
      for (let pathway of pathwayList) labels.push(pathway.name);
      console.log(labels);
      return labels;
    },

    generateResults() {
      return this.generateTypedResults(this.pathwayEnrichmentResults);
    },

    // Generate the plot data based on top-level pathways
    generateTypedResults(pathwayEnrichmentResults, title) {
      let stId2top = new Map();
      let pathwayList = this.getPathwayList();
      if (pathwayList) {
        for (let pathway of pathwayList) {
          // Better to use stId to avoid any type of text encoding issue 
          // with miss match.
          stId2top.set(pathway.stId, pathway.topPathway);
        }
      }
      let top2data = new Map();
      for (let result of pathwayEnrichmentResults) {
        let top = stId2top.get(result.stId);
        if (top === undefined) top = "unknown";
        let data = top2data.get(top);
        if (data === undefined) {
          data = { pathways: [], scores: [], text: [] };
          top2data.set(top, data);
        }
        data.pathways.push(result.name);
        data.scores.push(-Math.log10(result.pVal));
        data.text.push(
          this.generateText(
            result.name,
            result.stId,
            result.pVal,
            top,
            title
          )
        );
      }
      let plotData = [];
      // Need to sort top pathways first to get the same color and legends
      let tops = [...top2data.keys()].sort();
      for (let top of tops) {
        let data = top2data.get(top);
        let name = top;
        if (title) 
          name += (" (" + title + ")");
        let topData = {
          name: name,
          x: data.pathways,
          y: data.scores,
          text: data.text,
          type: "scattergl",
          mode: "markers",
          marker: {
            size: 5,
            // Let plotly decides the color. But we may need to decide colors to
            // get a consistent color scheme.
            // color: "#0000FF",
          },
        };
        plotData.push(topData);
      }
      return plotData;
    },

    getPathwayList() {
      if (this.pathwayList) 
        return this.pathwayList;
      let pathway_list_text = sessionStorage.getItem("reactome_pathway_list");
      let tmpPathwayList = undefined;
      if (pathway_list_text) {
        tmpPathwayList = JSON.parse(pathway_list_text);
      } else {
        // Get the pathway list from the results
        tmpPathwayList = this.generateLocalPathwayList(this.pathwayEnrichmentResults);
      }
      this.pathwayList = tmpPathwayList;
      return this.pathwayList;
    },

    generateLocalPathwayList() {
      return this._generateLocalPathwayList(this.pathwayEnrichmentResults);
    },

    _generateLocalPathwayList(pathwayEnrichmentResults) {
      // Get the pathway list from the results
      let tmpPathwayList = [];
      for (let result of pathwayEnrichmentResults) {
        let tmpPathway = { name: result.name, topPathway: "unknown"};
        tmpPathwayList.push(tmpPathway);
      }
      tmpPathwayList.sort((p1, p2) => p1.name.localeCompare(p2.name));
      return tmpPathwayList;
    },

    generateText(name, stId, pVal, topPathway, label) {
      let text = "<b>Pathway: " + name + "</b><br>" + "Stable id: " + stId;
      if (topPathway) text += "<br>Top pathway: " + topPathway;
      text = text + "<br>" + "pValue: " + pVal.toExponential(2);
      if (label) text += '<br>Analysis: ' + label;
      return text;
    },

    //   async loadHierarchialOrderedPathways() {
    //   try {
    //     // Handle pathway list that is used as the base for plot
    //     if (!sessionStorage.getItem('reactome_pathway_list')) {
    //       let pathwayList = await PairwiseService.getHierarchialOrderedPathways();
    //       sessionStorage.setItem('reactome_pathway_list', JSON.stringify(pathwayList));
    //     }
    //     // this.resultSets.find(
    //     //   (rs) => rs.id === id
    //     // ).enrichmentResults = await ImmportService.fetchPathwayEnrichmentAnalysis(
    //     //   genes.map((gene) => gene.gene_name)
    //     // );
      
    //     this.$forceUpdate();
    //   } catch (err) {
    //     console.log(err);
    //   }
    // },
  },
};
</script>
<template>
  <v-card outlined
  @dblclick = "unselect">   
    <plotly 
      ref="chart" 
      :data="results" 
      :layout="layout" 
      :display-mode-bar="true" 
      style="height: 300px;" 
      class="pa-0"
      @click="select"
      @dblclick="unselect">
    </plotly> 
    <v-tooltip right>
      <template v-slot:activator="{on, attrs}">
        <v-btn 
          v-bind="attrs" 
          v-on="on" 
          icon 
          v-on:click="switchPathwayView" 
          style="position: absolute; bottom: 4px; left: 4px;"
          class="mx-1 pa-0">
          <v-icon>{{ mdiChartTimelineVariant }}</v-icon>
        </v-btn>
      </template>
      <span>Network View</span>
    </v-tooltip>
  </v-card>
</template>

<script>
import { Plotly } from "vue-plotly";
import { mdiChartTimelineVariant } from '@mdi/js';

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
    isCytoscapeView: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      pathwayList: undefined,
      mdiChartTimelineVariant,
      selected: new Set(),
      pointNumber: undefined,
      curveNumber: undefined,
      sizes: [],
      defaultPointSize: 5
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
    generateXAxisLabels() {
      let pathwayList = this.getPathwayList();
      let labels = [];
      for (let pathway of pathwayList) labels.push(pathway.name);
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
          data = { pathways: [], scores: [], text: [], size: [] };
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
        let pathwaySize = [];
        for(let i=0; i < data.pathways.length; i++){
          pathwaySize.push(this.defaultPointSize); 
        }
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
            size: pathwaySize,
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
        let tmpPathway = { name: result.name, topPathway: "unknown" };
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
      text += "<br>" + "Click data point to select." + "<br>" + "Double click outisde the plot to reset."
      return text;
    },

    switchPathwayView() {
      this.$emit('switchPathwayView')
    },

    select(clickData) {
      if (clickData.points.length === 1) {
        // reset previous selection
              let textSize = {'text':{size: 20}};
      this.$refs.chart.restyle(textSize);
        if(this.pointNumber != undefined && this.curveNumber != undefined){
          this.changePointSize(this.defaultPointSize);
        }

        // logic follows https://plotly.com/javascript/plotlyjs-events/   
        for(var i=0; i < clickData.points.length; i++){
          // using global variable to track the point changed to reset later
          this.pointNumber = clickData.points[i].pointNumber;
          this.curveNumber = clickData.points[i].curveNumber;
          this.sizes = clickData.points[i].data.marker.size;
        }

        this.changePointSize(this.sizes[this.pointNumber] * 2);
             
        this.selected.clear();
        let text = clickData.points[0].text;
        let pattern = "Stable id: ";
        let textArray = text.substr(text.indexOf(pattern) + pattern.length, text.length);
        this.selected.add(textArray.split("<br>")[0])
        this.$emit("selectionChanged", this.selected);
      }
    },

    unselect() {
      this.changePointSize(this.defaultPointSize);
      this.pointSize = [];
      this.generateResults();
      this.selected.clear();
      this.$emit("selectionChanged", this.selected)
    },

    changePointSize(pointSize){
      this.sizes[this.pointNumber] = pointSize;
      let update = {'marker':{size: this.sizes}};
      this.$refs.chart.restyle(update, [this.curveNumber]);
    }
  },
};
</script>
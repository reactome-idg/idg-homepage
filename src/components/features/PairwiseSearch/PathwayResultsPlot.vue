<template>
  <v-card class="pa-0" style="min-height: 300px; margin: 0px 0px 0px 0px;"
    outlined>
    <plotly 
      ref="chart" 
      :data="results" 
      :layout="layout" 
      :display-mode-bar="true" 
      style="height: 290px; width: 99%; left: 1px" 
      class="pa-0"
      @hover = "onHover"
      >
    </plotly>
    <v-tooltip right>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" icon v-on:click="switchPathwayView" title ="Switch to network view"
          style="position: absolute; bottom: 4px; left: 4px;" class="mx-1 pa-0">
          <v-icon>{{ mdiChartTimelineVariant }}</v-icon>
        </v-btn>
      </template>
      <span>Switch to network view</span>
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
    nodeFDRFilter: {
      type: Number,
      default: 0.05,
    },
    pathwaySelection: {
      type: String,
      default: () => "",
    },
    isCytoscapeView: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      pathwayList: undefined,
      mdiChartTimelineVariant,
      selected: new Set(),
      selectedData: {pointNumber: undefined, curveNumber: undefined, sizes: []},
      selectedSet: new Set(),
      defaultPointSize: 5,
      hoverData: {hoverCurveNumber: undefined, hoverPointNumber: undefined, hoverSizes: [],
         hoverText:undefined, clientX: undefined, clientY: undefined},
      top2curveNumber: new Map(),
      stId2top: new Map(),
      stId2pointNumber: new Map(),
      top2sizes: new Map()
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
        hoverlabel: {
          font: {
            size: 10,
          }
        },
        modebar: {
          displayModeBar: true,
          left: 0.1,
        }
      };
    },
  },

  watch: {
    nodeFDRFilter() {
      this.updatePlot(); 
    },

    isCytoscapeView() {
      this.setSelection();
    }
  }, 

  mounted() {
    this.$refs.chart.$el.addEventListener('click', data => this.onClick(data));
  },

  methods: {
    
    onHover(hoverData){ 
      this.hoverData.hoverCurveNumber = hoverData.points[0].curveNumber; 
      this.hoverData.hoverPointNumber = hoverData.points[0].pointNumber; 
      this.hoverData.hoverSizes = hoverData.points[0].data.marker.size;
      this.hoverData.hoverText = hoverData.points[0].text;
      this.hoverData.clientX = hoverData.event.clientX;
      this.hoverData.clientY = hoverData.event.clientY;
    },

    generateXAxisLabels() {
      let pathwayList = this.getPathwayList();
      let labels = [];
      for (let pathway of pathwayList) labels.push(pathway.name);
      return labels;
    },

    generateResults() {
      // remove items from array based on fdr 
      let filteredPathwayEnrichmentResults = [];
      for( let i=0; i < this.pathwayEnrichmentResults.length; i++)
      {
        let fdrScore = this.pathwayEnrichmentResults[i].fdr;
        if(fdrScore < this.nodeFDRFilter){
          filteredPathwayEnrichmentResults.push(this.pathwayEnrichmentResults[i]);
        }
      }
      return this.generateTypedResults(filteredPathwayEnrichmentResults);
    },

    // Generate the plot data based on top-level pathways
    generateTypedResults(pathwayEnrichmentResults) {
      let pathwayList = this.getPathwayList();
      if (pathwayList) {
        for (let pathway of pathwayList) {
          // Better to use stId to avoid any type of text encoding issue 
          // with miss match.
          this.stId2top.set(pathway.stId, pathway.topPathway);
        }
      }
      let top2data = new Map();
      
      for (let result of pathwayEnrichmentResults) {
        let top = this.stId2top.get(result.stId);
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
          )
        );

        // pointNumber
        for (let i = 0; i < data.pathways.length; i++) {
          this.stId2pointNumber.set(result.stId, i);
        }

      }
      let plotData = [];
      // Need to sort top pathways first to get the same color and legends
      let tops = [...top2data.keys()].sort();
      let topIndex = 0;
      for (let top of tops) {
        let data = top2data.get(top);
        let name = top;
        let pathwaySize = [];
        for (let i = 0; i < data.pathways.length; i++) {
          pathwaySize.push(this.defaultPointSize);
        }
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
        }
        plotData.push(topData);
        
        this.top2curveNumber.set(top, topIndex);
        this.top2sizes.set(top, topData.marker.size);
        topIndex++;
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
      if (topPathway) text += "<br>" + "Top pathway: " + topPathway;
      text = text + "<br>" + "pValue: " + pVal.toExponential(2);
      if (label) text += '<br>Analysis: ' + label;
      text += "<br>" + "Click data point to select."
      return text;
    },

    switchPathwayView() {
      this.$emit('switchPathwayView')
    },

    onClick(clickEvent) {
      let threshold = 30;
      let euclideanDistance = this.calculateEuclideanDistance(
        clickEvent.clientX, 
        clickEvent.clientY, 
        this.hoverData.clientX, 
        this.hoverData.clientY);

      if(euclideanDistance > threshold){
        this.resetHoverData();
      }

      if(this.hoverData.hoverPointNumber !== undefined) 
      {
        this.select();
      }

      else {
        if(this.selectedSet.size > 1)
        {
          for(let point of this.selectedSet) {
            this.selectedData = point;
            this.unselect();
          }
        }
        else {
          this.unselect();
        }
      }
    },

    select() {
      // reset previous selection
      if (this.selectedData.pointNumber != undefined && this.selectedData.curveNumber != undefined) {
        this.changePointSize(this.defaultPointSize);
      }
      for(let point of this.selectedSet) {
        this.selectedData = point;
        this.changePointSize(this.defaultPointSize);
      }

      this.selectedData.pointNumber = this.hoverData.hoverPointNumber;
      this.selectedData.curveNumber = this.hoverData.hoverCurveNumber;
      this.selectedData.sizes = this.hoverData.hoverSizes;

      this.changePointSize(this.selectedData.sizes[this.selectedData.pointNumber] * 2);

      this.selected.clear();
      let text = this.hoverData.hoverText;
      let pattern = "Stable id: ";
      let textArray = text.substr(text.indexOf(pattern) + pattern.length, text.length);
      this.selected.add(textArray.split("<br>")[0])
      this.$emit("selectionChanged", this.selected);
    },

    unselect() {
      //this.selectedSet.clear(); // TODO: ensure this is the correct/only spot
      this.changePointSize(this.defaultPointSize);
      this.selected.clear();
      this.$emit("selectionChanged", this.selected);
      this.selectedData.pointNumber = undefined;
      this.selectedData.curveNumber = undefined;
      this.selectedData.sizes = [];
    },

    changePointSize(pointSize) {
      this.selectedData.sizes[this.selectedData.pointNumber] = pointSize;
      let update = { 'marker': { size: this.selectedData.sizes } };
      this.$refs.chart.restyle(update, [this.selectedData.curveNumber]);
    },

    calculateEuclideanDistance(x1, y1, x2, y2){
      let xDistance = x1 - x2;
      let yDistance = y1 - y2;
      let euclideanDistance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
      return euclideanDistance;
    },

    resetHoverData() {
      this.hoverData.hoverCurveNumber = undefined; 
      this.hoverData.hoverPointNumber = undefined; 
      this.hoverData.hoverSizes = [];
      this.hoverData.hoverText = undefined;
      this.hoverData.clientX = undefined;
      this.hoverData.clientY = undefined;
    },

    setSelection(){
      for(let point of this.selectedSet) {
          this.selectedData = point;
          this.changePointSize(this.defaultPointSize);
      }
      this.selectedData.pointNumber = undefined;
      this.selectedData.curveNumber = undefined;
      this.selectedData.sizes = [];
      this.selectedSet.clear();
      if(this.pathwaySelection !== ""){
        let stIdSplit = this.pathwaySelection.split(',');
        for(let stId of stIdSplit){
          let pointNumber = this.stId2pointNumber.get(stId);
          let top = this.stId2top.get(stId);
          let curveNumber = this.top2curveNumber.get(top);
          let sizes = this.top2sizes.get(top);
          let selectedData = {pointNumber, curveNumber, sizes};
          this.selectedSet.add(selectedData);
          this.selectedData = selectedData;
          this.changePointSize(this.selectedData.sizes[this.selectedData.pointNumber] * 2);
        }
      }
    }
  },
};
</script>
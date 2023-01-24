<template>
  <v-card
    class="pa-0"
    style="min-height: 300px; margin: 0px 0px 0px 0px"
    outlined
  >
    <plotly
      ref="chart"
      :data="plotData"
      :layout="layout"
      class="pa-0"
      style="max-height: 300px"
    >
    </plotly>
  </v-card>
</template>
  
<script>
import { Plotly } from "vue-plotly";
import PairwiseService from "../../../service/PairwiseService";

export default {
  name: "PathwayResultsPlot",
  components: {
    plotly: Plotly,
  },

  props: {
    term: {
      type: String,
      default: () => null,
    },
  },

  data() {
    return {
      results: [],
      dataDescriptions: [],
    };
  },

  watch: {
    term() {
      this.getRelationshipsForGenes();
    },
  },

  computed: {
    layout: function () {
      return {
        showlegend: true,
        responsive: true,
        title: {
          text: "Feature Summary for " + this.term,
          font: {
            size: 16,
          },
        },
        xaxis: {
          title: "Feature",
          showticklabels: false,
          categoryorder: "array",
          categoryarray: this.generateXLabels(),
        },
        yaxis: {
          title: "Number of Interactions",
        },
        hoverlabel: {
          font: {
            size: 10,
          },
        },
        modebar: {
          displayModeBar: true,
          left: 0.1,
        },
      };
    },

    plotData: function () {
      return this.createPlotData();
    },
  },

  created() {
    this.getRelationshipsForGenes();
  },

  methods: {
    createPlotData() {
      let dataDesc2Type = this.generateDesc2TypeMap();

      let dataType2pairwiseRelationship = new Map();
      if (this.results) {
        for (let result of this.results) {
          let descType = dataDesc2Type.get(result.dataDesc.id);
          if (descType === undefined) descType = "unknown";

          let geneRelationship = dataType2pairwiseRelationship.get(descType);
          if (geneRelationship === undefined) {
            geneRelationship = { dataDescId: [], posNum: [], text: [] };
            dataType2pairwiseRelationship.set(descType, geneRelationship);
          }
          // The following code adds ids having numbers only.
          geneRelationship.dataDescId.push(result.dataDesc.id);
          let posNum = result.posNum ? result.posNum : 0;
          let negNum = result.negNum ? result.negNum : 0;
          geneRelationship.posNum.push(posNum + negNum);
          geneRelationship.text.push(
            this.generateText(result.posNum, result.dataDesc.id)
          );
        }
      }

      let plotData = [];
      let relationshipTypes = dataType2pairwiseRelationship.keys();
      for (let relationshipType of relationshipTypes) {
        let pairwiseData = dataType2pairwiseRelationship.get(relationshipType);
        let name = relationshipType;

        let relationshipGeneData = {
          name: name,
          x: pairwiseData.dataDescId,
          y: pairwiseData.posNum,
          text: pairwiseData.text,
          type: "scattergl",
          mode: "markers",
          marker: {
            size: 5,
          },
        };
        plotData.push(relationshipGeneData);
      }
      return plotData;
    },

    generateText(numFeatures, relationship) {
      if (relationship !== undefined) {
        let relationships = relationship.split("|");
        let relationshipType = relationships[2];
        let dataResouce = relationships[0];
        let bioSource = relationships[1];
        let dataSource = relationships[3] ? relationships[3] : undefined;
        let text =
          "<b>Feature Type: </b>" +
          relationshipType +
          "<br>" +
          "<b>Data Resource: </b>" +
          dataResouce +
          "<br>" +
          "<b>Biosource: </b>" +
          bioSource;
        if (dataSource)
          text += "<br>" + "<b>Original Data Source: </b>" + dataSource;
        text = text + "<br>" + "<b>Number of Relationships: </b>" + numFeatures;
        return text;
      }
    },

    generateDesc2TypeMap() {
      let dataDesc2Type = new Map();
      if (this.dataDescriptions) {
        for (let dataDescription of this.dataDescriptions) {
          let dataType = dataDescription.dataType;
          if (dataType === "Gene_Coexpression") {
            let dataResource = dataDescription.id.split("|")[0];
            dataType += "_" + dataResource;
          }
          dataDesc2Type.set(dataDescription.id, dataType);
        }
      }
      return dataDesc2Type;
    },

    generateXLabels() {
      let labels = this.dataDescriptions.map((desc) => desc.id);
      labels.sort((id1, id2) => {
        let tokens1 = id1.split("|");
        let tokens2 = id2.split("|");
        // Check the type first
        let rtn = tokens1[2].localeCompare(tokens2[2]);
        if (rtn !== 0) return rtn;
        return id1.localeCompare(id2);
      });
      return labels;
    },

    _getDataDescriptions() {
      let data_descriptions_text = sessionStorage.getItem("dataDescriptions");
      if (data_descriptions_text) {
        return JSON.parse(data_descriptions_text);
      }
      throw new Error("No data descriptions can be found.");
    },

    async getRelationshipsForGenes() {
      // Cache this for later use
      this.dataDescriptions = this._getDataDescriptions();
      let descIds = this.dataDescriptions.map((desc) => desc.id);
      try {
        this.results = await PairwiseService.pairwiseRelationshipsForGenes({
          genes: [this.term],
          dataDescs: descIds,
        });
        this.assignPairwiseFeatures(this.results, descIds);
      } catch (err) {
        console.error(err);
      }
    },

    assignPairwiseFeatures(relationshipsForGenes) {
      if (relationshipsForGenes === undefined) return; // Just in case
      let relationshipIds = relationshipsForGenes.map((rel) => rel.dataDesc.id);
      // Check if the leftmost and rightmost ids there. Otherwise, assign 0.
      // This is used to make sure all ids are displayed
      let xlabels = this.generateXLabels();
      let checkedIds = [xlabels[0], xlabels[xlabels.length - 1]];
      for (let id of checkedIds) {
        if (relationshipIds.includes(id)) continue;
        let relationshipObject = { dataDesc: { id: id }, posNum: 0 };
        relationshipsForGenes.push(relationshipObject);
      }
    },
  },
};
</script>
<template>
    <v-card class="pa-0" style="min-height: 300px; margin: 0px 0px 0px 0px;"
      outlined>
      <plotly 
        ref="chart" 
        :data="plotData" 
        :layout="layout" 
        class="pa-0"
        style="max-height: 300px;" 
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
        dataDescriptions: []
      };
    },
  
    watch: {
      term() {
        this.getRelationshipsForGenes();
      }
    },


    computed: {
     layout: function () {
        return {
          showlegend: true, 
          responsive: true, 
          title: {
            text:'Feature Summary',
            font: {
              size: 16
            },
          },
          xaxis: {
            title: "Sources",
            showticklabels: false,
            categoryorder: "array",
            categoryarray: this.generateDesc2TypeMap().keys()
          },
          yaxis: {
            title: "Number of " + "<br>" + "Pairwise Features",
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

      plotData: function() {
        return this.createPlotData();
      }
    },

    created() {
      this.getRelationshipsForGenes();
    },
  
    methods: {
      createPlotData() {
          let dataDesc2Type = this.generateDesc2TypeMap();

          let dataType2pairwiseRelationship = new Map();
          if(this.results){
            for(let result of this.results){
              let descType = dataDesc2Type.get(result.dataDesc.id);
              if(descType === undefined) descType = "unknown";

              let geneRelationship = dataType2pairwiseRelationship.get(descType);
              if(geneRelationship === undefined){
                geneRelationship = {dataDescId: [], posNum: [], text: []};
                dataType2pairwiseRelationship.set(descType, geneRelationship);
              }

                geneRelationship.dataDescId.push(result.dataDesc.id);
                let posNum = result.posNum ? result.posNum: 0;
                let negNum = result.negNum ? result.negNum: 0;
                geneRelationship.posNum.push(posNum + negNum);
                geneRelationship.text.push(this.generateText(result.posNum, result.dataDesc.id));
            }
          }

          let plotData = [];
          let relationshipTypes = dataType2pairwiseRelationship.keys();
          for(let relationshipType of relationshipTypes) {
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
              }
            }
            plotData.push(relationshipGeneData);
          }
          return plotData;
        },
  
        generateText(numFeatures, relationship) {
          if(relationship !== undefined){
          let relationships = relationship.split("|");
          let relationshipType = relationships[2];
          let dataResouce = relationships[0];
          let bioSource = relationships[1];
          let dataSource = relationships[3] ? relationships[3] : undefined;
            let text = "<b>Relationship Type: </b>" + relationshipType + "<br>" 
            + "<b>Data Resource: </b>" + dataResouce + "<br>"
            + "<b>Biosource: </b>" + bioSource;
            if (dataSource) text += "<br>" + "<b>Data Source: </b>" + dataSource;
            text = text + "<br>" + "<b>Number of Features: </b>" + numFeatures;
            return text;
          }
        },

        generateDesc2TypeMap() {
          let dataDesc2Type = new Map();
          if(this.dataDescriptions){
            for(let dataDescription of this.dataDescriptions){
              let dataType = dataDescription.dataType;
              if(dataType === "Gene_Coexpression"){
                let dataResource = dataDescription.id.split("|")[0];
                dataType += "_" + dataResource;
              }

              dataDesc2Type.set(dataDescription.id, dataType);
            }
          }
          return dataDesc2Type;
        },
  
         getDataDescriptions() {
            let data_descriptions_text = sessionStorage.getItem("dataDescriptions");
            if (data_descriptions_text)
              return JSON.parse(data_descriptions_text);
            throw new Error("No data descriptions can be found.");
        },

        getDatadescriptionIds() {
          this.dataDescriptions = this.getDataDescriptions();
          let dataDescIds = [];
            for(let dataDescription of this.dataDescriptions){
                dataDescIds.push(dataDescription.id);
            }
            return dataDescIds;
        },

        async getRelationshipsForGenes() {
            let descIds = this.getDatadescriptionIds();
            let relationshipsForGenes = [];
            try {
                relationshipsForGenes = await PairwiseService.pairwiseRelationshipsForGenes({
                    genes: [this.term],
                    dataDescs: descIds
                });
                this.assignPairwiseFeatures(relationshipsForGenes, descIds);
                this.results = relationshipsForGenes;
            } catch (err) {
                relationshipsForGenes = [];
            }
            return relationshipsForGenes;
        },

        assignPairwiseFeatures(relationshipsForGenes, descIds) {
          let relationshipIds = [];
          for(let relationship of relationshipsForGenes){
            relationshipIds.push(relationship.dataDesc.id);
          }      
          for(let id of descIds){
            if(relationshipIds.includes(id)) 
              continue;
            let relationshipObject =  {dataDesc: {id: id}};
            relationshipsForGenes.push(relationshipObject);
          }

         }
    },
  
  };
  </script>
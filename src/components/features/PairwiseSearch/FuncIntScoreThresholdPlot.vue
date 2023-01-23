<template>
  <v-card class="pa-0" style="min-height: 300px; margin: 0px 0px 0px 0px;"
    outlined>
    <plotly 
      ref="chart" 
      :data="results" 
      :layout="layout" 
      class="pa-0"
      style="max-height: 300px;" 
      >
    </plotly>
  </v-card>
</template>

<script>
import { Plotly } from "vue-plotly";

export default {
  name: "FuncIntScoreThresholdPlot",
  components: {
    plotly: Plotly,
  },

  props: {
    term: {
      type: String,
      default: () => null,
    },
    interactingGenes: {
      type: Array,
      default: () => [],
    },
    errors: {
      type: String,
      default: () => "",
    },
  },

  data() {
    return {
      prdInput: 0.9,
      error: "",
      geneData: [],
    };
  },

  computed: {
    results: function () {
      return this.calculateNumberOfGenes();
    },
    // Defined as a computed prop so that it can be overriden in the parent component
    layout: function () {
      return {
        showlegend: false, 
        responsive: true, 
        title: {
          text:'Genes vs Functional Interaction Score',
          font: {
            size: 16
          },
        },
        xaxis: {
          title: "Functional Interaction Score",
          showticklabels: true,
          categoryorder: "array",
        },
        yaxis: {
          title: "Number of Genes",
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

  },

  methods: {
    //may be better to create an object for the data instead of so many arrays
    calculateNumberOfGenes() {
      let numberOfGenes = [];
      let funcIntScore = this.generateFuncIntScores();
      let text = [];
      for(let i=0; i<funcIntScore.length; i++)
      {
        let geneCount = 0;
        if(this.interactingGenes !== null){
          geneCount = this.interactingGenes.filter(({ score }) => score >= funcIntScore[i]).length;
        }
        numberOfGenes.push(geneCount);
        text.push(this.generateText(geneCount, funcIntScore[i]));
      }
      let geneData = {
          name: funcIntScore,
          x: funcIntScore,
          y: numberOfGenes,
          text: text,
          type: "scattergl",
          mode: "markers",
          marker: {
            size: 5,
          }
        }
        let geneDataArray = [];
        geneDataArray.push(geneData);
        return geneDataArray;
      },

      generateText(gene, score) {
        let text = "<b>"+ gene + " genes interacting with " + this.term + " </b> "
        + "<br>for a Functional Interaction Score ≥ " + score; 
          return text; 
      },

      generateFuncIntScores() {
        let step = 0.05;
        let range = 1;
        let funcIntScores = [];
        for(let score=0.00; score<=range; score+=step)
        {
          funcIntScores.push(score.toFixed(2));
        }
        return funcIntScores;
      }
  },

};
</script>
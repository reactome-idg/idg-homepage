<!-- Most of the code here is copied from CyInstance.vue in the reactome-immport-ws project:
     https://github.com/VIOLINet/reactome-immport-web/blob/master/src/components/ImmportResults/Cytoscape/CyInstance.vue -->
<template>
  <v-container class="pa-0"> 
    <!-- Ref: https://rcarcasses.github.io/vue-cytoscape/installation.html#usage. Apparently the original code doesn't work
    as described here. Therefore, Tim has customized the behavior using methods in this component. --> 
    <cytoscape ref="cy" :config="cyConfig" 
              :preConfig="preConfig" 
              :afterCreated="afterCreated" 
              style="min-height: 300px;"
              class="pa-0">
    </cytoscape>
    <v-btn icon class="settingBtn mx-1 pa-0" @click="show = !show">
        <v-icon>{{ mdiCogOutline }}</v-icon>
    </v-btn>
    <!-- TODO: GUI controls for the network view. The card cuts some space out from the cytoscape view. Probably 
    we need to think how to make it show on the fly. Probably use v-overlay with a setting icon, which can
    hide itself when the mouse is out -->
    <!-- Try to refer to some code here for hoveable controls: https://www.codeply.com/p/QyIDFyjH4Q --> 
    <!-- Probably need to change to other layout,e.g., v-layout -->
    <v-expand-transition>
    <v-card outlined class="controlCard pa-2" v-show="show">
      <v-btn @click="reset" depressed x-small>reset network</v-btn>
      <v-card-text dense style="font-size: 100%" class="pa-2">Choose Layout</v-card-text>
      <v-select v-model="layout" :items="layoutChoices" dense style="font-size: 100%"></v-select>
      <v-card-text title="Choose a threshold for pathway overlay pvalue according to hypergeometic test"
       style="font-size: 100%" dense class="pa-2">Overlay pvalue &#60;</v-card-text>
      <v-text-field type="Text" class="mr-3" style="font-size: 100%"
        v-model="edgeHypergeometricScoreFilter"
        :rules="[v => !isNaN(v) && v <= 1]" 
        @keyup.enter="updateNetwork"
        hide-details
        dense>
      </v-text-field>
      <v-btn @click="show = false" depressed x-small class="closeBtn">Close</v-btn>
    </v-card>
    </v-expand-transition>
  </v-container>
</template>

<script>

import { mdiCogOutline } from '@mdi/js';

export default {
  name: "PathwayGeneSimilarity",
  // Probably there is a bug in vue-cytoscape: component cannot be defined here
  // It should be defined at main.js. Otherwise, an error shows template or render function
  // is not defined.
  props: {
    network:{
      type: Array,
      default: () => []
    },
    // Node FDR cutoff to be set by the container
    nodeFDRFilter: {
      type: Number,
      default: 0.05,
    }
  },
  // This is a function
  data: () => ({
    mdiCogOutline,
    show: false,
    cyConfig: {
      style: [
        {
          selector: "node[fdr_score]", // Use a specified selector to avoid warning
          style: {
            label: "data(id)",
            "background-color": "data(weightedTDLColorHex)",
            "border-width": 5,
            "border-color": "mapData(fdr_score, 0, 10, yellow, blue)"
          },  
        },
        {
          selector:"node:selected",
          style: {
            "border-width": 7
          }
        },
        {
          selector: "edge[overlap_score]",
          style: {
            // Need to check the maximum. Use 100 for the time being
            width: "mapData(overlap_score, 0, 100, 1, 10)"
          }
        }
      ]
    },
    edgeHypergeometricScoreFilter: 0.01,
    layout: "random",
    layoutChoices: ["cose", "random", "circle", "concentric", "grid"]
  }),

  watch: {
    nodeFDRFilter() {
      this.updateNetwork()
    },
    network() {
      this.updateNetwork()
    },
    layout() {
      this.doLayout()
    }
  },

  methods: {
    doLayout() {
      if (!this.cy) return
      this.cy.layout({name: this.layout}).run()
      this.cy.center()
      this.cy.fit() 
    },

    // 600px is hard-coded in VueCytoscape. Modify it here. This is not good!
    // See: https://github.com/rcarcasses/vue-cytoscape/issues/47
    preConfig() {
      var el = document.getElementById('cytoscape-div');
      el.style.minHeight = "300px"
      el.style.height = "300px"
    },

    afterCreated(cy) {
      this.cy = cy
      this.updateNetwork()
    },

    updateNetwork() {
      if (isNaN(this.nodeFDRFilter)) return
      // Remove all network nodes first
      this.cy.elements().remove()
      this.cy.add(this.network)
      var removed = this.cy.elements('edge[hypergeometricScore >= ' + this.edgeHypergeometricScoreFilter + ']')
      this.cy.remove(removed)
      // Note: nodeFDRFilter is a string!
      removed = this.cy.elements('node[fdr >= ' + this.nodeFDRFilter + ']')
      this.cy.remove(removed)
      // Add a new data
      const nodes = this.cy.nodes()
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        node.data('fdr_score', -Math.log10(node.data('fdr')))
      }
      const edges = this.cy.edges()
      for (let i = 0; i < edges.length; i++) {
        let edge = edges[i]
        edge.data('overlap_score', -Math.log10(edge.data('hypergeometricScore')))
      }
      this.doLayout()
    },

    reset() {
      if (!this.cy) return
      this.cy.center()
      this.cy.fit()
    }
  },
};
</script>

<style style>
#cy {
  min-height: 300px;
  /* Make sure this is the same as specified at its container */
  height: 300px;
  /** Don't give any margin to cytoscape. Let the container handle it. */
  margin: 0px 0px 0px 0px;
}
.settingBtn {
  position: absolute;
  top: 4px;
  left: 4px;
}
.closeBtn {
  position: relative;
  /** Hard-coded position. Should be updated. */
  margin-top: 8px;
  margin-left: 24px;
}

.controlCard {
  position: absolute;
  align-items: center;
  top: 4px;
  left: 4px;
  width: 150px;
  font-size: 80%;
}
</style>
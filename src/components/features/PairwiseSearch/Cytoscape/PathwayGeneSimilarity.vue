<!-- Most of the code here is copied from CyInstance.vue in the reactome-immport-ws project:
     https://github.com/VIOLINet/reactome-immport-web/blob/master/src/components/ImmportResults/Cytoscape/CyInstance.vue -->
<template>
  <v-container class="pa-0" style="min-height: 300px; margin: 0px 0px 0px 0px;">
    <!-- Ref: https://rcarcasses.github.io/vue-cytoscape/installation.html#usage. Apparently the original code doesn't work
    as described here. Therefore, Tim has customized the behavior using methods in this component. -->
    <cytoscape ref="cy" :config="cyConfig" :preConfig="preConfig" :afterCreated="afterCreated" class="pa-0"
      v-on:select="select" v-on:unselect="unselect" style="max-height: 300px; min-height: 300px; height: 300px;"
      @mousedown="settingPaneShow = false; legendPaneShow = false">
      <!-- Make sure the setting pane closed if it is displayed to save a click -->
    </cytoscape>
    <v-btn icon style="position: absolute; top: 4px; left: 4px;" class="mx-1 pa-0 .d-flex"
      @click="settingPaneShow = !settingPaneShow">
      <v-icon>{{ mdiCogOutline }}</v-icon>
    </v-btn>
    <v-btn icon style="position: absolute; top: 4px; right: 4px;" class="mx-1 pa-0"
      @click="legendPaneShow = !legendPaneShow">
      <v-icon>{{ mdiMapLegend }}</v-icon>
    </v-btn>
    <!-- TODO: GUI controls for the network view. The card cuts some space out from the cytoscape view. Probably 
    we need to think how to make it show on the fly. Probably use v-overlay with a setting icon, which can
    hide itself when the mouse is out -->
    <!-- Try to refer to some code here for hoveable controls: https://www.codeply.com/p/QyIDFyjH4Q -->
    <!-- Probably need to change to other layout,e.g., v-layout -->
    <!-- May consider wrap the following into a v-dialog -->
    <v-expand-transition>
      <v-card outlined
        style="position: absolute; align-items: center; top: 4px; left: 4px; width: 200px; font-size: 80%;" class="pa-2"
        v-show="settingPaneShow">
        <v-btn @click="reset" depressed x-small>reset network</v-btn>
        <v-card-text dense style="font-size: 100% position: relative width: 175px" class="pa-2">Choose Layout
        </v-card-text>

        <div v-if="isWebComponent">
          <select style="width: 150px; position: relative; font-size: 100%" name="layouts" dense class="pa-2"
            classid="layouts" v-model="layout">
            <option v-for="layout in layoutChoices" :key="layout" :value="layout">{{ layout }}</option>
          </select>
        </div>
        <v-select v-else v-model="layout" :items="layoutChoices" dense style="font-size: 100%">{{ layout }}</v-select>
        <v-card-text title="Choose a threshold for pathway overlay pvalue according to hypergeometic test"
          style="font-size: 100% position: relative width: 175px" dense class="pa-2">Overlap pValue &#60;</v-card-text>
        <v-text-field type="Text" class="mr-3" style="font-size: 100%" v-model="edgeHypergeometricScoreFilter"
          :rules="[v => !isNaN(v) && v <= 1]" @keyup.enter="updateNetwork" hide-details dense>
        </v-text-field>
      </v-card>
    </v-expand-transition>
    <!-- Provide some information about the selected edges -->
    <v-expand-transition>
      <EdgeTable :selectedEdges="selectedEdges"
        style="position: absolute; bottom: 4px; right: 4px; width: 300px; font-size: 80%;"></EdgeTable>
    </v-expand-transition>
    <!-- Show legend -->
    <v-expand-transition>
      <LegendTable class="legendTable" v-show="legendPaneShow"
        style="top: 4px; right: 4px; position: absolute; align-items: center;">
      </LegendTable>
    </v-expand-transition>
  </v-container>
</template>

<script>

import { mdiCogOutline, mdiMapLegend, mdiMenuDown } from '@mdi/js';
import EdgeTable from './EdgeTable';
import LegendTable from './LegendTable.vue';
import VueCytoscape from 'vue-cytoscape';
import Vue from 'vue';

Vue.use(VueCytoscape);


export default {
  name: "PathwayGeneSimilarity",

  components: {
    EdgeTable,
    LegendTable
  },

  // Probably there is a bug in vue-cytoscape: component cannot be defined here
  // It should be defined at main.js. Otherwise, an error shows template or render function
  // is not defined.
  props: {
    network: {
      type: Array,
      default: () => []
    },
    // Node FDR cutoff to be set by the container
    nodeFDRFilter: {
      type: Number,
      default: 0.05,
    },
    // Some pathways may be filtered out via checking whether they are annotated or not
    tabledPathways: {
      type: Array,
      default: () => []
    },

    isWebComponent:{
      type: Boolean,
      default: false,
    }
  },
  // This is a function
  data: () => ({
    mdiCogOutline,
    mdiMapLegend,
    mdiMenuDown,
    settingPaneShow: false,
    legendPaneShow: false,
    cyConfig: {
      style: [
        {
          selector: "node[fdr_score]", // Use a specified selector to avoid warning
          style: {
            label: "data(id)",
            "font-size": "9",
            // It is understood that the maximum number of genes may be greater
            // that 200.
            width: "mapData(geneNumber, 0, 200, 10, 50)",
            height: "mapData(geneNumber, 0, 200, 10, 50)",
            "background-color": "data(weightedTDLColorHex)",
            "border-width": 3,
            "border-color": "mapData(fdr_score, 0, 10, yellow, blue)"
          },
        },
        {
          selector: "node:selected",
          style: {
            "border-width": 5,
            "background-color": "green"
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
    layout: "cose", // Default. This may not good for a big network.
    layoutChoices: ["cose", "random", "circle", "concentric", "grid"],
    // To manage the selected nodes for filtering
    selected: new Set(),
    // To manage the selected edges.
    // Array is needed for table
    selectedEdges: [],

  }),

  computed: {
    edgeTableHeaders() {
      return [
        {
          text: '',
          value: 'id',
          align: 'start'
        },
        {
          text: 'Shared Genes',
          value: 'numSharedGenes'
        },
        {
          text: 'Overlap pvalue',
          value: 'hypergeometricScore'
        }
      ]
    },
  },

  watch: {
    nodeFDRFilter() {
      this.updateNetwork()
    },
    network() {
      this.updateNetwork()
    },
    layout() {
      this.doLayout()
    },
    tabledPathways() {
      this.updateNetwork()
    }
  },

  methods: {
    select(evt) {
      if (evt.target.isNode()) {
        this.selected.add(evt.target.data('id'))
        this.$emit("selectionChanged", this.selected)
      }
      else if (evt.target.isEdge()) {
        // Cannot push the target into selectedEdges. A very expensive step!!!
        this.selectedEdges.push(this.createEdgeRow(evt.target)) // The target object is kept
      }
    },

    unselect(evt) {
      if (evt.target.isNode()) {
        this.selected.delete(evt.target.data('id'))
        this.$emit("selectionChanged", this.selected)
      }
      else if (evt.target.isEdge()) {
        let index = -1
        for (let i = 0; i < this.selectedEdges.length; i++) {
          let edge = this.selectedEdges[i]
          if (edge.id === evt.target.data('id')) {
            index = i
            break;
          }
        }
        if (index > -1)
          this.selectedEdges.splice(index, 1)
      }
    },

    createEdgeRow(e) {
      return {
        "id": e.data('id'),
        "numSharedGenes": e.data('numSharedGenes'),
        'hypergeometricScore': e.data('hypergeometricScore'),
      }
    },

    doLayout() {
      if (!this.cy) return
      this.cy.layout({ name: this.layout }).run()
      this.cy.center()
      this.cy.fit()
    },

    // 600px is hard-coded in VueCytoscape. Modify it here. This is not good!
    // See: https://github.com/rcarcasses/vue-cytoscape/issues/47
    preConfig() {
      var el = document.getElementById('cytoscape-div');
      if (el && el.style) {
        el.style.minHeight = "300px"
        el.style.height = "300px"
      }
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
      // check pathway nodes based on annotation
      let nodes = this.cy.nodes()
      removed = this.cy.collection();
      if (nodes != null) {
        for (let i = 0; i < nodes.length; i++) {
          // Check if this pathway is included
          let stId = nodes[i].data('id')
          let isFound = false
          for (let j = 0; j < this.tabledPathways.length; j++) {
            if (stId === this.tabledPathways[j].stId) {
              isFound = true
              break
            }
          }
          if (!isFound) {
            removed = removed.union(nodes[i])
          }
        }
      }
      if (removed.length > 0)
        this.cy.remove(removed)
      // Add a new data
      nodes = this.cy.nodes()
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
      this.selected.clear() // reset selected
      this.selectedEdges.length = 0
    },

    reset() {
      if (!this.cy) return
      this.cy.center()
      this.cy.fit()
    }
  },
};
</script>

<!-- <style style scope>
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

.legendBtn {
  position: absolute;
  top: 4px;
  right: 4px;
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

.edgeInfoCard {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 300px;
  font-size: 80%;
}
</style> -->
<!-- Most of the code here is copied from CyInstance.vue in the reactome-immport-ws project:
     https://github.com/VIOLINet/reactome-immport-web/blob/master/src/components/ImmportResults/Cytoscape/CyInstance.vue -->
<template>
  <!-- Ref: https://rcarcasses.github.io/vue-cytoscape/installation.html#usage. Apparently the original code doesn't work
  as described here. Therefore, Tim has customized the behavior using methods in this component. --> 
  <cytoscape ref="cy" :config="cyConfig" 
            :preConfig="preConfig" 
            :afterCreated="afterCreated" 
            style="min-height: 300px;">
  </cytoscape>
</template>

<script>

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
      default: 1.0E-4,
    }
  },
  // This is a function
  data: () => ({
    cyConfig: {
      style: [
        {
          selector: "node",
          style: {
            label: "data(id)",
            "background-color": "data(weightedTDLColorHex)",
            "border-width": 5,
            "border-color": "mapData(fdr, 0, 1, yellow, green)"
          },  
        },
        {
          selector:"node:selected",
          style: {
            "border-width": 7
          }
        },
        {
          selector: "edge",
          style: {
            width: "mapData(hypergeometricScore, 0,1, .5,50)"
          }
        }
      ]
    },
    // Used to filter edges
    edgeHypergeometricScoreFilter: 1.0E-60,
  }),

  watch: {
    nodeFDRFilter() {
      this.updateNetwork()
    },
    network() {
      this.updateNetwork()
    }
  },

  methods: {
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
      // Remove all network nodes first
      this.cy.elements().remove()
      this.cy.add(this.network)
      var removed = this.cy.elements('edge[hypergeometricScore >= ' + this.edgeHypergeometricScoreFilter + ']')
      this.cy.remove(removed)
      removed = this.cy.elements('node[fdr >= ' + this.nodeFDRFilter + ']')
      this.cy.remove(removed)
      this.cy.layout({name: 'cose'}).run()
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
}
</style>
<template>
  <v-container fluid>
    <v-card outlined class="cyCard">
      <cytoscape ref="cy" :config="config" :afterCreated="afterCreated"></cytoscape>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "CyInstance",
  props: {
    cyElementsProp: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    config: {
      style: [
        {
          selector: "node",
          style: {
            width: "9",
            height: "9",
            label: "data(name)",
            "font-size": "6px",
            shape: "ellipse",
            "background-color": "#00CC00",
            "border-color": "#00CC00",
            "background-opacity": ".4",
            color: "white"
          }
        },
        {
          selector: "node:selected",
          style: {
            "border-width": "6px",
            "border-color": "#AAD8FF",
            "border-opacity": "0.5",
            "text-outline-color": "#0bb50b"
          }
        },
        {
          selector: "node[degree == 0]",
          style: {
            shape: "hexagon"
          }
        },
        {
          selector: "node[degree == 1]",
          style: {
            shape: "square"
          }
        },
        {
          selector: "node.showClusters",
          style: {
            "background-color": "data(clusterColor)"
          }
        },
        {
          selector: "edge",
          style: {
            "curve-style": "bezier",
            "line-color": "#bbb",
            width: "1",
            "overlay-padding": "20px"
          }
        },
        {
          selector: "edge.shared",
          style: {
            "line-color": "#00F",
            width: "1.5"
          }
        },
        {
          selector: "edge:selected",
          style: {
            "line-color": "#FF0000",
            width: "2"
          }
        }
      ],
      layout: {
        name: "cose"
      },
      maxZoom: 5,
      minZoom: 0.2
    }
  }),
  methods: {
    afterCreated(cy) {
      this.cy = cy;
      this.cy.add(this.cyElementsProp);
      this.cy.layout({ name: "concentric" }).run();
    }
  }
};
</script>

<style scoped>
.cyCard {
    position: relative;
}
</style>
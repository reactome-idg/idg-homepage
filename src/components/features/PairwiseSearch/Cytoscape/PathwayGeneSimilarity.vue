<template>
  <div id="cy"></div>
</template>

<script>
import cytoscape from "cytoscape";
// import popper from "cytoscape-popper";
// import tippy from 'cytoscape-popper';
export default {
  name: "PathwayGeneSimilarity",
  props: {
    network:{
      type: Array,
      default: () => []
    }
  },
  data: () => ({ 
    cyStyles: [
        {
          selector: "node",
          style: {
            label: "data(id)",
            "background-color": "data(weightedTDLColorHex)",
            "border-width": 3,
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
            width: "mapData(numSharedGenes, 0,1000, .5,50)"
          }
        }
    ],
  }),
  mounted() {
    // cytoscape.use(popper)
    let cy = cytoscape({
      container: document.getElementById("cy"),
      elements: this.network,
      style: this.cyStyles,
      layout: {name: 'random'}
    });

    this.cy = cy;

    this.cy.on('select', 'node', (e) => {
      console.log(`${e.target.id()} was selected`)
      this.$emit('selectedPathway', e.target.id())
    });

    // this.cy.ready(() => {
    //   this.cy.elements().forEach((el) => {
    //     this.makePopper(el);
    //   })
    // })

    // this.cy.elements().unbind('mouseover');
    // this.cy.elements().bind('mouseover', (event) => event.target.tippy.show());

    // this.cy.elements().unbind('mouseout');
    // this.cy.elements().bind('mouseout', (event) => event.target.tippy.hide());

    // this.cy.elements().unbind('drag');
    // this.cy.elements().bind('drag', (event) => event.target.tippy.popperInstance.update());
    
  },
  // methods: {
  //   makePopper(element){
  //     let ref = element.popperRef()
  //     element.tippy = tippy(document.createElement('div'), {
  //     // popperInstance will be available onCreate
  //     lazy: false,
  //     followCursor: 'true',
  //     hideOnClick: false,
  //     flipOnUpdate: true,
  //     onShow(instance) {
  //       instance.popperInstance.reference = ref
  //     },
  //   });
  //     element.tippy.setContent('Node ' + element.id());
  //   }
  // }

};
</script>

<style style>
#cy {
  min-height: 600px;
}
</style>
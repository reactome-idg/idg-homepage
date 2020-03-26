<template>
  <v-container mb-5>
    <v-container>
        <p class="display-2">IDG Reactome Dcumentation</p>
      </v-container>
    <DocumentationLinks />
      <v-content class="text-left">
        <v-container>
          <h2 class="borderBottom">Funtional Interaction View</h2>
          <img :src="'/assets/Documentation/images/FIView.png'" class="images" />
          <v-container>
            <span v-html="FIDoc"></span>
          </v-container>
        </v-container>
        <v-container>
          <h2 class="borderBottom">TCRD Overlays</h2>
          <img :src="'/assets/Documentation/images/TCRDOverlayForm.png'" class="images-50" alt="Form for choosing TCRD Overlays">
          <v-container>
            <span v-html="TCRDOverlayDoc"></span>
          </v-container>
        </v-container>
        <v-container>
          <h2 class="borderBottom">Choosing Pairwise Interactor Views</h2>
          <img :src="'/assets/Documentation/images/PairwiseRelationshipForm.png'" class="images-50" alt="Pairwise Relationship Form">
          <v-container >
            <span v-html="PairwiseInteractorFormDoc"></span>
          </v-container>
        </v-container>
      </v-content>
  </v-container>
</template>

<script>
import DocumentationLinks from "../components/features/Documentation/DocumentationLinks"
import FIDoc from "raw-loader!../../public/assets/Documentation/text/FIDoc.html"
import TCRDOverlayDoc from "raw-loader!../../public/assets/Documentation/text/TCRDOverlayDoc.html"
import PairwiseInteractorFormDoc from "raw-loader!../../public/assets/Documentation/text/PairwiseInteractorFormDoc.html"

export default {
  name: "Documentation",
  components: {
    DocumentationLinks,
  },
  data() {
    return {
      FIDoc: FIDoc,
      TCRDOverlayDoc: TCRDOverlayDoc,
      PairwiseInteractorFormDoc: PairwiseInteractorFormDoc
    }
  }
}
</script>

<style scoped>
.borderBottom {
  border-bottom: 1px solid #c0c0c0;
  margin-bottom: 1em;
}
.images {
  max-width:100%;
}
.images-50 {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
</style>
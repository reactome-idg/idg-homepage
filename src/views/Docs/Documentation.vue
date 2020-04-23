<template>
  <v-container mb-5>
    <v-container>
      <p class="display-2">IDG Reactome Dcumentation</p>
    </v-container>
    <DocumentationLinks />
    <v-content class="text-left">
      <v-container>
        <h2 class="borderBottom">Funtional Interaction View</h2>
        <img :src="'/assets/doc/images/FIView.png'" class="images" />
        <v-container>
          <span v-html="docs.FIDoc"></span>
        </v-container>
      </v-container>
      <v-container>
        <h2 class="borderBottom">TCRD Overlays</h2>
        <img
          :src="'/assets/doc/images/TCRDOverlayForm.png'"
          class="images-50"
          alt="Form for choosing TCRD Overlays"
        />
        <v-container>
          <span v-html="docs.TCRDOverlayDoc"></span>
        </v-container>
      </v-container>
      <v-container>
        <h2 class="borderBottom">Choosing Pairwise Interactor Views</h2>
        <img
          :src="'/assets/doc/images/PairwiseRelationshipForm.png'"
          class="images-50"
          alt="Pairwise Relationship Form"
        />
        <v-container>
          <span v-html="docs.PairwiseInteractorFormDoc"></span>
        </v-container>
      </v-container>
      <v-container>
        <h2 class = "borderBottom">Drug/Target Overlay</h2>
        <img :src="'/assets/doc/images/DrugsInFIView.png'" class="images-50" alt="Drugs in FIView">
        <v-container>
          <span v-html="docs.DrugTargetDoc"></span>
        </v-container>
      </v-container>
      <v-container>
        <h2 class="borderBottom">Pairwise Popups</h2>
        <v-container style="justify-content: center;">
          <img :src="'/assets/doc/images/PairwisePopup.png'" class="images-50-inline" alt="Pairwise Popup image">
          <img :src="'/assets/doc/images/DrugPopup.png'" class="images-50-inline" alt="Drug/Target Popup image">
        </v-container>
        <v-container>
          <span v-html="docs.IDGPopupDoc"></span>
        </v-container>
      </v-container>
    </v-content>
  </v-container>
</template>

<script>
import DocumentationLinks from "../../components/features/Documentation/DocumentationLinks";
import FIDoc from "raw-loader!../../../public/assets/doc/text/FIDoc.html";
import TCRDOverlayDoc from "raw-loader!../../../public/assets/doc/text/TCRDOverlayDoc.html";
import PairwiseInteractorFormDoc from "raw-loader!../../../public/assets/doc/text/PairwiseInteractorFormDoc.html";
import IDGPopupDoc from "raw-loader!../../../public/assets/doc/text/IDGPopupDoc.html"
import DrugTargetDoc from "raw-loader!../../../public/assets/doc/text/DrugTargetDoc.html"

export default {
  name: "Documentation",
  components: {
    DocumentationLinks
  },
  data() {
    return {
      docs: {
        FIDoc: FIDoc,
        TCRDOverlayDoc: TCRDOverlayDoc,
        PairwiseInteractorFormDoc: PairwiseInteractorFormDoc,
        IDGPopupDoc: IDGPopupDoc,
        DrugTargetDoc : DrugTargetDoc
      }
    };
  }
};
</script>

<style scoped>
.borderBottom {
  border-bottom: 1px solid #c0c0c0;
  margin-bottom: 1em;
}
.images {
  width: 100%;
}
.images-50 {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 50%;
  max-height: 40em;
}
.images-50-inline {
  display: inline;
  max-width: 50%;
  max-height: 40em;
  margin: 0 auto;
}
</style>
<template>
  <v-container>
    <v-container>
        <p class="display-2">IDG Reactome Dcumentation</p>
      </v-container>
    <DocumentationLinks />
      <v-content class="text-left">
        <v-container>
          <h2 class="borderBottom">Funtional Interaction View</h2>
          <p></p>
        </v-container>
      </v-content>
  </v-container>
</template>

<script>
import DocumentationLinks from "../components/features/Documentation/DocumentationLinks"

export default {
  name: "Documentation",
  components: {
    DocumentationLinks
  }
}
</script>

<style scoped>
.borderBottom {
  border-bottom: 1px solid #c0c0c0;
}

</style>
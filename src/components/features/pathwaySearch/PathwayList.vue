<template>
  <v-container>
    <v-row>
      <v-expansion-panels tile hover popout>
        <v-expansion-panel v-for="pathway in pathways" :key="pathway.id">
          <div>
            <v-expansion-panel-header>
              <p>
                <a :href="'/PathwayBrowser/#/' + pathway.stableIdentifier" class="text-left font-weight-bold pathwayLink">{{pathway.pathwayName}}</a>
              </p>
              <span>
                <b>Stable Identifier:</b>
                {{pathway.stableIdentifier}}
              </span>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="text-left">
              <p class="font-weight-bold">Description</p>
              <p>{{pathway.description}}</p>
              <v-content v-if="pathway.overlayEntities">
                <p class="font-weight-bold">Overlayed Entities</p>
                <v-row>
                  <v-col
                    v-for="(item, index) in pathway.overlayEntities"
                    :key="index"
                    cols="6"
                    md="2"
                    sm="4"
                    class="small-text"
                  >{{item}}</v-col>
                </v-row>
              </v-content>
              <a v-bind:href="'/PathwayBrowser/#/' + pathway.stableIdentifier" class="no-decorators">
                <v-btn class="ma-2" tile color="indigo" dark>Open in Pathway Browser</v-btn>
              </a>
            </v-expansion-panel-content>
          </div>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "PathwayList",
  props: ["pathways"]
};
</script>

<style scoped>
.no-decorators {
  text-decoration: none;
}
.pathwayLink {
  text-decoration: none;
  color: blue;
}
.pathwayLink:hover {
  color: black;
}
.small-text {
  font-size: small;
}
</style>
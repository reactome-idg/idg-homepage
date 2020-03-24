<template>
  <v-container>
      <v-row>
        <v-expansion-panels tile hover popout>
          <v-expansion-panel v-for="pathway in pathways" :key="pathway.id">
            <v-expansion-panel-header>
              <p>
                <a href="#" class="text-left font-weight-bold pathwayLink">{{pathway.pathwayName}}</a>
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
                    cols="2"
                    class="small-text"
                  >{{item}}</v-col>
                </v-row>
              </v-content>
              <a href="#" class="no-decorators"><v-btn class="ma-2" tile color="indigo" dark>Open in Pathway Browser</v-btn></a>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-container>
</template>

<script>
export default {
    name: "PathwayList",
    props: ["pathways"]
}
</script>

<style scoped>
.no-decorators{
    text-decoration: none;
}
.pathwayLink {
  text-decoration: none;
  color: blue;
}
.pathwayLink:hover {
  color: black;
}
.label {
  font-weight: bold;
}
.small-text {
  font-size: small;
}
</style>
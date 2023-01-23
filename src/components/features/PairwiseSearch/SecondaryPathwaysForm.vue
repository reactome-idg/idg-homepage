<template :dark="darkmode">
  <div class="full-width">
    <v-card :dark="darkmode" outlined class="pt-5">
      <v-btn icon class="closeBtn" title="close" @click="$emit('close')">
        <v-icon>{{ mdiClose }}</v-icon>
      </v-btn>
      <v-card-text class="text-left justify-left">
        <h4 class="text-left pb-2">Choose individual pairwise relationship data sources</h4>
        <v-card :dark="darkmode" outlined>
          <v-card-text>
            <v-row align="center" justify="center">
              <v-col cols="12" md="6">
                <label for="types" class="left">Select a relationship type</label>
                <select name="types" id="types" @change="cascadeDataType" class="ma-2"
                  :class="darkmode ? 'selectionDropDownDark' : 'selectionDropDown'" v-model="dataType">
                  <option v-for="(type, index) in types" :key="index" :value="type">{{ type }}</option>
                </select>
              </v-col>
              <v-col cols="12" md="6">
                <label for="provenances">Select a data resource</label>
                <select name="provenances" id="provenances" :disabled="!dataType" @change="cascadeProvenance"
                  class="ma-2" :class="darkmode ? 'selectionDropDownDark' : 'selectionDropDown'" v-model="provenance">
                  <option v-for="(provenance, index) in provenances" :key="index" :value="provenance">{{ provenance }}
                  </option>
                </select>
              </v-col>
              <v-col cols="12" md="6">
                <label for="bioSources">Select a biosource</label>
                <select name="bioSources" id="bioSources" :disabled="!provenance" @change="cascadeBioSource"
                  class="ma-2" :class="darkmode ? 'selectionDropDownDark' : 'selectionDropDown'" v-model="bioSource">
                  <option v-for="(bioSource, index) in bioSources" :key="index" :value="bioSource">{{ bioSource }}
                  </option>
                </select>
              </v-col>
              <v-col cols="12" md="4">
                <div v-if="bioSource && origins.length > 0">
                  <label for="origin">Select a data source</label>
                  <select name="origin" id="origin" class="ma-2"
                    :class="darkmode ? 'selectionDropDownDark' : 'selectionDropDown'" v-model="origin">
                    <option v-for="(origin, index) in origins" :key="index" :value="origin">{{ origin }}</option>
                  </select>
                </div>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn small color="var(--secondary-color)" @click="addRelationship">Add</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-row align="center" justify="center" class="mt-5">
          <v-col cols="12" md="8">
            <v-chip v-for="(rel, index) in relationshipTypes" :key="index" close :close-icon="mdiCloseCircle"
              @click:close="remove(rel)">{{ rel }}</v-chip>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn :dark="darkmode" color="var(--primary-color)" class="btn-primary"
              @click="searchSecondaryPathways">Search</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="errors">{{ computedErrors }}</v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
//import PairwiseService from "../../../service/PairwiseService";
import { VCard, VCardText, VCol, VRow, VBtn, VChip } from "vuetify/lib";
import vuetify from "../../../plugins/vuetify"
import { mdiMenuDown, mdiCloseCircle, mdiClose } from "@mdi/js";
export default {
  name: "SecondaryPathwayForm",
  components: {
    VCard,
    VCardText,
    VCol,
    VRow,
    VBtn,
    VChip,
  },
  vuetify,
  props: {
    errors: {
      type: Array,
      default: () => [],
    },
    initialDescs: {
      type: Array,
      default: () => [],
    },
    darkmode: {
      type: Boolean,
      default: () => false,
    },
    term: {
      type: String,
      default: () => null
    }
  },
  data: () => ({
    mdiMenuDown,
    mdiCloseCircle,
    mdiClose,
    dataDescs: [],
    relationshipTypes: [],
    error: "",
    dataType: null,
    provenance: null,
    bioSource: null,
    origin: null,
    dialog: false,
  }),
  computed: {
    types() {
      return [...new Set(this.dataDescs.map((desc) => desc.dataType))];
    },
    provenances() {
      return [
        ...new Set(
          this.dataDescs
            .filter((desc) => desc.dataType == this.dataType)
            .map((desc) => desc.provenance)
        ),
      ];
    },
    bioSources() {
      return [
        ...new Set(
          this.dataDescs
            .filter(
              (desc) =>
                desc.provenance == this.provenance &&
                desc.dataType == this.dataType
            )
            .map((desc) => desc.bioSource)
        ),
      ];
    },
    origins() {
      var origins = [
        ...new Set(
          this.dataDescs
            .filter(
              (desc) =>
                desc.dataType == this.dataType &&
                desc.provenance == this.provenance &&
                desc.bioSource == this.bioSource
            )
            .map((desc) => desc.origin)
        ),
      ].filter((item) => item !== undefined);
      return origins;
    },
    computedErrors() {
      var computedErrors = "";
      if (this.errors.length > 0)
        computedErrors = computedErrors + this.errors.join(", ");
      if (this.error.length > 0) computedErrors = computedErrors + this.error;
      return computedErrors;
    },
  },
  watch: {
    types(val) {
      if (val.length > 0)
        this.dataType = val[0];
    },
    provenances(val) {
      if (val.length > 0)
        this.provenance = val[0];
    },
    bioSources(val) {
      if (val.length > 0)
        this.bioSource = val[0];
    },
    origins(val) {
      if (val.length > 0)
        this.origin = val[0]
    },
    relationshipTypes(val) {
      if (val.length > 6) this.$nextTick(() => this.relationshipTypes.pop());
    },
  },
  mounted() {
    this.relationshipTypes.push(...this.initialDescs);
  },
  created() {
    let data_descriptions_text = sessionStorage.getItem("dataDescriptions");
    let tmpDataDesc= undefined;
    if (data_descriptions_text) {
        tmpDataDesc = JSON.parse(data_descriptions_text);
    } else {
        tmpDataDesc = "TODO"
    }
    let dataDescriptions = tmpDataDesc;

    this.dataDescs = dataDescriptions;
  },
  // async created() {
  //   try {
  //     this.dataDescs = await PairwiseService.getDataDescs(this.term);
  //   } catch (err) {
  //     this.error = err.message;
  //   }
  // },
  methods: {
    searchSecondaryPathways() {
      if (this.relationshipTypes.length < 1) {
        this.error = "Choose at least one source";
        return;
      }
      this.$emit("searchSecondaryPathways", {
        dataDescriptions: this.relationshipTypes,
        digitalKeys: this.dataDescs.filter(desc => this.relationshipTypes.includes(desc.id)).map(desc => desc.digitalKey)
      });
      this.dialog = false;
    },
    addRelationship() {
      this.error = "";
      var desc = `${this.provenance}|${this.bioSource}|${this.dataType}`;
      if (this.origin != null) {
        desc = `${desc}|${this.origin}`;
      }
      if (desc.length > 100) desc = desc.substring(0, 100);

      //check to see if this is a valid datadesc id
      if (this.dataDescs.map((type) => type.id).indexOf(desc) === -1) {
        this.error =
          "This is not a valid option set. Please select choices from the drop down menus.";
        return;
      }

      //check to make sure this desc hasn't already been added
      if (this.relationshipTypes.indexOf(desc) === -1) {
        this.relationshipTypes.push(desc);
      } else this.error = "This interactor set has already been added.";
    },
    cascadeDataType() {
      this.provenance = null;
      this.bioSource = null;
      this.origin = null;
    },
    cascadeProvenance() {
      this.bioSource = null;
      this.origin = null;
    },
    cascadeBioSource() {
      this.origin = null;
    },
    remove(rel) {
      this.relationshipTypes = this.relationshipTypes.filter(
        (type) => type !== rel
      );
    },
  },
};
</script>

<style>
@import "../../../../node_modules/vuetify/dist/vuetify.min.css";

.errors {
  color: red;
}

.selectionDropDownDark {
  color: white;
  border-bottom: 1px solid white;
  width: 100%;
}

.selectionDropDownDark:disabled {
  border-bottom: 1px dotted white;
}

.selectionDropDown {
  color: black;
  border-bottom: 1px solid darkgrey;
  width: 100%;
}

.selectionDropDown:disabled {
  border-bottom: 1px dotted darkgrey;
}

.primaryBtn {
  background-color: #1976D2;
}

.secondaryBtn {
  background-color: #424242;
}

.closeBtn {
  position: absolute;
  top: 0;
}

.full-width {
  width: 100%;
}
</style>
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);
const vuetify = new Vuetify({});

if (process.env.VUE_APP_WEB_COMPONENT === "true") {
  vuetify.framework.theme.checkOrCreateStyleElement = function() {
    if (!this.styleEl) this.genStyleElement();
    return Boolean(this.styleEl);
  };

  // Monkey patch querySelector to properly find root element
  const { querySelector } = document;
  document.querySelector = function(selector) {
    return querySelector.call(this, selector);
  };
}

export default vuetify;

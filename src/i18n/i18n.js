import Vue from "vue";
import VueI18n from "vue-i18n";
import en from "vee-validate/dist/locale/en.json";

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: "en",
  messages: {
    en: {
      fields: {
        user: "User Name",
        name: "Client Name",
        password: "Password",
        number: "Client Number",
        mobile: "Mobile Number",
      },
      validation: en.messages
    }
  }
});

export { i18n };

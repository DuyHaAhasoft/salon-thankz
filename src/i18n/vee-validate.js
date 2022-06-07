import { extend, configure } from "vee-validate";
import { required, min, max, min_value, max_value, between, email, regex, alpha_dash } from "vee-validate/dist/rules";
import { i18n } from "./i18n";

configure({
  defaultMessage: (field, values) => {
    // override the field name.
    values._field_ = i18n.t(`fields.${field}`);

    return i18n.t(`validation.${values._rule_}`, values);
  }
});

// Install required rule and message.
extend("required", required);

// Install min rule and message.
extend("min", min);

// Install max rule and message.
extend("max", max);

// Install min_value rule and message.
extend("min_value", min_value);

// Install max_value rule and message.
extend("max_value", max_value);

// Install between rule and message.
extend("between", between);

// Install email rule and message.
extend("email", email);

// Install regex rule and message.
extend("regex", regex);

// Install alpha_dash rule and message
extend("alpha_dash", alpha_dash)
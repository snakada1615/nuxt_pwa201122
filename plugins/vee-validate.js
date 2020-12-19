import Vue from 'vue'
import {
  extend,
  ValidationProvider,
  ValidationObserver,
} from 'vee-validate'

import {
  required,
  email,
  max_value,
  min_value,
  numeric,
  max,
  min
} from 'vee-validate/dist/rules'

import { messages } from 'vee-validate/dist/locale/en.json'

extend('required', {
  ...required,
  message: messages['required']
});

extend('max_value', {
  ...max_value,
  message: messages['max_value']
});

extend('min_value', {
  ...min_value,
  message: messages['min_value']
});

extend('numeric', {
  ...numeric,
  message: messages['numeric']
});

extend('email', {
  ...email,
  message: messages['email']
});

extend('max', {
  ...max,
  message: messages['max']
});

extend('min', {
  ...min,
  message: messages['min']
});

Vue.component('validation-provider', ValidationProvider)
Vue.component('validation-observer', ValidationObserver)

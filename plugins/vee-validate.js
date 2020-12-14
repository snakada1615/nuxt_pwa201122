import Vue from 'vue'
import {
  extend,
  ValidationProvider,
  ValidationObserver,
} from 'vee-validate'

import { required, email, max } from 'vee-validate/dist/rules'

extend('required', required)
extend('email', email)
extend('max', max)

Vue.component('validation-provider', ValidationProvider)
Vue.component('validation-observer', ValidationObserver)

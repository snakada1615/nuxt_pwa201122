<template>
  <validation-provider :rules="rules" v-slot="{ errors, valid }" name="baka">
    <b-form-group
      id="fieldset-1"
      label="Last Name"
      label-for="b-input"
      :invalid-feedback="errors[0]"
      :state="valid"
    >
    <b-form-input
      id="b-input"
      :type="type"
      :name="name"
      :value="value"
      :placeholder="placeholder"
      @input.native="updateValue"
    />
    </b-form-group>
  </validation-provider>
</template>

<script>
  import Fa from 'vue-fa'
  import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

  export default {
    components:{
      Fa
    },
    name: "MyInput",
    data(){
      return {
        faExclamationCircle
      }
    },
    props: {
      value: { type: String, required: true },
      type: { type: String, required: true },
      name: { type: String, required: true },
      placeholder: { type: String, required: false },
      rules:{
        type: String,
        required:true
      },
    },
    methods: {
      updateValue: function(e) {
        this.$emit("input", e.target.value);
      }
    }
  };
</script>

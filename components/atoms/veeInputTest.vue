<template>
  <validation-provider :name="name" :rules="rules" v-slot="{ errors, valid }">
    <b-input-group>
      <template #append>
        <b-input-group-text v-show="!valid" class="bg-light border-danger">
          <b-badge v-b-tooltip.hover :title="errors[0]" class="text-danger bg-light">
            <Fa :icon="faExclamationCircle"/>
          </b-badge>
        </b-input-group-text>
      </template>
      <b-form-input
        class="bg-light"
        :class="{ 'border-danger': !valid, 'border-info':valid }"
        :type="type"
        :value="value"
        :placeholder="placeholder"
        @input.native="updateValue"
      />
    </b-input-group>

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

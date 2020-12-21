<template>
  <validation-provider immidiate :name="name" :rules="rules" v-slot="{ errors, valid }">
    <b-input-group>
      <template #append>
        <b-input-group-text
          class="bg-light"
          :class="{ 'border-danger': !valid, 'border-info':valid }">
          <div v-show="valid" class="text-info bg-light">
            <Fa :icon="faCheck"/>
          </div>
          <b-badge v-show="!valid" v-b-tooltip.hover :title="errors[0]" class="text-danger bg-light">
            <Fa :icon="faExclamationCircle"/>
          </b-badge>
        </b-input-group-text>
      </template>
      <b-form-input
        class="bg-light"
        :class="{ 'border-danger': !valid, 'border-info':valid }"
        :value="value"
        @input.native="updateValue"
        v-bind="$attrs"
      />
    </b-input-group>

  </validation-provider>
</template>

<script>
  import Fa from 'vue-fa'
  import { faExclamationCircle, faCheck } from '@fortawesome/free-solid-svg-icons'

  export default {
    components:{
      Fa, faCheck
    },
    name: "MyInput",
    data(){
      return {
        faExclamationCircle, faCheck
      }
    },
    props: {
      value: { required: true },
      name: { type: String, required: true },
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

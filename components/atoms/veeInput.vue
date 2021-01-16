<template>
  <validation-provider :mode="mode" :name="name" :rules="rules" v-slot="{ errors, valid }">
    <b-input-group size="sm">
      <div hidden name="isvalid" :class="{ 'is-valid': valid }"/>
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
        :placeholder="placeholder"
        :class="{ 'border-danger': !valid, 'border-info':valid }"
        :name="inputName"
        :type="type"
        :value="value"
        size="sm"
        @input.native="$emit('input', $event.target.value)"
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
    data(){
      return {
        faExclamationCircle,
        faCheck,
      }
    },
    props: {
      name: { type: String, required: true },
      rules:{
        type: String,
        required:true
      },
      placeholder:'',
      type: '',
      value:'',
      mode:{
        type: String,
        default: 'eager'
      }
    },
    computed:{
      inputName(){
        return this.name + '_input'
      },
      valueTemp() {
        return this.value
      },
    },
  };
</script>

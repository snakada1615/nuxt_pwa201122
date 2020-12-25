<template>
  <b-form inline>
    <span v-if="labelLeft"><slot name="labelLeft">{{ labelLeft }}</slot></span>

    <b-form-checkbox
      switch
      class="mr-0 ml-1"
      :name="name"
      :value="value"
      :checked="input === value"
      @change="updateValue"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />
    <span v-if="labelRight" class="mx-0 px-0">
      <slot name="labelRight">{{ labelRight }}</slot>
    </span>
    <slot></slot>
  </b-form>
</template>

<script>
  export default {
    model: {
      prop: 'checked',
      event: 'input'
    },

    props: {
      value: {},
      checked: {},
      labelLeft: { type: String },
      labelRight: { type: String },
      name: { type: String, require: true }
    },

    computed: {
      group () {
        return ('$parent' in this && this.$parent.$options.name === 'vue-group') ? this.$parent : null
      },
      input () {
        return this.group ? this.group.value : this.checked
      }
    },

    methods: {
      updateValue (e) {
        let value = e ? true : false
        if (this.group) {
          this.group.$emit('input', value)
          this.group.$emit('checked', value)
        } else {
          this.$emit('input', value)
          this.$emit('checked', value)
        }
      }
    }
  }
</script>

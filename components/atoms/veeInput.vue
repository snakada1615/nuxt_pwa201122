<template>
  <validation-provider :rules="rules" v-slot="{ errors, valid }">
  <input
    :class="{ [$style.isFalse]: !valid }"
    :type="type"
    :name="name"
    :value="value"
    :placeholder="placeholder"
    @input="updateValue"
  />
    <span>{{ errors[0] }}</span>
  </validation-provider>
</template>

<script>
  export default {
    name: "MyInput",
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

<style module>
  .isFalse{
    background-color: #FFA4A2;
    color: #EB0600;
  }
</style>

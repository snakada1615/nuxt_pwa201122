<template>
  <b-container>
    <div>validation test</div>
    <vee-input
      v-model="email"
      placeholder="サンプル"
      name="sample-input"
      type="text"
      rules="email"
    ></vee-input>
    <vee-input
      v-model="email2"
      placeholder="サンプル"
      name="sample-input2"
      type="text"
      rules="max_value:5"
    ></vee-input>
  </b-container>
</template>

<script>
  import veeInput from '~/components/atoms/veeInput';

  export default {
    components: {
      veeInput,
    },
    data(){
      return{
        value: '',
        email: '',
        email2: ''
      }
    }
  };
</script>

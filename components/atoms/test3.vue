<template>
  <b-container>
    halo
    <b-button @click="onClick">push me</b-button>
  </b-container>
</template>


<script>
  export default {
    methods:{
      /**
       * triggered when user click button
       */
      onClick(){
        /**
         * explanation test01
         */
        this.$emit('myClickTest01', 'baka')
        /**
         * @event myClickTest02
         */
        this.$emit('myClickTest02', 'aho')
      }
    },
  }
</script>

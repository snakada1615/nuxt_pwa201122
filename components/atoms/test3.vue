<template>
  <b-container>
    halo
    <b-button @click="onClick">push me</b-button>
  </b-container>
</template>


<script>
  export default {
    methods:{
      onClick(){
        this.$emit('myClickTest01', 'baka')
        this.$emit('myClickTest02', 'aho')
      }
    },
  }
</script>

<template>
 <b-form-group class="my-0">
   <label class="my-0" style="font-size: 14
   px">{{labelLeft}}</label>
   <b-form-checkbox size="sm" switch inline v-bind="$attrs" id="check01" class="my-0">{{labelRight}}</b-form-checkbox>
 </b-form-group>
</template>

<script>
  export default {
    props:{
      labelLeft: '',
      labelRight:'',
      leftColor:'',
      rightColor:''
    }
  }
</script>

<style>
  .custom-control-label:before{
    background-color:red;
  }
</style>

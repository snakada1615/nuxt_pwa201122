<template>
  <diversity-check
    :prop-selected="propSelected"
    @change="updateValue"
    :prop-options="options"
  ></diversity-check>
</template>

<script>
  import diversityCheck from "../components/organisms/diversityCheck";

  export default {
    components: {
      diversityCheck
    },
    data(){
      return {
        propSelected: ['b','c'],
        options:[
          {text: 'a', value: 'a'},
          {text: 'b', value: 'b'},
          {text: 'c', value: 'c'},
          {text: 'd', value: 'd'},
          {text: 'e', value: 'e'},
        ]
      }
    },
    methods:{
      updateValue(value){
        this.propSelected = value
      }
    }
  }
</script>

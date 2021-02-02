<template>
  <b-container>
    halo music:{{myId}}
    <b-button @click="setCaseId" variant="primary">push me</b-button>
  </b-container>
</template>

<script>
  export default {
    computed:{
      myId(){
        return this.$store.state.caseId
      }
    },
    watch:{
      myId:function () {
        console.log(this.myId)
      }
    },
    methods:{
      setCaseId(){
        this.$store.dispatch('changeCaseId', 'newcase02')
      }
    }
  }
</script>


<template>
  <div>
    <left-right-switch labelLeft="per meal" labelRight="per day" name="check" v-model="vueCheck"></left-right-switch>
    -{{ vueCheck }}
  </div>
</template>

<script>
  import leftRightSwitch from "@/components/atoms/leftRightSwitch"
  export default {
    components:{
      leftRightSwitch,
    },
    data(){
      return {
        checkStatus:'',
        vueCheck:'true',
        vueCheck2:'false'
      }
    }
  }
</script>

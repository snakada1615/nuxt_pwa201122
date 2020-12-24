<template>
  <div>
    <left-right-switch
      label-left="per meal"
      label-right="per day"
    />
    <left-right-switch
      label-left="per baka"
      label-right="per aho"
    />
  </div>
</template>

<script>
  import leftRightSwitch from "@/components/atoms/leftRightSwitch"
  export default {
    components:{
      leftRightSwitch
    }
  }
</script>

leftRightSwitch example:

```vue live
<template>
  <b-container>
    <left-right-switch
      labelLeft="left message"
      labelRight="right message"
      name="check"
      v-model="test"
    />
  </b-container>
</template>
<script>
  export default {
    data(){
      return {
        test:false
      }
    },
  }

</script>
```

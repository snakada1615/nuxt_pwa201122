loginSms example:

```vue
<template>
  <b-container>
    <div>Hello world!</div>
    <b-button variant="success" @click="$bvModal.show('test')">test</b-button>
    <login-sms name="test" :uid.sync="uid"/>
    <div>user: {{uid}}</div>
  </b-container>
</template>

<script>
  import loginSms from "@/components/molecules/loginSms";

  export default {
    components:{
      loginSms
    },
    data(){
      return {
        uid:'',
      }
    }
  }
</script>
```

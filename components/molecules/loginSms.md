loginSms example:

```vue
<template>
  <b-container>
    <b-button block variant="success" 
      class="mt-2" 
      @click="$bvModal.show('loginSms')"
      @login="user=$event"
    >push email</b-button>
    <login-sms name="loginSms"/>
    {{user}}
  </b-container>
</template>

<script>
  import loginSms from "@/components/molecules/loginSms";

  export default {
    components:{
      loginSms
    },
    data() {
      return {
        user:''
      }
    },
    methods: {
    },
  }
</script>


```

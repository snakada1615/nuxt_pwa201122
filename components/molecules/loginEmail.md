loginEmail example:

```vue
<template>
  <b-container>
    <b-button variant="success"
              class="mt-2"
              @click="$bvModal.show('test')"
    >push email</b-button>
    <login-email name="test" @login="loginOk"></login-email>
    user:{{user.uid}}
  </b-container>
</template>

<script>
  import loginEmail from "@/components/molecules/loginEmail";

  export default {
    components:{
      loginEmail
    },
    data() {
      return {
        user:''
      }
    },
    methods:{
      loginOk(val){
        this.user = val
        console.log('loginOk')
        console.log(this.user)
      }
    }
  }
</script>

```

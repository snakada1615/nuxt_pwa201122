loginEmail example:

```vue
<template>
  <b-container>
    <div>Hello world!</div>
    <b-button variant="success" @click="$bvModal.show('test')">test</b-button>
    <login-email id="test" :uid.sync="uid" :email.sync="email"/>
    <div>user: {{uid}}</div>
    <div>email: {{email}}</div>
  </b-container>
</template>

<script>
  import loginEmail from "@/components/molecules/loginEmail";

  export default {
    components:{
      loginEmail
    },
    data(){
      return {
        uid:'',
        email:'',
      }
    }
  }
</script>

```

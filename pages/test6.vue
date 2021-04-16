<template>
  <b-container>
    <div>Hello world!</div>
    <b-button variant="success" @click="$bvModal.show('test')">test</b-button>
    <regist-email id="test" :uid.sync="uid" :email.sync="email"/>
    <div>user: {{uid}}</div>
    <div>email: {{email}}</div>
  </b-container>
</template>

<script>
  import registEmail from "../components/molecules/registEmail";

  export default {
    components:{
      registEmail
    },
    data(){
      return {
        uid:'',
        email:'',
      }
    }
  }
</script>

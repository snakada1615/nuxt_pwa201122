<template>
  <b-container>
    halo
    <div>{{$store.state.dietCases}}</div>
    <user_login
      dialog-id="test"
    />
  </b-container>
</template>

<script>
  import user_login from "../components/molecules/user_login";
  export default {
    components:{
      user_login,
    }
  }
</script>

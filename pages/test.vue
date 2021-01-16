<template>
  <b-container>
    halo
    <b-button variant="primary" v-b-modal="'test'">login</b-button>
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

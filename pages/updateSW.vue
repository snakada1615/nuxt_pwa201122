<template>
  <b-container>
    <b-button @click="unRegister" variant="primary">update SW</b-button>
  </b-container>
</template>

<script>
  export default {
    methods: {
      unRegister(){
        navigator.serviceWorker.getRegistration()
          .then(registration => {
            registration.unregister();
          }).then(
          location.reload()
        )
      }
    },
  }
</script>

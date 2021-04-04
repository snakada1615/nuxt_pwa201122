<template>
  <b-container class="py-2">
    <b-card>
      <div>please use this buttton to fetch <span class="text-danger">latest version </span>of application</div>
      <div>current version: {{$store.state.appVersion}}</div>
      <div>latest version on server: {{$store.state.appVersion}}</div>
    </b-card>
    <b-button @click="unRegister" class="mx-2 my-2" variant="primary">update</b-button>
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

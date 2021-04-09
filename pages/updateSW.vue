<template>
  <b-container class="py-2">
    <b-card bg-variant="gray-400">
      <div>please use buttton below to fetch <span class="text-danger">latest version </span>of application</div>
      <div>current version: {{$store.state.appVersion}}</div>
      <div>latest version on server: {{$store.state.appVersion}}</div>
    </b-card>
    <b-button @click="unRegister" class="mx-2 my-2" variant="primary">update app</b-button>
    <b-card bg-variant="gray-400" class="mt-3">
      <div>please use buttton below to <span class="text-danger">remove </span>all user data</div>
      <div>to refresh database</div>
    </b-card>
    <b-button @click="deleteDb" class="mx-2 my-2" variant="primary">delete all records</b-button>
  </b-container>
</template>

<script>
  export default {
    methods: {
      unRegister() {
        navigator.serviceWorker.getRegistration()
          .then(registration => {
            registration.unregister();
          }).then(
          location.reload()
        )
      },
      deleteDb() {
        this.$store.dispatch('removeUserDb').then(function(){
          console.log('success')
          this.$router.push('/')
        }).catch(function () {
          console.log(res)
          alert('cannnot remove data')
        })
      }
    },
  }
</script>

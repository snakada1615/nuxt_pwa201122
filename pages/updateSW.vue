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
        const vm = this
        navigator.serviceWorker.getRegistration()
          .then(registration => {
            registration.unregister();
          }).then(function(){
            vm.$store.dispatch('logout')
            //location.reload()
            vm.$router.push('/')
          })
      },
      deleteDb() {
        const vm = this
        this.$store.dispatch('removeUserDb').then(function(){
          console.log('success')
          vm.makeToast('useradta successfully deleted')
          vm.$store.dispatch('logout')
          vm.$router.push('/')
        }).catch(function (err) {
          console.log(err)
          vm.makeToast('cannnot remove user data')
        })
      }
    },
  }
</script>

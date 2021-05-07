<template>
  <b-container class="py-2">
    <div v-if="$nuxt.isOnline">
      <b-row>
        <b-col cols="6" md="4" class="px-1">
          <b-card bg-variant="gray-400">
            <div>please use buttton below to fetch <span class="text-danger">latest version </span>
              of application current version: {{$store.state.appVersion}}</div>
            <b-button @click="unRegister" class="my-1" variant="info" size="sm">update app</b-button>
          </b-card>
        </b-col>
        <b-col cols="6" md="4" class="px-1">
          <b-card bg-variant="gray-400" class="mt-3">
            <div>please use buttton below to <span class="text-danger">remove </span>
              all user data to refresh database</div>
            <b-button @click="deleteDb" class="my-2" size="sm"
                      variant="info" :disabled="$store.state.loginStatus !== 1"
            >delete user records</b-button>
          </b-card>
        </b-col>
        <b-col cols="6" md="4" class="px-1">
          <b-card bg-variant="gray-400" class="mt-3">
            <div>please use buttton below to <span class="text-danger">change</span> Food Composition Table</div>
            <b-button to="selectFct" class="my-2" variant="info" size="sm">select FCT</b-button>
          </b-card>
        </b-col>
        <b-col cols="6" md="4" class="px-1">
          <b-card bg-variant="gray-400" class="mt-3">
            <div>please use buttton below to <span class="text-danger">import</span> new Food Composition Table</div>
            <b-button to="importFCT" class="my-2" variant="info" size="sm">import FCT</b-button>
          </b-card>
        </b-col>
        <b-col cols="6" md="4" class="px-1">
          <b-card bg-variant="gray-400" class="mt-3">
            <div>please use buttton below to <span class="text-danger">edit</span> current Food Composition Table</div>
            <b-button to="editFct" class="my-2" variant="info" size="sm">edit FCT</b-button>
          </b-card>
        </b-col>
        <b-col cols="6" md="4" class="px-1">
          <b-card bg-variant="gray-400" class="mt-3">
            <div>please use buttton below to <span class="text-danger">change workspace</span></div>
            <b-button to="changeWorkspace" class="my-2" variant="info" size="sm">change WS</b-button>
          </b-card>
        </b-col>
      </b-row>
    </div>
    <div v-if="!$nuxt.isOnline">this function is available when netrowk connection is available</div>
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
        vm.$store.dispatch('removeUserDoc', {
          dbName: vm.$store.getters.userDb, docId: vm.$store.getters.currentPouchID
        }).then(function(){
          vm.$store.dispatch('logout')
          vm.$router.push('/')
        }).catch(function (err) {
          $nuxt.error(err)
        })
      }
    },
  }
</script>

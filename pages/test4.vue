<template>
  <b-container>
    <div v-if="$store.state.loginStatus === 1" class="py-1">
      <div>list of workspace used by {{$store.state.user.name}}</div>
      <b-list-group v-for="elem in $store.state.caseIdList" :key="elem.id">
        <b-list-group-item class="my-1" variant="info">
          <div>name: {{$store.state.user.name}}</div>
          <div>saveDate: {{elem.saveDate}}</div>
          <div>email: {{elem.email}}</div>
          <div>workspace: {{elem.caseId}}</div>
        </b-list-group-item>
      </b-list-group>
      <b-button variant="success"
                class="mt-2"
                @click="$bvModal.show('selectWs')"
      >select / create workspace
      </b-button>
      <select-workspace
        id="selectWs"
        :workspaceList="$store.state.caseIdList"
        @workspaceSelected="setWorkspace($event,1)"
        @workspaceCreated="setWorkspace($event,2)"/>
    </div>
    <div v-else>you need to login first to change current workspace</div>
  </b-container>
</template>

<script>
  import selectWorkspace from "@/components/molecules/selectWorkspace"

  export default {
    data() {
      return {
        items: [],
      }
    },
    components: {
      selectWorkspace
    },
    methods: {
      async setWorkspace(val, flag) {
        const vm = this

        console.log('setWorkspace01')
        //update $store
        vm.$store.dispatch('setCaseId', val)

        //update PouchDB-lastUser
        await vm.$store.dispatch('saveUserToLastuser', {user: vm.user, caseId: val})

        console.log('setWorkspace02')
        if (flag === 2) {
          //initialieze user workspace
          await vm.$store.dispatch('initPouch', {user: vm.user, caseId: val, fctDb: 'fct_org'})
        } else {
          // get user workspace from PouchDb-userDb
          const userData = await vm.$store.dispatch('loadUserDataFromPouch', {
            dbName: vm.$store.getters.userDb,
            dataId: vm.$store.getters.currentPouchID
          })
          vm.$store.dispatch('setFeasibilityCases', userData.feasibilityCases)
          vm.$store.dispatch('setDietCases', userData.dietCases)
        }
        //move to top page
        console.log('login complete')
        vm.email = ''
        vm.password = ''
        await vm.$router.push('/')
      },
    }
  }
</script>

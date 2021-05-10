<template>
  <b-container>
    <b-row>
      <b-col>
        <b-card bg-variant="gray-300" class="mt-3 mb-2">
          <b-form-group label="login option" class="my-0" :state="loginOptionState">
            <b-form-radio v-model="loginOption" value="1">
              <b-icon icon="envelope"/>
              email
            </b-form-radio>
            <b-form-radio v-model="loginOption" disabled value="2">
              <b-icon icon="chat-dots-fill"/>
              SMS
            </b-form-radio>
            <b-form-radio v-model="loginOption" disabled value="3">
              <b-icon icon="google"/>
              Google
            </b-form-radio>
            <b-form-radio v-model="loginOption" disabled value="4">
              <b-icon icon="twitter"/>
              Twitter
            </b-form-radio>
            <b-form-radio v-model="loginOption" disabled value="5">
              <b-icon icon="facebook"/>
              Facebook
            </b-form-radio>
            <b-form-invalid-feedback :state="loginOptionState">Please select one</b-form-invalid-feedback>
          </b-form-group>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="8">
        <span>
          <b-button variant="success" @click="loginUser(loginOption)" :disabled="!loginReady">login</b-button>
          <b-button variant="success" @click="logout" :disabled="!isLogin">logout</b-button>
          <b-button variant="warning" @click="moveToRegister">new user</b-button>
        </span>
        <h6 v-if="isLogin" class="text-danger">please logout first before login/register</h6>
      </b-col>
    </b-row>
    <login-sms name="loginSms" :uid.sync="userId"/>
    <login-email id="loginEmail" @loginEmail="getWorkspace"/>
    <select-workspace
      id="selectWs"
      :workspaceList="$store.state.caseIdList"
      @workspaceSelected="setWorkspace($event,1)"
      @workspaceCreated="setWorkspace($event,2)"/>
  </b-container>
</template>

<script>
  import loginSms from "@/components/molecules/loginSms"
  import loginEmail from "@/components/molecules/loginEmail"
  import selectWorkspace from "@/components/molecules/selectWorkspace"
  import {syncCloudant} from "@/plugins/pouchHelper";

  export default {
    components: {
      loginSms,
      loginEmail,
      selectWorkspace,
    },
    data() {
      return {
        loginOption: 0,
        userId: '',
        user: {},
      }
    },
    computed: {
      isLogin() {
        return (this.$store.state.user.uid !== '')
      },
      loginOptionState() {
        return this.loginOption > 0
      },
      loginReady() {
        return (!this.isLogin && this.loginOption > 0)
      },
      workspaceList() {
        const vm = this
        let res = []
        if (this.$store.caseIdList) {
          res = this.$store.caseIdList.filter(function (val) {
            return val.uid === vm.userId
          })
        }
        return res
      }
    },
    methods: {
      async getWorkspace(val) {
        const vm = this
        vm.userId = val.uid

        //get user information from PouchDB using 'uid' as filter
        const userTemp = await vm.$store.dispatch('loadUserPersonalInfo', vm.userId).catch(async function(err){
          console.log(err)
          throw err
        })
        if (userTemp) {
          vm.user = {...userTemp.user}
        } else {
          throw new Error('there is some problem in getting userInfo in getWorkspace:user_login.vue');
        }

        //update $store
        vm.$store.dispatch('setUser', vm.user)

        //update caseIdList
        vm.$store.dispatch('setCaseIdList',
          await vm.$store.dispatch('getListWorkspace', vm.$store.getters.userDb)
        )

        this.$bvModal.show('selectWs')
      },
      async setWorkspace(val, flag) {
        const vm = this

        //update $store
        vm.$store.dispatch('setCaseId', val)

        //update PouchDB-lastUser
        await vm.$store.dispatch('saveUserToLastuser', {user: vm.user, caseId: val})

        if (flag === 2) {
          //initialieze user workspace
          await vm.$store.dispatch('initPouch', {user: vm.user, caseId: val, fctDb: vm.$store.state.fctDb})
        } else {
          // get user workspace from PouchDb-userDb
          const userData = await vm.$store.dispatch('loadUserDataFromPouch',{
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
      loginUser(val) {
        const val1 = Number(val)
        let isExit = false
        //console.log(val1)
        switch (val1) {
          case 1:
            this.$bvModal.show('loginEmail')
            console.log('1')
            break
          case 2:
            console.log('2')
            break
          case 3:
            console.log('3')
            break
          default:
            isExit = true
            console.log('no selection')
        }
        return !isExit;
      },
      moveToRegister(){
        this.$router.push('/user_reg')
      },
      logout() {
        const vm = this
        this.$store.dispatch('logout').then(function (res) {
          vm.email = ''
          vm.password = ''
          console.log(res)
          vm.$router.push('/')
        })
      },
    },
  }
</script>

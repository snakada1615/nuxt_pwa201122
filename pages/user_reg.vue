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
        <b-card bg-variant="gray-300" class="mt-1 mb-2">
          <b-row class="my-1 py-0">
            <b-col cols="3">workspace name:</b-col>
            <b-col cols="9">
              <b-form-input
                id="caseIdInput"
                v-model="userWorkspace"
                :state="wsState"
                placeholder="workspace name"
                size="sm"
              >
              </b-form-input>
            </b-col>
          </b-row>
        </b-card>
        <b-card bg-variant="gray-300" class="mt-1 mb-2">
          <b-row class="my-1">
            <b-col cols="3">Name:</b-col>
            <b-col cols="9">
              <b-form-input
                id="nameInput"
                v-model="userName"
                placeholder="your name"
                size="sm"
                :state="nameState"
              />
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col cols="3">Country:</b-col>
            <b-col cols="9">
              <b-form-input
                id="countryInput"
                v-model="userCountry"
                placeholder="country"
                size="sm"
              />
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col cols="3">Aera1:</b-col>
            <b-col cols="9">
              <b-form-input
                id="countryInput2"
                v-model="userSubNational1"
                placeholder="Area1"
                size="sm"
              />
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col cols="3">Area2:</b-col>
            <b-col cols="9">
              <b-form-input
                id="countryInput3"
                v-model="userSubNational2"
                placeholder="Area2"
                size="sm"
              />
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col cols="3">Organization:</b-col>
            <b-col cols="9">
              <b-form-input
                id="organizationInput"
                v-model="userOrgainzation"
                placeholder="your organization"
                size="sm"
              />
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col cols="3">Title:</b-col>
            <b-col cols="9">
              <b-form-input
                id="titleInput"
                v-model="userTitle"
                placeholder="your title"
                size="sm"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="8">
        <span>
          <b-button variant="success" @click="registUser(loginOption)" :disabled="!registReady">register</b-button>
          <b-button variant="success" @click="logout" :disabled="!isLogin">logout</b-button>
        </span>
      </b-col>
    </b-row>
    <login-sms name="loginSms" :uid.sync="userId"/>
    <regist-email id="registEmail" @registSuccess="initNewUser($event, userWorkspace)"/>
  </b-container>
</template>

<script>
  import loginSms from "@/components/molecules/loginSms"
  import loginEmail from "@/components/molecules/loginEmail"
  import registEmail from "@/components/molecules/registEmail";
  import {syncCloudant} from "../plugins/pouchHelper";

  export default {
    components: {
      loginSms,
      registEmail,
    },
    data() {
      return {
        loginOption: 0,
        userName: '',
        userCountry: '',
        userSubNational1: '',
        userSubNational2: '',
        userSubNational3: '',
        userOrgainzation: '',
        userTitle: '',
        userWorkspace: '',
        userEmail: '',
        userId: '',
      }
    },
    computed: {
      isLogin() {
        return (this.$store.state.user.uid !== '')
      },
      loginOptionState() {
        return this.loginOption > 0
      },
      registReady() {
        return (!this.isLogin && this.loginOption > 0 && this.nameState && this.wsState)
      },
      nameState() {
        return (/^[a-zA-Z][a-zA-Z .,'-]{1,47}[a-zA-Z]{1,3}$/).test(this.userName)
      },
      wsState() {
        return (/^[a-zA-Z][a-zA-Z .,'-]{1,27}[a-zA-Z]{1,3}$/).test(this.userWorkspace)
      },
      countryState() {
        return (/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/).test(this.userName)
      },
      userInfo(){
        return {
          email: this.userEmail,
          uid: this.userId,
          name: this.userName,
          country: this.userCountry,
          subnational1: this.userSubNational1,
          subnational2: this.userSubNational2,
          subnational3: this.userSubNational3,
          organization: this.userOrgainzation,
          title: this.userTitle,
        }
      }
    },
    methods: {
      async initNewUser(user, workSpace) {
        //create initialized userData
        const userInfo = {
            email: user.email,
            uid: user.uid,
            name: this.userName,
            country: this.userCountry,
            subnational1: this.userSubNational1,
            subnational2: this.userSubNational2,
            subnational3: this.userSubNational3,
            organization: this.userOrgainzation,
            title: this.userTitle,
        }
        const vm = this

        //save initialized userData to $store and PouchDb
        await vm.$store.dispatch('initPouch', {user: userInfo, caseId: workSpace})

        //update PouchDB-userSet
        await vm.$store.dispatch('saveUseToUserSet', {_id: userInfo.uid, user: userInfo})

        //update PouchDB-lastUser
        await vm.$store.dispatch('saveUserToLastuser', {user: userInfo, caseId: workSpace})

        //sync PouchDB(local) with cloudant(remote)
        syncCloudant(vm.$store.state.userInfoDb)

        //move to top page
        console.log('registion complete')
        vm.email = ''
        vm.password = ''
        vm.$router.push('/')
      },
      registUser(val) {
        const val1 = Number(val)
        let isExit = false
        //console.log(val1)
        switch (val1) {
          case 1:
            this.$bvModal.show('registEmail')
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
        if (isExit){
          // exit if register failed
          return false
        }
        return true
      },
      logout() {
        this.$store.dispatch('logout')
        this.email = ''
        this.password = ''
        //this.$router.push('/')
      },
    },
  }
</script>

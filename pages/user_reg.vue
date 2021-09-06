<template>
  <b-container>
    <b-row>
      <b-col>
        <b-card bg-variant="gray-300" border-variant="info" class="mt-3 mb-2">
          <b-form-group label="login option" class="my-0" :state="loginOptionState">
            <b-form-radio v-model="loginOption" value="1">
              <b-icon icon="envelope"/>
              email
            </b-form-radio>
            <b-form-radio v-model="loginOption" value="2">
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
        <b-card bg-variant="info" text-variant="white" class="mt-1 mb-2">
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
        <b-card bg-variant="info" text-variant="white" class="mt-1 mb-2">
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
            <b-col cols="3">Region:</b-col>
            <b-col cols="9">
              <b-form-select v-model="selectedRegion" :options="dat1" size="sm">
                <template #first>
                  <b-form-select-option :value="null" disabled>-- Please select region --</b-form-select-option>
                </template>
              </b-form-select>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col cols="3">Zone:</b-col>
            <b-col cols="9">
              <b-form-select v-model="selectedZone" :options="dat2" size="sm">
                <template #first>
                  <b-form-select-option :value="null" disabled>-- Please select Zone --</b-form-select-option>
                </template>
              </b-form-select>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col cols="3">Woreda:</b-col>
            <b-col cols="9">
              <b-form-select v-model="selectedWoreda" :options="dat3" size="sm">
                <template #first>
                  <b-form-select-option :value="null" disabled>-- Please select Woreda --</b-form-select-option>
                </template>
              </b-form-select>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col cols="3">Village/other</b-col>
            <b-col cols="9">
              <b-form-input
                id="countryInput3"
                v-model="selectedVillage"
                placeholder="target site"
                size="sm"
              />
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col cols="3">AgroEoology</b-col>
            <b-col cols="9">
              <b-form-select v-if="fctList" v-model="selectedFct" :options="fctList" size="sm">
                <template #first>
                  <b-form-select-option :value="null" disabled>-- Please select Agro-Ecology --</b-form-select-option>
                </template>
              </b-form-select>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col cols="3">Organization</b-col>
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
        <h5 v-if="isLogin" class="text-danger">please logout first to register</h5>
      </b-col>
    </b-row>
    <login-sms
      id="loginSms"
      :uid.sync="userId"
      @loginSuccess="initNewUser($event, userWorkspace)"/>
    <regist-email
      id="registEmail"
      @registSuccess="initNewUser($event, userWorkspace)"/>
  </b-container>
</template>

<script>
  import loginSms from "@/components/molecules/loginSms"
  import registEmail from "@/components/molecules/registEmail";
  import {syncRemoteDb} from "../plugins/pouchHelper";

  export default {
    components: {
      loginSms,
      registEmail,
    },
    data() {
      return {
        loginOption: 0,
        userName: '',
        selectedRegion: null,
        selectedZone: null,
        selectedWoreda: null,
        selectedVillage: null,
        selectedFct: null,
        fctList_org: null,

        userOrgainzation: '',
        userTitle: '',
        userWorkspace: '',
        userEmail: '',
        userId: '',
        userPhoneNumber:''
      }
    },
    computed: {
      countryData(){
        return this.$store.state.countryStates
      },
      dat1(){
        return this.countryData.map(function(val){
          if (val.doc.GID_0 === "ETH") {
            return val.doc.NAME_1
          }
        }).filter(function(val2, index2, arr2){
          // val2 == undefined の値も除く
          return arr2.indexOf(val2) === index2 && !!val2
        })
      },
      dat2(){
        let vm = this
        return this.countryData.map(function(val){
          if (val.doc.NAME_1 === vm.selectedRegion) {
            return val.doc.NAME_2
          }
        }).filter(function(val2, index2, arr2){
          // val2 == undefined の値も除く
          return arr2.indexOf(val2) === index2 && !!val2
        })
      },
      dat3(){
        let vm = this
        return this.countryData.map(function(val){
          if (val.doc.NAME_2 === vm.selectedZone) {
            return val.doc.NAME_3
          }
        }).filter(function(val2, index2, arr2){
          // val2 == undefined の値も除く
          return arr2.indexOf(val2) === index2 && !!val2
        })
      },
      fctList(){
        if (this.fctList_org){
          return this.fctList_org.filter(function(val,index,arr){
            return (/^(?=.*eth_aez).*$/).test(val.dbId)
          }).map(function (val2) {
            return val2.description
          })
        } else {
          return ''
        }
      },
      selectedFctDbName(){
        if (this.fctList_org){
          let vm = this
          const res = vm.fctList_org.filter(function (val, index, arr) {
            console.log(val.dbId)
            console.log(vm.selectedFct)
            return val.description === vm.selectedFct
          })
          return res[0]? res[0].dbId:''
        } else {
          return ''
        }
      },
      fileState(){
        return !!this.file1
      },

      isLogin() {
        return (this.$store.state.user.uid !== '')
      },
      loginOptionState() {
        return this.loginOption > 0
      },
      registReady() {
        return (!this.isLogin && this.loginOption > 0 && this.nameState &&
          this.wsState && this.selectedFctDbName)
      },
      nameState() {
        return (/^[a-zA-Z][a-zA-Z .,'-]{1,47}[a-zA-Z]{1,3}$/).test(this.userName)
      },
      wsState() {
        return (/^[a-zA-Z0-9][a-zA-Z0-9 _.,'-]{1,27}[a-zA-Z0-9]{1,3}$/).test(this.userWorkspace)
      },
      countryState() {
        return (/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/).test(this.userName)
      },
      userInfo(){
        return {
          email: this.userEmail,
          uid: this.userId,
          name: this.userName,
          country: this.selectedRegion,
          subnational1: this.selectedZone,
          subnational2: this.selectedWoreda,
          subnational3: this.selectedVillage,
          organization: this.userOrgainzation,
          phoneNumber: this.userPhoneNumber,
          title: this.userTitle,
        }
      }
    },
    mounted() {
      console.log('start')
      this.getFctList()
      console.log('done')
    },
    methods: {
      async getFctList(){
        const res = await this.$store.dispatch('getFctList')
        this.fctList_org = res.rows.map(function (res) {
          return {
            dbId: res.doc.dbId,
            dbName: res.doc.dbName,
            description: res.doc.description,
            creator: res.doc.creator,
            saveDate: res.doc.saveDate
          }
        })
      },
      async initNewUser(user, workSpace) {
        //create initialized userData
        const userInfo = {
            email: user.email,
            uid: user.uid,
            phoneNumber: user.phoneNumber,
            name: this.userName,
            country: this.selectedRegion,
            subnational1: this.selectedZone,
            subnational2: this.selectedWoreda,
            subnational3: this.selectedVillage,
            organization: this.userOrgainzation,
            title: this.userTitle,
        }
        const vm = this

        //save initialized userData to $store and PouchDb
        await vm.$store.dispatch('initPouch', {user: userInfo, caseId: workSpace, fctDb: vm.selectedFctDbName})

        //update PouchDB-userSet
        await vm.$store.dispatch('saveUseToUserSet', {_id: userInfo.uid, user: userInfo})

        //update PouchDB-lastUser
        await vm.$store.dispatch('saveUserToLastuser', {user: userInfo, caseId: workSpace})

        //sync PouchDB(local) with cloudant(remote)
        syncRemoteDb({url:vm.$store.state.cloudantUrl, dbName: vm.$store.state.userInfoDb})
        //syncCloudant(vm.$store.state.userInfoDb)

        //move to top page
        console.log('registion complete')
        vm.userEmail = ''
        vm.userPhoneNumber = ''
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
            this.$bvModal.show('loginSms')
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
        this.userEmail = ''
        this.userPhoneNumber = ''
        //this.$router.push('/')
      },
    },
  }
</script>

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
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="8">
        <span>
          <b-button variant="success" @click="loginUser(loginOption)">delete user</b-button>
        </span>
      </b-col>
    </b-row>
    <login-sms id="loginSms" :uid.sync="userId" @loginSuccess="removeUser"/>
    <login-email id="loginEmail" @loginSuccess="removeUser"/>
  </b-container>
</template>

<script>
  import loginSms from "@/components/molecules/loginSms"
  import loginEmail from "@/components/molecules/loginEmail"

  export default {
    components: {
      loginSms,
      loginEmail,
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
    },
    methods: {
      removeUser(val){
        console.log(val)
        const myName = (val.email ?? val.phoneNumber) ?? val.uid
        let isExecuted = confirm("Are you sure to delete user: " + myName + ' ?');
        if (isExecuted){
          try {
            this.$store.dispatch('removeUser2', val).then(function () {
              console.log('remove success')
            })
          } catch (err) {
            alert(err)
          }
        }
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
        return !isExit;
      },
    },
  }
</script>
